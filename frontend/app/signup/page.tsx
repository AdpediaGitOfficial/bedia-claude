import React from "react";
import SignupForm from "@/components/form/SignupForm";
import Title from "@/components/ui/Title";
import Subtitle from "@/components/ui/Subtitle";
import { Content } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className=" bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2  p-5">
        {/* Left */}
         <div className="hidden lg:block bg-primary h-[calc(100vh-120px)] p-[50px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(/images/banner/signup-banner.png)` }}
              >
  <Link href="/">
           <Image src="/logo-white.svg" alt="Bedia Pottery Logo" width={290} height={31} className='w-[290px] h-[31px]' />
          </Link>
          </div>
        {/* Right */}
        <div className="flex items-center overflow-y-auto scrollbar-hide justify-start px-[17px] sm:px-[40px] lg:px-[90px]">
          <div className="w-full max-w-xl">
            <div className="mb-[60px]">
                <Title className=" mb-4 font-normal !text-[40px]">
                Join Our Creative Community
              </Title>
              <Content className="">
            Sign up to explore workshops, manage bookings, and be part of our creative community.
              </Content>
            </div>

            <SignupForm  />
          </div>
        </div>
      </div>
    </div>
  );
}
