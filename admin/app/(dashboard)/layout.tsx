'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [ready, setReady] = useState(false);

  // Client-side guard: wait for the persisted store to hydrate, then redirect
  // unauthenticated users to /login.
  useEffect(() => {
    if (!token) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [token, router]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="text-sm text-gray-500">Bedia Privé — Content Management</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
            <button
              onClick={() => {
                logout();
                router.replace('/login');
              }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
