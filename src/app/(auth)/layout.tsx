import Image from 'next/image';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430] flex-col justify-center space-y-7">
          <Image
            src="/favicon.ico"
            alt="logo"
            width={100}
            height={100}
            className="h-auto rounded-full"
          />
          <div className="space-y-5 text-airspace-lightblue">
            <h1 className="h1">Manage your files with ease</h1>
            <p className="body-1">one account to manage all of your files</p>
          </div>
          <Image
            src="/illustration.jpg"
            alt="files"
            width={500}
            height={500}
            className="m-4 rounded-2xl transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:py-0 lg:p-10">
        <div className="mb-16 lg:hidden">
          <Image
            src="/favicon.ico"
            width={224}
            height={82}
            alt="logo"
            className="h-auto w-[200px] lg:w-[250px] rounded-full"
          />
        </div>
        {children}
      </section>
    </div>
  );
};

export default layout;
