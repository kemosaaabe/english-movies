import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Pencil, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { generatePath, Link, useNavigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { Flashcards, Learn, ModuleEditor } from '@features/study';
import { deleteModule, getModule, masteryLevels, resetProgress, studyQueryKey } from '@entities/study';
import type { StudyModule } from '@entities/study';
import { BackLink, Button, ConfirmationDialog } from '@shared/ui';

import styles from '../../styles.modules.scss';

interface ModulePageProps {
  moduleId: string;
  mode?: string;
}

export const ModulePage = ({ moduleId, mode }: ModulePageProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const moduleQuery = useQuery({
    queryKey: [...studyQueryKey, moduleId, 'detail'],
    queryFn: () => {
      return getModule(moduleId);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => {
      return deleteModule(moduleId);
    },
    onSuccess: () => {
      queryClient.setQueryData<StudyModule[]>([...studyQueryKey, 'list'], (currentModules) => {
        return currentModules?.filter((currentModule) => {
          return currentModule.id !== moduleId;
        });
      });
      queryClient.removeQueries({ queryKey: [...studyQueryKey, moduleId] });
      navigate(routes.study, { replace: true });
      void queryClient.invalidateQueries({ queryKey: [...studyQueryKey, 'list'] });
    },
  });
  const resetMutation = useMutation({
    mutationFn: () => {
      return resetProgress(moduleId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyQueryKey });
    },
  });
  if (moduleQuery.isPending) {
    return <p>Loading module…</p>;
  }
  if (!moduleQuery.data) {
    return (
      <div role="alert">
        <p>{moduleQuery.error?.message ?? 'Module not found.'}</p>
        <Button
          onClick={() => {
            void moduleQuery.refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }
  const { module, progress } = moduleQuery.data;
  const masteredCardCount = module.cards.filter((card) => {
    return progress[card.id]?.masteryLevel === masteryLevels.length;
  }).length;
  const totalMastery = module.cards.reduce((sum, card) => {
    return sum + (progress[card.id]?.masteryLevel ?? 0);
  }, 0);
  const maximumMastery = module.cards.length * masteryLevels.length;
  const masteryPercentage = maximumMastery ? (totalMastery / maximumMastery) * 100 : 0;
  if (mode === 'edit') {
    return <ModuleEditor key={module.id} module={module} />;
  }
  if (mode === 'learn') {
    return <Learn moduleId={moduleId} />;
  }
  if (mode === 'flashcards') {
    return <Flashcards key={module.updatedAt} detail={moduleQuery.data} />;
  }

  return (
    <div className={styles.pageDetail}>
      <BackLink to={routes.study}>All collections</BackLink>
      <section className={styles.pagePanel}>
        <header className={styles.pagePanelHeader}>
          <div>
            <h1>{module.title}</h1>
            {module.description && <p>{module.description}</p>}
            <span className={styles.pageMeta}>
              {module.cards.length} {module.cards.length === 1 ? 'card' : 'cards'} · Updated{' '}
              {new Date(module.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <ConfirmationDialog
            title={`Delete “${module.title}”?`}
            description="This removes its cards and learning progress. This can’t be undone."
            confirmLabel="Delete"
            pendingLabel="Deleting…"
            destructive
            onConfirm={() => {
              return deleteMutation.mutateAsync();
            }}
          >
            <Button
              className={styles.pageDeleteButton}
              variant="ghost"
              disabled={deleteMutation.isPending || resetMutation.isPending}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </ConfirmationDialog>
        </header>
        <div className={styles.pageActions}>
          <Button asChild>
            <Link to={generatePath(routes.studyActivity, { moduleId: moduleId, mode: 'learn' })}>
              <Sparkles size={17} />
              Learn / resume
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to={generatePath(routes.studyActivity, { moduleId: moduleId, mode: 'flashcards' })}>
              <BookOpen size={17} />
              Flashcards
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to={generatePath(routes.studyActivity, { moduleId: moduleId, mode: 'edit' })}>
              <Pencil size={16} />
              Edit module
            </Link>
          </Button>
        </div>
        <section className={styles.pageModuleProgress}>
          <div className={styles.pageModuleProgressHeading}>
            <div>
              <span>Module mastery</span>
              <strong>{Math.round(masteryPercentage)}% overall progress</strong>
            </div>
            <span>
              {masteredCardCount} / {module.cards.length} mastered
            </span>
          </div>
          <div className={styles.pageModuleProgressTrack}>
            <span style={{ width: `${masteryPercentage}%` }} />
          </div>
        </section>
        <ul className={styles.pageCards}>
          {module.cards.map((card) => {
            const cardProgress = progress[card.id];
            const masteryLevel = cardProgress?.masteryLevel ?? 0;

            return (
              <li key={card.id}>
                <div>
                  <strong>{card.term}</strong>
                  <span>{card.definition}</span>
                </div>
                <small>{cardProgress?.flashcardStatus ?? 'unreviewed'}</small>
                <div className={styles.pageCardMastery}>
                  <span>Mastery</span>
                  <span className={styles.pageCardMasteryDots}>
                    {masteryLevels.map((level) => {
                      return (
                        <span
                          className={level <= masteryLevel ? styles.pageCardMasteryDotActive : ''}
                          key={level}
                        />
                      );
                    })}
                  </span>
                  <strong>
                    {masteryLevel}/{masteryLevels.length}
                  </strong>
                </div>
              </li>
            );
          })}
        </ul>
        <footer className={styles.pageSettings}>
          <div>
            <strong>Want a clean slate?</strong>
            <span>Your cards stay put. Only learning history is cleared.</span>
          </div>
          <ConfirmationDialog
            title="Reset all progress?"
            description="This clears statuses, mastery, answer history, and the active session. Your cards will stay."
            confirmLabel="Reset progress"
            pendingLabel="Resetting…"
            destructive
            onConfirm={() => {
              return resetMutation.mutateAsync();
            }}
          >
            <Button variant="ghost" disabled={resetMutation.isPending || deleteMutation.isPending}>
              <RotateCcw size={16} />
              Reset progress
            </Button>
          </ConfirmationDialog>
        </footer>
        {(deleteMutation.error || resetMutation.error) && (
          <p role="alert">{deleteMutation.error?.message ?? resetMutation.error?.message}</p>
        )}
      </section>
    </div>
  );
};
