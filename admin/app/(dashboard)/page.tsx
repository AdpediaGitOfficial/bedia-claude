'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import { apiError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { getDashboardStats, type DashboardStats } from '@/services/dashboard.service';
import { Users, CalendarCheck, Receipt, TrendingUp } from 'lucide-react';

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </Card>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(apiError(e)));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!stats && !error ? (
        <Spinner label="Loading stats…" />
      ) : stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={String(stats.totalUsers)} icon={Users} hint={`+${stats.newUsersThisMonth} this month`} />
          <StatCard label="Total Bookings" value={String(stats.totalBookings)} icon={CalendarCheck} />
          <StatCard label="Total Orders" value={String(stats.totalOrders)} icon={Receipt} />
          <StatCard
            label="Revenue (this month)"
            value={formatCurrency(stats.currentMonthRevenue)}
            icon={TrendingUp}
            hint={`${stats.growthPercentage >= 0 ? '+' : ''}${stats.growthPercentage}% vs last month`}
          />
        </div>
      ) : null}
    </div>
  );
}
