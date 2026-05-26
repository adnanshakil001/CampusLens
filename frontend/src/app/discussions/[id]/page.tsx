'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useQuestionDetail,
  useCreateAnswer,
  useVoteQuestion,
  useVoteAnswer,
} from '@/hooks/useDiscussions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, MessageSquare, ChevronUp, ChevronDown, Calendar, MessageCircle, Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const questionId = Number(params.id);

  // Parallel React Query fetch
  const { data, isLoading, error } = useQuestionDetail(questionId);

  // Submit operations
  const [answerContent, setAnswerContent] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);

  const createAnswerMutation = useCreateAnswer(questionId);
  const voteQuestionMutation = useVoteQuestion(questionId);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (answerContent.length < 5) {
      setFormError('Your answer must be at least 5 characters long.');
      return;
    }
    if (!session || !session.user.accessToken) {
      setFormError('You must be signed in to submit an answer.');
      return;
    }

    try {
      await createAnswerMutation.mutateAsync({
        content: answerContent,
        token: session.user.accessToken,
      });
      setAnswerContent('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to post answer.');
    }
  };

  const handleQuestionVote = async (voteType: 'up' | 'down') => {
    if (!session || !session.user.accessToken) {
      alert('Sign in to vote.');
      return;
    }
    try {
      await voteQuestionMutation.mutateAsync({
        voteType,
        token: session.user.accessToken,
      });
    } catch (err) {
      // Handled silently
    }
  };

  const handleAnswerVote = async (answerId: number, voteType: 'up' | 'down') => {
    if (!session || !session.user.accessToken) {
      alert('Sign in to vote.');
      return;
    }
    // Perform fetch call manually or trigger answer-specific mutation hook
    try {
      await apiFetch(`/discussions/answers/${answerId}/vote`, {
        method: 'POST',
        token: session.user.accessToken,
        body: JSON.stringify({ voteType }),
      });
      // Invalidate query manually
      router.refresh();
    } catch (err) {
      // Handled silently
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 flex flex-col gap-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-grow bg-[#fcf9f8] flex flex-col items-center justify-center p-12 min-h-screen">
        <h3 className="text-xl font-bold text-error">Question not found</h3>
        <Link href="/discussions" className="mt-4">
          <Button variant="primary">Back to Q&A Board</Button>
        </Link>
      </div>
    );
  }

  const { question, answers } = data;

  return (
    <div className="flex-grow bg-[#fcf9f8] py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        
        {/* Back Link */}
        <Link
          href="/discussions"
          className="inline-flex items-center gap-2 text-xs font-bold text-outline hover:text-primary transition-colors active:scale-95 self-start"
        >
          <ArrowLeft size={14} />
          Back to Discussions
        </Link>

        {/* Main Question Post Thread Card */}
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm flex items-start gap-6 relative">
          {/* Left Voting Column */}
          <div className="flex flex-col items-center gap-1 bg-surface-muted/50 border border-border-subtle/50 rounded-xl py-2 px-1 shrink-0">
            <button
              onClick={() => handleQuestionVote('up')}
              className="p-1 hover:text-primary active:scale-90 transition-all text-outline"
            >
              <ChevronUp size={22} />
            </button>
            <span className="text-sm font-extrabold text-on-surface leading-none">{question.votes_score}</span>
            <button
              onClick={() => handleQuestionVote('down')}
              className="p-1 hover:text-error active:scale-90 transition-all text-outline"
            >
              <ChevronDown size={22} />
            </button>
          </div>

          {/* Right details content */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary" className="font-extrabold text-white border-none py-0.5 px-2">
                Thread Topic
              </Badge>
              <span className="text-3xs font-extrabold uppercase tracking-wider text-outline">
                Posted by {question.user_name}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-on-surface leading-snug font-sans">
              {question.title}
            </h2>

            <p className="text-sm font-semibold text-on-surface-variant leading-relaxed bg-surface-muted/30 border border-border-subtle/30 p-4 rounded-xl whitespace-pre-line">
              {question.content}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-xs font-semibold text-outline">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(question.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5 text-primary">
                <MessageCircle size={14} />
                {answers.length} Responses
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {question.views} Views
              </span>
            </div>
          </div>
        </Card>

        {/* Answers List Divider */}
        {answers.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <h3 className="text-sm font-extrabold text-on-surface-variant uppercase tracking-wider pl-2">
              Community Responses ({answers.length})
            </h3>

            {answers.map((ans) => (
              <Card
                key={ans.id}
                className="bg-white border-border-subtle p-5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-start gap-5"
              >
                {/* Score Counter Column */}
                <div className="flex flex-col items-center bg-surface-muted border border-border-subtle/50 rounded-xl py-1 px-2.5 shrink-0">
                  <span className="text-xs font-extrabold text-on-surface leading-none">{ans.votes_score}</span>
                  <span className="text-3xs font-extrabold text-outline uppercase tracking-wider mt-0.5">Votes</span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-primary">{ans.user_name}</span>
                    <span className="text-3xs font-semibold text-outline">
                      {new Date(ans.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface-variant leading-relaxed">
                    {ans.content}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Write Answer Form */}
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm mt-4 flex flex-col gap-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <MessageSquare size={18} className="text-primary animate-pulse" />
            Your Community Answer
          </h3>

          <form onSubmit={handlePostAnswer} className="flex flex-col gap-4">
            <textarea
              rows={4}
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder={
                session
                  ? "Share your insights, advice, recommendations, cutoffs brackets, or college experiences..."
                  : "Please sign in to write an answer on this thread..."
              }
              disabled={!session}
              className="w-full bg-surface-muted/20 border border-border-subtle rounded-xl p-3 text-sm text-on-surface transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 disabled:bg-surface-muted"
            />

            {formError && <span className="text-xs text-error font-medium">{formError}</span>}

            <Button
              variant="primary"
              type="submit"
              isLoading={createAnswerMutation.isPending}
              disabled={!session}
              className="self-start"
            >
              Post Answer
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
}

// Inline fallback for apiFetch in file inside answer vote handler
import { apiFetch } from '@/lib/api';
