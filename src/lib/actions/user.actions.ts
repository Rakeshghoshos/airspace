'use server';

import { createAdminClient, createSessionClient } from '@/appwrite';
import { appwriteConfig } from '@/appwrite/config';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';
import { cookies } from 'next/headers';
import { avatar } from '@/constants';
import { redirect } from 'next/navigation';

const handleError = (error: unknown, message: string) => {
  console.log(error);
  throw error;
};
const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();
  const result = await database.listDocuments(
    appwriteConfig.databaseId!,
    appwriteConfig.userCollectionId,
    [Query.equal('email', email)]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async (email: string) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, 'failed to send email OTP');
  }
};
export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP(email);

  if (!accountId) throw new Error('failed to send email OTP');

  if (!existingUser) {
    const { database } = await createAdminClient();

    await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        fullname,
        email,
        avatar: avatar,
        accountId,
      }
    );
  }

  return parseStringify({
    accountId,
  });
};

export const verifySecret = async ({ accountId, password }: any) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'failed to verify otp');
  }
};

export const getCurrentUser = async () => {
  try {
    const { database, account } = await createSessionClient();

    const result = await account.get();

    const user = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  } finally {
    redirect('/sign-in');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP(email);
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: 'user not found' });
  } catch (error) {
    handleError(error, 'Failed to sign in user');
  }
};
