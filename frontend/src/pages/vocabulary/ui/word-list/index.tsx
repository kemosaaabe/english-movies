import { ArrowUpRight } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';

import { routes } from '@app/router/constants';

import type { VocabularyWord } from '../../types';

import styles from './styles.modules.scss';

interface WordListProps {
  words: VocabularyWord[];
}

export const WordList = ({ words }: WordListProps) => {
  return (
    <ul className={styles.words}>
      {words.map((word) => {
        return (
          <li key={word.id} className={styles.wordsRow}>
            <div className={styles.wordsTerm}>
              <span>Word or phrase</span>
              <strong>{word.term}</strong>
            </div>
            <div className={styles.wordsMeaning}>
              <span>Meaning</span>
              <p>{word.definition}</p>
            </div>
            <Link
              className={styles.wordsModule}
              to={generatePath(routes.studyModule, { moduleId: word.moduleId })}
            >
              <span>{word.moduleTitle}</span>
              <ArrowUpRight size={15} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
