import { BookOpen, CircleCheckBig } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { BackLink, Button, ConfirmationDialog } from '@shared/ui';

import { learningSummary } from '../../lib';
import { useLearnSession } from '../../model/hooks/useLearnSession';

import { LearnProgress } from '../learn-progress';
import { LearnQuestion } from '../learn-question';

import styles from './styles.modules.scss';

interface LearnProps {
  moduleId: string;
}

export const Learn = ({ moduleId }: LearnProps) => {
  const { session, mutation } = useLearnSession(moduleId);

  if (session.isPending) {
    return <p>Loading your learning session…</p>;
  }
  if (session.error || !session.data) {
    return (
      <div role="alert">
        <p>{session.error?.message ?? 'Session unavailable.'}</p>
        <Button
          onClick={() => {
            void session.refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }
  const learningSession = session.data;
  const summary = learningSummary(learningSession);

  return (
    <section className={styles.learn}>
      <BackLink to={generatePath(routes.studyModule, { moduleId: moduleId })}>Module overview</BackLink>
      <header className={styles.learnHeader}>
        <span>{learningSession.reviewOnly ? 'REVIEW SESSION' : 'LEARN YOUR WORDS'}</span>
        <h1>Practise your vocabulary.</h1>
        <p>Answer a few questions to practise each word. We’ll revisit the ones you find tricky.</p>
      </header>
      <LearnProgress session={learningSession} />
      {learningSession.question ? (
        <LearnQuestion
          key={learningSession.question.id}
          session={learningSession}
          pending={mutation.isPending}
          onAnswer={(answer) => {
            if (!mutation.isPending) {
              mutation.mutate({ action: 'answer', answer });
            }
          }}
          onContinue={() => {
            mutation.mutate({ action: 'continue' });
          }}
          onOverride={() => {
            mutation.mutate({ action: 'override' });
          }}
        />
      ) : (
        <section className={styles.learnComplete}>
          <header className={styles.learnCompleteHeader}>
            <span className={styles.learnCompleteIcon}>
              <CircleCheckBig size={25} />
            </span>
            <div>
              <span>SESSION COMPLETE</span>
              <h2>
                {learningSession.cards.length
                  ? 'Every word is mastered.'
                  : 'Add a word to start practising.'}
              </h2>
              <p>
                {learningSession.cards.length
                  ? 'Nice work. Your full session is saved and ready for a quick review anytime.'
                  : 'Build your module first, then come back here to practise it.'}
              </p>
            </div>
          </header>
          <dl className={styles.learnCompleteMetrics}>
            <div>
              <dt>Mastered</dt>
              <dd>{summary.levels[3]}</dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>{learningSession.total}</dd>
            </div>
            <div>
              <dt>Correct</dt>
              <dd>{learningSession.correct}</dd>
            </div>
            <div>
              <dt>Accuracy</dt>
              <dd>{summary.accuracy}%</dd>
            </div>
          </dl>
          <footer className={styles.learnCompleteFooter}>
            <span>{learningSession.total - learningSession.correct} answers still needed another try.</span>
            <Button asChild variant="secondary">
              <Link to={generatePath(routes.studyActivity, { moduleId: moduleId, mode: 'flashcards' })}>
                <BookOpen size={17} />
                Review with flashcards
              </Link>
            </Button>
          </footer>
        </section>
      )}
      {mutation.error && (
        <p role="alert">
          {mutation.error.message} Your last confirmed progress is preserved. Retry, or reload to resume the
          saved session.
        </p>
      )}
      <div className={styles.learnActions}>
        <ConfirmationDialog
          title="Review all words?"
          description="Your current session will end and a new review will begin. Your mastery and answer history will be kept."
          confirmLabel="Start review"
          onConfirm={() => {
            return mutation.mutateAsync({ action: 'review' });
          }}
        >
          <Button variant="secondary" disabled={mutation.isPending}>
            Review all words
          </Button>
        </ConfirmationDialog>
        <ConfirmationDialog
          title="Reset mastery and restart?"
          description="All words will return to the starting level and a new session will begin. Your answer history and flashcard statuses will be kept."
          confirmLabel="Reset and restart"
          destructive
          onConfirm={() => {
            return mutation.mutateAsync({ action: 'fresh' });
          }}
        >
          <Button variant="ghost" disabled={mutation.isPending}>
            Reset mastery and restart
          </Button>
        </ConfirmationDialog>
      </div>
    </section>
  );
};
