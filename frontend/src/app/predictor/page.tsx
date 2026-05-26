'use client';

import * as React from 'react';
import { usePredictorExams, usePredictColleges, PredictionResult } from '@/hooks/usePredictor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, Sparkles, AlertCircle, MapPin, ChevronRight, BookOpen, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PredictorPage() {
  const { data: exams, isLoading: isExamsLoading } = usePredictorExams();
  const predictMutation = usePredictColleges();

  // Form states
  const [exam, setExam] = React.useState('');
  const [rank, setRank] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [quota, setQuota] = React.useState('AI');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (exams && exams.length > 0 && !exam) {
      setExam(exams[0]);
    }
  }, [exams, exam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userRank = Number(rank);
    if (!exam || isNaN(userRank) || userRank <= 0) {
      setError('Please enter a valid positive rank.');
      return;
    }

    try {
      await predictMutation.mutateAsync({
        exam,
        rank: userRank,
        category,
        quota,
      });
    } catch (err: any) {
      setError(err.message || 'Prediction failed. Try again.');
    }
  };

  const categoryOptions = [
    { value: 'General', label: 'General / Open' },
    { value: 'OBC', label: 'OBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
    { value: 'EWS', label: 'EWS' },
  ];

  const quotaOptions = [
    { value: 'AI', label: 'All India (AI)' },
    { value: 'HS', label: 'Home State (HS)' },
  ];

  const examOptions = React.useMemo(() => {
    if (!exams) return [];
    return exams.map((ex) => ({ value: ex, label: ex }));
  }, [exams]);

  return (
    <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Title Details */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1">
            <GraduationCap size={16} />
            Admission Predictor
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-sans">
            Indian Colleges Rank Predictor
          </h1>
          <p className="text-sm font-semibold text-on-surface-variant max-w-xl">
            Input your exam scores (JEE Main, JEE Advanced) to view which premium branches and colleges fall within your admission cutoff brackets.
          </p>
        </div>

        {/* Predictor Form & Matches Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Inputs Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-5">
              <h3 className="text-base font-bold text-on-surface pb-3 border-b border-border-subtle flex items-center gap-2">
                <Sparkles size={18} className="text-secondary" />
                Rank Calculator
              </h3>

              {isExamsLoading ? (
                <div className="h-10 bg-surface-muted animate-pulse rounded" />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Select
                    label="Entrance Exam"
                    options={examOptions}
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                  />

                  <Input
                    label="Enter Your Rank / Score"
                    placeholder="e.g. 2500"
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  />

                  <Select
                    label="Caste Category"
                    options={categoryOptions}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />

                  <Select
                    label="Home State Quota"
                    options={quotaOptions}
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                  />

                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-error/5 text-error rounded-lg text-xs font-semibold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    isLoading={predictMutation.isPending}
                    className="w-full mt-2"
                  >
                    Predict Colleges
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Matches Output List */}
          <div className="lg:col-span-2">
            {predictMutation.isSuccess && predictMutation.data ? (
              predictMutation.data.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <p className="text-sm font-extrabold text-on-surface-variant uppercase tracking-wider">
                    Found {predictMutation.data.length} Matching Engineering Options
                  </p>

                  <div className="flex flex-col gap-4">
                    {predictMutation.data.map((pred) => {
                      const collegeRating = typeof pred.rating === 'string' ? parseFloat(pred.rating) : pred.rating;
                      return (
                        <Card
                          key={pred.id}
                          className="bg-white border-border-subtle p-5 rounded-xl hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden group"
                        >
                          <div className="flex gap-4">
                            {/* Logo */}
                            <div className="h-12 w-12 border border-border-subtle bg-surface p-1 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                              {pred.logo_url ? (
                                <img src={pred.logo_url} alt="" className="h-full w-full object-contain rounded-lg" />
                              ) : (
                                <GraduationCap size={24} className="text-outline" />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant={
                                    pred.chance === 'Safe'
                                      ? 'success'
                                      : pred.chance === 'Target'
                                      ? 'primary'
                                      : 'secondary'
                                  }
                                  className="font-extrabold text-white border-none py-0.5 px-2.5"
                                >
                                  {pred.chance} Chance
                                </Badge>
                                <span className="text-2xs font-semibold text-outline">
                                  Cutoff: {pred.rank_cutoff} (2025)
                                </span>
                              </div>

                              <h4 className="text-base font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                                {pred.branch}
                              </h4>
                              
                              <p className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                                <MapPin size={12} className="text-outline" />
                                {pred.college_name} · <span className="text-outline">{pred.location}</span>
                              </p>
                            </div>
                          </div>

                          {/* CTA & price */}
                          <div className="flex items-center justify-between md:flex-col md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle/40">
                            <div className="text-left md:text-right">
                              <p className="text-3xs font-bold text-outline uppercase tracking-wider">Annual Fees</p>
                              <p className="text-sm font-extrabold text-primary">
                                ₹{(pred.fees / 100000).toFixed(2)} Lakhs
                              </p>
                            </div>
                            
                            <Link href={`/colleges/${pred.college_slug}`}>
                              <Button variant="outline" size="sm" className="flex items-center gap-1.5 pr-2">
                                <span>College Info</span>
                                <ChevronRight size={14} />
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-border-subtle p-16 text-center rounded-xl shadow-sm flex flex-col items-center gap-4">
                  <ShieldAlert size={48} className="text-outline/40 animate-pulse" />
                  <h3 className="text-lg font-bold text-on-surface">No Predictions Match</h3>
                  <p className="text-sm font-semibold text-on-surface-variant max-w-sm">
                    Your entered rank was too high compared to the closing cutoffs recorded for selected caste categories in 2025.
                  </p>
                </div>
              )
            ) : (
              // Empty calculator state
              <div className="bg-white border border-border-subtle p-16 text-center rounded-xl shadow-sm flex flex-col items-center gap-4 h-full justify-center">
                <BookOpen size={48} className="text-outline/30 animate-pulse" />
                <h3 className="text-lg font-bold text-on-surface">Predictions Console</h3>
                <p className="text-sm font-semibold text-on-surface-variant max-w-sm">
                  Provide your caste categories, Home State Quotas, and JEE entrance ranks inside the calculator to trigger predictions matching.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
