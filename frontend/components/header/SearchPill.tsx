"use client";

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SearchPill() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const getToken = useAuthStore((state) => state.getToken);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = getToken();
  useEffect(() => {
   console.log('Current auth token:', token);
  }, [token]);
  const user : string | null = useAuthStore.getState().user?.email || null

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 !md:gap-8 xl:gap-4 2xl:gap-8 bg-primary rounded-full px-3 py-2 lg:px-[20px] lg:py-[12px]">
      
      {/* Cart Icon */}
      <Link
        href="/cart"
        className="text-secondary-off shrink-0 hover:text-white transition-colors duration-200"
        aria-label="Shopping cart"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 lg:w-6 lg:h-6"
        >
          <path
            d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* Profile Dropdown */}
      <div className="relative flex items-center justify-center" ref={dropdownRef}>
        <button
          onClick={() => {
            user ?(setUserMenuOpen(prev => !prev)):(router.push("/login"));
            
          }}
          className="text-secondary-off shrink-0 hover:text-white transition-colors duration-200"
          aria-label="User account"
        >
          <svg
            width="20"
            height="22"
            viewBox="0 0 24 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 lg:w-5 lg:h-[22px]"
          >
            <path
              d="M11.6377 0.866211C14.8732 0.86644 17.5215 3.51543 17.5215 6.75098C17.5213 9.98636 14.8731 12.6345 11.6377 12.6348C8.40219 12.6348 5.75313 9.9865 5.75293 6.75098C5.75293 3.51528 8.40202 0.866211 11.6377 0.866211Z"
              stroke="currentColor"
              strokeWidth="1.73333"
              fill="none"
            />
            <path
              d="M6.70898 14.8525C6.71648 14.8511 6.74084 14.849 6.77832 14.8584C6.81617 14.8679 6.84991 14.8851 6.87305 14.9023L6.87891 14.9062C8.26987 15.9329 9.92532 16.4609 11.6387 16.4609C13.352 16.4609 15.0075 15.9329 16.3984 14.9062L16.4033 14.9023C16.4181 14.8913 16.503 14.8524 16.6426 14.8643C18.6087 15.1407 20.374 16.198 21.5908 17.8125L21.8281 18.1436L21.833 18.1514C22.0384 18.4481 22.2145 18.7556 22.3545 19.0723C22.1497 19.4248 21.9183 19.7616 21.6523 20.1074L21.6465 20.1143L21.6416 20.1211C21.2674 20.6288 20.8315 21.0943 20.3701 21.5557C19.985 21.9407 19.5448 22.3259 19.1084 22.6533C16.9317 24.2788 14.3139 25.1337 11.6094 25.1338C8.91142 25.1338 6.29952 24.2829 4.12598 22.665C3.65205 22.28 3.22008 21.9281 2.84766 21.5557L2.8291 21.5371L2.49219 21.2051C2.16476 20.8675 1.86313 20.5106 1.57617 20.1211L1.57227 20.1152L1.18457 19.5781C1.08301 19.4299 0.987133 19.2792 0.898438 19.1309C1.04927 18.7959 1.23861 18.4485 1.44434 18.1514L1.4541 18.1357C2.6427 16.3398 4.54452 15.1518 6.65625 14.8613L6.68262 14.8574L6.70898 14.8525Z"
              stroke="currentColor"
              strokeWidth="1.73333"
              fill="none"
            />
          </svg>
        </button>

          {userMenuOpen && user && (
          <div className="absolute right-0 top-[calc(100%+14px)] w-[220px] bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-50">
            
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-1">
                Signed in as
              </p>

              <p className="text-sm font-semibold text-[#113224]">
                {user}
              </p>
            </div>

            {/* <Link
              href="/profile"
              className="block px-5 py-4 text-sm font-medium text-[#113224] hover:bg-gray-50 transition-colors"
            >
              My Profile
            </Link> */}
{token ? (
  <button
    onClick={() => {
      logout();
      setUserMenuOpen(false);
      router.push("/");
    }}
    className="w-full text-left px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
  >
    Logout
  </button>
) : (
  <button
    onClick={() => {
      setUserMenuOpen(false);
      router.push("/login");
    }}
    className="w-full text-left px-5 py-4 text-sm font-medium text-[#113224] hover:bg-gray-50 transition-colors"
  >
    Login
  </button>
)}
          </div>
        )}
      </div>
    </div>
  );
}