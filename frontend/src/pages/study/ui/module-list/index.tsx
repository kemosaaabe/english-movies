import { useQuery } from '@tanstack/react-query';
import { Clapperboard, Library, LibraryBig, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { listModules, studyQueryKey } from '@entities/study';
import { Button } from '@shared/ui';

import { ModuleTile } from '../module-tile';

import styles from '../../styles.modules.scss';

export const ModuleList = () => {
  const modules = useQuery({ queryKey: [...studyQueryKey, 'list'], queryFn: listModules });

  return (
    <>
      <header className={styles.pageHero}>
        <div>
          <p className={styles.pageEyebrow}>COLLECT · RECALL · REMEMBER</p>
          <h1>
            Your words.<span>Your world.</span>
          </h1>
          <p className={styles.pageDescription}>
            From a line in a movie to a word you know by heart.
            <br />
            Build your vocabulary, one small session at a time.
          </p>
        </div>
        <Button asChild>
          <Link to={routes.studyNew}>
            <Plus size={18} />
            Create module
          </Link>
        </Button>
      </header>
      <div className={styles.pageSectionHeading}>
        <span>
          <Library size={16} />
          Your collections
        </span>
        <span>
          {modules.data?.length ?? 0} {modules.data?.length === 1 ? 'module' : 'modules'}
        </span>
      </div>
      {modules.isPending && <p>Loading modules…</p>}
      {modules.error && (
        <div role="alert">
          <p>{modules.error.message}</p>
          <Button
            onClick={() => {
              void modules.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {modules.data?.length === 0 && (
        <section className={styles.pageEmpty}>
          <span className={styles.pageEmptyIcon}>
            <LibraryBig size={30} />
          </span>
          <p className={styles.pageEyebrow}>A PLACE FOR WORDS YOU WANT TO KEEP</p>
          <h2>Build your first word collection.</h2>
          <p>
            Start with a few words of your own, or practise a movie scene and save useful phrases as you go.
          </p>
          <div className={styles.pageEmptyActions}>
            <Button asChild>
              <Link to={routes.studyNew}>
                <Plus size={18} />
                Create a module
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to={routes.upload}>
                <Clapperboard size={18} />
                Practise with a movie
              </Link>
            </Button>
          </div>
        </section>
      )}
      <div className={styles.pageGrid}>
        {modules.data?.map((module) => {
          return <ModuleTile key={module.id} module={module} />;
        })}
      </div>
    </>
  );
};
