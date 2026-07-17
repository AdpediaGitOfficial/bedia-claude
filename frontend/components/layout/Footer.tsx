'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { footerLinks, socialMedia,  } from "@/constants/data";
import Image from "next/image";
import { Content } from "../ui";
import { getOpeningHours, OpeningHour } from "@/services/hero.service";

const Footer: React.FC = () => {
const [openingHours, setOpeningHours] = useState<OpeningHour | null>(null);

useEffect(() => {
  const loadOpeningHours = async () => {
    try {
      const data = await getOpeningHours();
      console.log("Opening Hours Data:", data);
      setOpeningHours(data?.openingHours[0]);
    } catch (error) {
      console.error(error);
    }
  };

  loadOpeningHours();
}, []);
  return (
    <footer className="bg-primary page-wrapper text-secondary-off">
      <div className="  md:pt-14 pt-10 md:pb-8 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-16 gap-6 md:mb-8 mb-5">
          {/* Left Column - Logo and Description */}
          <div className="space-y-[30px] md:mt-16 mt-6">
            <Link href="/">
              <Image
                src="/logo-white.svg"
                alt="Bedia Pottery Logo"
                width={290}
                height={31}
              />
            </Link>
            <Content className="  !text-secondary-off mb-2.5">
              A Premium Ceramic Studio Offers A Unique Fusion Of Art, Mental
              Health & Fun!
            </Content>
            {/* <div className="relative  overflow-hidden h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.198509554!2d55.2703!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTMuMSJF!5e0!3m2!1sen!2sae!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <div className="absolute bottom-2 right-2 bg-gray-200/90 px-3 py-1.5 rounded flex items-center gap-1.5 text-gray-700 text-sm cursor-pointer hover:bg-gray-300/90 transition-colors">
                <span>View large map</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
            </div> */}
          </div>

          {/* Middle-Left Column - Links */}
          <div className="md:mt-16 mt-6">
            <h3 className=" 2xl:text-2xl  xl:text-xl font-medium md:mb-10 mb-5">Links</h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-off hover:text-white transition-colors duration-200 2xl:text-[22px]  xl:text-lg font-normal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Middle-Right Column - Opening Hours */}
          <div className="md:mt-16 mt-6">
            <h3 className="font-semibold md:mb-10 mb-5 2xl:text-2xl  xl:text-xl">Opening Hours</h3>
            <ul className="space-y-4  2xl:text-[22px]  xl:text-lg">
              <li>
                <p className="font-normal">{openingHours?.days}</p>
                <p className="font-light">{openingHours?.openTime} - {openingHours?.closeTime}</p>
              </li>
              {/* <li className="md:mt-4 mt-2">
                <p className="font-normal">{openingHours.sunday.days}</p>
                <p className="font-light">{openingHours.sunday.hours}</p>
              </li> */}
            </ul>
          </div>

          {/* Right Column - Newsletter & Social Media */}
          <div className="md:mt-16 mt-6">
            <h3 className=" 2xl:text-2xl  xl:text-xl font-medium md:mb-10 mb-5">Contact Us</h3>
            <div className="mb-6 space-y-4">
              <a
                href="mailto:info@bedia-pottery.com"
                className="flex items-center gap-3 text-secondary-off transition-colors duration-200 hover:border-white hover:text-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-off/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m4 8 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                    <p className="font-light">info@bedia-pottery.com</p>
                </span>
              </a>

              <a
                href="https://wa.me/971569569088"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-secondary-off transition-colors duration-200 hover:border-white hover:text-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary-off/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.6 19.4 5 21l1.6-1.6a9.8 9.8 0 1 0-2.3-2.3L6.6 19.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.5 9.3h.01M12 9.3h.01M15.5 9.3h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>
                 <p className="font-light">+971 56 956 9088</p>
                </span>
              </a>
            </div>

            <div className="md:mb-4 mb-2">
              <h3 className=" 2xl:text-2xl  xl:text-xl font-medium md:mb-10 mb-5">Follow Us On:</h3>
              <div className="flex gap-8">
                {socialMedia.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full border-[0.5px] border-secondary-off flex items-center justify-center hover:border-white/50 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={24}
                      height={24}
                      className="w-7 h-7"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className=" md:pt-12 pt-8 md:flex justify-between items-center ">
          <Content className="  !text-secondary-off ">
            Made With Love By Bedia Pottery LLC © 2023
          </Content>
          <Content className="  !text-secondary-off  md:mt-0 mt-4">
            <Link href="/privacy" className="">
              Privacy Policy
            </Link>
          </Content>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
