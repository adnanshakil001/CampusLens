'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSavedColleges, useUnsaveCollegeAction } from '@/hooks/useUser';
import { CollegeGrid } from '@/components/colleges/CollegeGrid';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { LayoutDashboard, Heart, GraduationCap, ArrowRight, UserCheck, ShieldAlert, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to sign in if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Fetch saved colleges using mutation token
  const token = session?.user?.accessToken;
  const { data: savedColleges, isLoading } = useSavedColleges(token);
  const unsaveMutation = useUnsaveCollegeAction();

  const handleUnsaveToggle = async (id: number) => {
    if (!token) return;
    try {
      await unsaveMutation.mutateAsync({
        collegeId: id,
        token,
      });
    } catch (err) {
      // Handled silently
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-grow bg-[#fcf9f8] flex flex-col items-center justify-center p-12 min-h-screen">
        <ShieldAlert size={48} className="text-error mb-4" />
        <h3 className="text-xl font-bold text-on-surface">Access Denied</h3>
        <p className="text-sm font-semibold text-on-surface-variant mt-2 text-center max-w-xs">
          You must be logged in to view your dashboard profile.
        </p>
        <Link href="/auth/login" className="mt-6">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Profile Welcome Banner Card */}
        <Card className="bg-primary text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Top colored accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-secondary" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-white font-extrabold text-2xl uppercase">
              {session.user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-sans">{session.user.name}</h2>
                <UserCheck size={18} className="text-secondary animate-pulse" />
              </div>
              <p className="text-sm text-white/70 font-semibold mt-1">{session.user.email}</p>
            </div>
          </div>

          <div className="shrink-0 relative z-10 flex gap-3">
            <Link href="/colleges">
              <Button variant="secondary" className="flex items-center gap-1.5">
                <span>Browse Catalog</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Dashboard Panels Layout */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-on-surface-variant flex items-center gap-2 uppercase tracking-wider pl-2">
            <Heart size={18} className="text-secondary fill-secondary" />
            My Saved Colleges ({savedColleges?.length || 0})
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : savedColleges && savedColleges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedColleges.map((college) => {
                const formatFees = (amount: number) => {
                  if (amount >= 100000) {
                    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
                  }
                  return `₹${amount.toLocaleString('en-IN')}`;
                };
                return (
                  <Card key={college.id} className="bg-white border-border-subtle p-5 rounded-xl hover:shadow-md transition-all flex flex-col h-full justify-between gap-5 relative group">
                    <div className="flex gap-4">
                      {/* Logo */}
                      <div className="h-12 w-12 border border-border-subtle p-1 bg-surface rounded-xl shadow-2xs shrink-0 flex items-center justify-center">
                        {college.logo_url ? (
                          <img src={college.logo_url} alt="" className="h-full w-full object-contain rounded-lg" />
                        ) : (
                          <GraduationCap size={24} className="text-outline" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-on-surface line-clamp-1 leading-snug group-hover:text-primary transition-colors">
                          {college.name}
                        </h4>
                        <p className="text-xs font-semibold text-on-surface-variant mt-1">{college.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border-subtle/50 pt-4 mt-auto">
                      <span className="text-xs font-extrabold text-primary">{formatFees(college.fees)} / yr</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnsaveToggle(college.id)}
                          className="text-error hover:bg-error/5"
                        >
                          Unsave
                        </Button>
                        <Link href={`/colleges/${college.slug}`}>
                          <Button variant="primary" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Saved list empty state
            <div className="bg-white border border-border-subtle p-16 text-center rounded-xl shadow-sm flex flex-col items-center gap-5 max-w-2xl mx-auto w-full">
              <Landmark size={48} className="text-outline/40 animate-bounce" />
              <h4 className="text-lg font-bold text-on-surface">No Saved Colleges</h4>
              <p className="text-sm font-semibold text-on-surface-variant">
                You haven't bookmarked any colleges yet. Start exploring and click the heart icon on any card to save it here.
              </p>
              <Link href="/colleges">
                <Button variant="outline">Explore Catalog</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
