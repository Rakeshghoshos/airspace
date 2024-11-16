'use client';

import { z } from 'zod';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { createAccount, signInUser } from '@/lib/actions/user.actions';
import OtpModel from './OtpModel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type formType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: formType) => {
  return z.object({
    email: z.string().email(),
    fullname:
      formType == 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
  });
};
const AuthForm = ({ type }: { type: formType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      fullname: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const user =
        type === 'sign-up'
          ? await createAccount({
              fullname: values.fullname || '',
              email: values.email,
            })
          : await signInUser({ email: values.email });
      if (user.accountId == null) setIsDialogOpen(true);
      setAccountId(user.accountId);
    } catch {
      setErrorMessage('failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {' '}
            {type == 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          {type == 'sign-up' && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="full name.."
                        {...field}
                        className="shad-input"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email.."
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type == 'sign-in' ? 'Sign In' : 'Sign Up'}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={20}
                height={20}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p>
              {type == 'sign-in'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Link
                href={type == 'sign-in' ? '/sign-up' : '/sign-in'}
                className="cursor-pointer text-light-100 underline"
              >
                {type == 'sign-in' ? 'Sign Up' : 'Sign In'}
              </Link>
            </p>
          </div>
        </form>
      </Form>
      {/* otp verification */}
      {accountId ? (
        <OtpModel email={form.getValues('email')} accountId={accountId} />
      ) : (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <button className="hidden" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Not Found</AlertDialogTitle>
              <AlertDialogDescription>
                No User Found Please Sign-up if you don't have an account or try
                again later
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default AuthForm;
