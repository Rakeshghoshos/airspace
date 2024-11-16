'use client';
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import Image from 'next/image';
import { Button } from './ui/button';
import { verifySecret } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import { sendEmailOTP } from '@/lib/actions/user.actions';

const OtpModel = ({ email, accountId }: { email: string; accountId: any }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) router.push('/');
    } catch (error) {
      console.log('failed to verify error', error);
    }
    setIsloading(false);
  };

  const handleResentOtp = async () => {
    await sendEmailOTP(email);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog flex flex-col items-center">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We have sent an OTP to{' '}
            <span className="pl-1 text-brand">
              {email ? email : 'contact@gmail.com'}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />

            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter>
          <div className="flex gap-4 w-full flex-col">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </AlertDialogAction>

            <div className="subtitle-2 text-center text-light-100">
              Did'nt get OTP ?
              <Button
                type="button"
                variant="link"
                onClick={handleResentOtp}
                className="text-brand pl-1"
              >
                click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModel;
