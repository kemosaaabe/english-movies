import { ArrowUpRight, BookOpen, Layers3, Pencil, Sparkles } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import type { StudyModule } from '@entities/study';
import { Button } from '@shared/ui';

import styles from './styles.modules.scss';

interface ModuleTileProps {
  module: StudyModule;
}

export const ModuleTile = ({ module }: ModuleTileProps) => {
  return (
    <article className={styles.tile}>
      <div className={styles.tileTop}>
        <span className={styles.tileIcon}>
          <Layers3 size={20} />
        </span>
        <span className={styles.tileCount}>
          {module.cards.length} {module.cards.length === 1 ? 'card' : 'cards'}
        </span>
      </div>
      <Link className={styles.tileTitle} to={generatePath(routes.studyModule, { moduleId: module.id })}>
        <h2>{module.title}</h2>
        <ArrowUpRight size={20} />
      </Link>
      <p className={styles.tileDescription}>
        {module.description || 'A collection of words to make your own.'}
      </p>
      <p className={styles.tileDate}>Updated {new Date(module.updatedAt).toLocaleDateString()}</p>
      <div className={styles.tileActions}>
        <Button asChild variant="secondary">
          <Link to={generatePath(routes.studyActivity, { moduleId: module.id, mode: 'flashcards' })}>
            <BookOpen size={16} />
            Flashcards
          </Link>
        </Button>
        <Button asChild>
          <Link to={generatePath(routes.studyActivity, { moduleId: module.id, mode: 'learn' })}>
            <Sparkles size={16} />
            Learn
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to={generatePath(routes.studyActivity, { moduleId: module.id, mode: 'edit' })}>
            <Pencil size={15} />
            Edit
          </Link>
        </Button>
      </div>
    </article>
  );
};
