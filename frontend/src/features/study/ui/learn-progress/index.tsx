import * as Progress from '@radix-ui/react-progress';

import type { LearnSession } from '@entities/study';

import { learningSummary } from '../../lib';

import styles from './styles.modules.scss';

interface LearnProgressProps {
  session: LearnSession;
}

export const LearnProgress = ({ session }: LearnProgressProps) => {
  const summary = learningSummary(session);

  return (
    <section className={styles.progress}>
      <div className={styles.progressHeading}>
        <p id="mastery-progress-label">
          <strong>{Math.round(summary.percentage)}%</strong> overall mastery
        </p>
        <span>
          {summary.levels[3]} / {session.cards.length} mastered
        </span>
      </div>
      <Progress.Root
        className={styles.progressTrack}
        value={summary.percentage}
        aria-labelledby="mastery-progress-label"
      >
        <Progress.Indicator
          className={styles.progressIndicator}
          style={{ transform: `translateX(-${100 - summary.percentage}%)` }}
        />
      </Progress.Root>
      <dl className={styles.progressStages}>
        <div>
          <dt>To learn</dt>
          <dd>{summary.levels[0]}</dd>
        </div>
        <div>
          <dt>Getting familiar</dt>
          <dd>{summary.levels[1]}</dd>
        </div>
        <div>
          <dt>Practising recall</dt>
          <dd>{summary.levels[2]}</dd>
        </div>
        <div>
          <dt>Mastered</dt>
          <dd>{summary.levels[3]}</dd>
        </div>
      </dl>
      <div className={styles.progressFooter}>
        <span>
          {session.total} {session.total === 1 ? 'answer' : 'answers'} this session
        </span>
        <details>
          <summary>How progress works</summary>
          <p>
            Each correct answer moves a word up one stage. A mistake moves it back one stage, and you’ll
            practise it again. At the final stage, type the word from memory to master it.
          </p>
        </details>
      </div>
    </section>
  );
};
