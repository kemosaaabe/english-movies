import { BadgeCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

import type { LearnSession } from '@entities/study';
import { Button } from '@shared/ui';

import type { WrittenAnswerInput } from '../../types';

import styles from './styles.modules.scss';

interface LearnQuestionProps {
  session: LearnSession;
  pending: boolean;
  onAnswer: (answer: string) => void;
  onContinue: () => void;
  onOverride: () => void;
}

export const LearnQuestion = ({ session, pending, onAnswer, onContinue, onOverride }: LearnQuestionProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WrittenAnswerInput>();
  const question = session.question;
  if (!question) {
    return null;
  }

  return (
    <div className={styles.question}>
      <p>
        {question.type === 'choice' ? 'Which meaning matches this word?' : 'Which word matches this meaning?'}
      </p>
      <h3>{question.prompt}</h3>
      {session.feedback ? (
        <div
          role="status"
          className={session.feedback.correct ? styles.questionCorrect : styles.questionIncorrect}
        >
          <h4>
            {session.feedback.overridden
              ? 'Marked as correct.'
              : session.feedback.correct
                ? 'That’s right!'
                : 'Not quite. You’ll get another try.'}
          </h4>
          {!session.feedback.correct && <p>Your answer: {session.feedback.answer}</p>}
          <p>
            {session.feedback.correct ? 'Answer' : 'Remember'}: {session.feedback.expected}
          </p>
          <div className={styles.questionFeedbackActions}>
            {!session.feedback.correct && session.feedback.previousProgress && (
              <Button variant="secondary" disabled={pending} onClick={onOverride}>
                <BadgeCheck size={17} />
                I was right
              </Button>
            )}
            <Button disabled={pending} onClick={onContinue}>
              Next question
            </Button>
          </div>
        </div>
      ) : question.type === 'choice' ? (
        <div className={styles.questionOptions}>
          {question.options.map((option) => {
            return (
              <Button
                key={option}
                variant="secondary"
                disabled={pending}
                onClick={() => {
                  onAnswer(option);
                }}
              >
                {option}
              </Button>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((values) => {
            onAnswer(values.answer);
          })}
        >
          <label htmlFor="written-answer">Your answer</label>
          <input
            id="written-answer"
            autoComplete="off"
            placeholder="Type the word or phrase"
            autoFocus
            {...register('answer', {
              validate: (value) => {
                return Boolean(value.trim()) || 'Enter an answer.';
              },
            })}
          />
          {errors.answer && <p role="alert">{errors.answer.message}</p>}
          <Button type="submit" disabled={pending}>
            Check answer
          </Button>
        </form>
      )}
    </div>
  );
};
