'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { navigationItems } from '@/constants/data'
import Image from 'next/image'
import { Content } from '../ui'
import SearchPill from '../header/SearchPill'
import { ChevronDown, Menu, X, Instagram, Facebook, Linkedin } from 'lucide-react'

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (href: string) => {
    setOpenDropdown((prev) => (prev === href ? null : href))
  }

  // STOPS SCROLLING COMPLETELY WHEN MOBILE MENU IS OPEN
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* Standard Desktop/Mobile Header Topbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
        <nav className="page-wrapper py-[7px] px-[17px] relative bg-white z-50">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image 
                src="/logo.svg" 
                alt="Bedia Pottery Logo" 
                width={290} 
                height={31} 
                className="w-[180px] h-auto md:w-[290px] md:h-[31px]" 
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center 2xl:gap-[50px] xl:gap-6">
              {navigationItems.map((item) =>
                item.children ? (
                  <div key={item.href} className="relative group">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Content className="hover:text-primary transition-colors duration-200">
                        {item.label}
                      </Content>
                      <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition-colors duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={item.href} href={item.href} target={item.target}>
                    <Content className="hover:text-primary transition-colors duration-200">
                      {item.label}
                    </Content>
                  </Link>
                )
              )}
              <SearchPill />
            </div>

            {/* Mobile Burger Trigger Button */}
            <div className="flex lg:hidden items-center md:gap-[3rem] gap-5">
              <SearchPill />
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="p-1 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* FULL-SCREEN VIBRANT RESPONSIVE MOBILE OVERLAY DRAWER */}
      <div 
        className={`fixed inset-0 bg-white text-primary z-[100] lg:hidden flex flex-col justify-between p-6 pt-4 transition-all duration-300
          ${mobileOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
      >
        {/* Top Header Block Inside Menu Screen */}
        <div className="w-full flex items-center justify-between">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            {/* White variant logo file suggested here to stand out over vibrant color background */}
           <Image 
                src="/logo.svg" 
                alt="Bedia Pottery Logo" 
                width={290} 
                height={31} 
                className=" h-auto w-[290px] md:h-[31px]" 
              />
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="p-2 text-primary hover:opacity-80 transition-opacity"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Main Vertical Link Elements Center List */}
        <div className="flex-1 flex flex-col justify-center gap-5 my-auto overflow-y-auto max-h-[65vh] pr-2">
          {navigationItems.map((item) =>
            item.children ? (
              <div key={item.href} className="w-full">
                <button
                  onClick={() => toggleDropdown(item.href)}
                  className="flex items-center justify-between w-full py-2 text-xl font-bold tracking-wide uppercase text-left"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-white/80 transition-transform duration-200 ${openDropdown === item.href ? 'rotate-180' : ''}`}
                  />
                </button>
                  <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-white/30">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-lg font-medium text-primary hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-xl font-bold tracking-wide uppercase hover:text-primary/80 transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Social Icons Footer Grid Row */}
        <div className="flex items-center gap-6 pt-4 border-t border-white/20">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 transition-opacity">
            <Instagram className="w-7 h-7" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 transition-opacity">
            <Facebook className="w-7 h-7" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-primary hover:opacity-80 transition-opacity">
            <Linkedin className="w-7 h-7" />
          </a>
        </div>
      </div>
    </>
  )
}

export default Header