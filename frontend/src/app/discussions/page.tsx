'use client';

import * as React from 'react';
import { useQuestions, useCreateQuestion, useVoteQuestion } from '@/hooks/useDiscussions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSession } from 'next-auth/react';
import { MessageSquare, Calendar, ChevronUp, ChevronDown, PenTool, Eye, MessageCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DiscussionsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: questions, isLoading, error } = useQuestions();
  const createQuestionMutation = useCreateQuestion();

  // Ask Question Modal States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (title.length < 5) {
      setFormError('Title must be at least 5 characters long.');
      return;
    }
    if (content.length < 10) {
      setFormError('Question description must be at least 10 characters long.');
      return;
    }
    if (!session || !session.user.accessToken) {
      setFormError('You must be signed in to ask a question.');
      return;
    }

    try {
      await createQuestionMutation.mutateAsync({
        title,
        content,
        token: session.user.accessToken,
      });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit question.');
    }
  };

  return (
    <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Header Details */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1">
              <MessageSquare size={14} />
              Q&A Board
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-sans">
              Student Discussion Board
            </h1>
            <p className="text-sm font-semibold text-on-surface-variant max-w-xl">
              Connect with alumni, ask admissions queries, review campus life, and get placement advice.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              if (session) {
                setIsModalOpen(true);
              } else {
                alert('Please sign in to ask a question.');
              }
            }}
            className="flex items-center gap-2 self-start sm:self-center"
          >
            <PenTool size={16} />
            Ask Question
          </Button>
        </div>

        {/* Dynamic Q&A Listing states */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-border-subtle p-5 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4 rounded" variant="text" />
                <Skeleton className="h-4 w-1/2 rounded" variant="text" />
                <div className="flex gap-4 mt-2">
                  <Skeleton className="h-8 w-16 rounded" />
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-border-subtle p-12 text-center rounded-xl shadow-sm">
            <p className="text-lg font-bold text-error">Failed to load discussions</p>
            <Button variant="outline" className="mt-4" onClick={() => router.refresh()}>
              Try Again
            </Button>
          </div>
        ) : questions && questions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {questions.map((q) => (
              <Card
                key={q.id}
                className="bg-white border-border-subtle p-5 rounded-xl hover:shadow-md transition-all flex items-start gap-5 relative group"
              >
                {/* Score Counter Column */}
                <div className="flex flex-col items-center bg-surface-muted border border-border-subtle/50 rounded-xl py-2 px-3 shrink-0">
                  <span className="text-sm font-extrabold text-on-surface leading-none">{q.votes_score}</span>
                  <span className="text-3xs font-extrabold text-outline uppercase tracking-wider mt-1">Votes</span>
                </div>

                {/* Details Column */}
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-base font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
                    <Link href={`/discussions/${q.id}`}>
                      {q.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {q.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs font-semibold text-outline">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(q.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 text-primary">
                      <MessageCircle size={14} />
                      {q.answers_count} Answers
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {q.views} Views
                    </span>
                    <span className="ml-auto text-on-surface-variant font-extrabold">
                      Asked by {q.user_name}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-white border border-border-subtle p-16 text-center rounded-xl shadow-sm flex flex-col items-center gap-5">
            <HelpCircle size={48} className="text-outline/40 animate-bounce" />
            <h3 className="text-xl font-bold text-on-surface">No Questions Posted</h3>
            <p className="text-sm font-semibold text-on-surface-variant max-w-sm">
              Be the first to post a query! Ask about cutoffs, campus reviews, hostels, or university placements.
            </p>
            <Button variant="primary" onClick={() => session ? setIsModalOpen(true) : alert('Sign in first!')}>
              Ask the First Question
            </Button>
          </div>
        )}

        {/* Modal Ask Question form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ask the Community"
        >
          <form onSubmit={handleAskQuestion} className="flex flex-col gap-5">
            <Input
              label="Question Title"
              placeholder="e.g. Is IIT Bombay CS worth the high competitive stress?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={formError && title.length < 5 ? formError : undefined}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface-variant">Question Description</label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Elaborate your question, provide background details, exam ranks, specific branches, or categories..."
                className="w-full bg-white border border-border-subtle rounded-xl p-3 text-sm text-on-surface transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {formError && !title.length && (
              <span className="text-xs text-error font-medium">{formError}</span>
            )}

            <Button
              variant="primary"
              type="submit"
              isLoading={createQuestionMutation.isPending}
              className="w-full mt-2"
            >
              Post Question
            </Button>
          </form>
        </Modal>

      </div>
    </div>
  );
}
