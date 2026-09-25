import { BookOpen, Plus, Search } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { StudyLayout } from '@widgets/study-layout';
import { Button, Select } from '@shared/ui';

import { useVocabulary } from './model';
import { WordList } from './ui/word-list';

import styles from './styles.modules.scss';

export const VocabularyPage = () => {
  const { modulesQuery, filters, words, total } = useVocabulary();

  return (
    <StudyLayout section="vocabulary">
      <header className={styles.vocabularyHeader}>
        <h1>Vocabulary</h1>
        <Button asChild>
          <Link to={routes.studyNew}>
            <Plus size={16} />
            Create module
          </Link>
        </Button>
      </header>
      <section className={styles.vocabularyFilters}>
        <div>
          <label htmlFor="vocabulary-search">Search words, meanings, or modules</label>
          <div className={styles.vocabularySearch}>
            <Search size={17} />
            <input
              id="vocabulary-search"
              type="search"
              placeholder="Find a word…"
              {...filters.register('search')}
            />
          </div>
        </div>
        <div>
          <label htmlFor="vocabulary-module">Module</label>
          <Controller
            control={filters.control}
            name="moduleId"
            render={({ field }) => {
              return (
                <Select
                  id="vocabulary-module"
                  {...field}
                  onValueChange={field.onChange}
                  options={[
                    { value: '', label: 'All modules' },
                    ...(modulesQuery.data ?? []).map((module) => {
                      return { value: module.id, label: module.title };
                    }),
                  ]}
                />
              );
            }}
          />
        </div>
      </section>
      {modulesQuery.isPending ? (
        <p>Loading your vocabulary…</p>
      ) : modulesQuery.error ? (
        <div role="alert">
          <p>We couldn’t load your words. {modulesQuery.error.message}</p>
          <Button
            onClick={() => {
              void modulesQuery.refetch();
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          <p className={styles.vocabularyCount}>
            {words.length} of {total} saved {total === 1 ? 'word' : 'words'} · A–Z
          </p>
          {total === 0 ? (
            <div className={styles.vocabularyEmpty}>
              <BookOpen size={28} />
              <h2>No saved words yet</h2>
              <p>
                Save words from a movie exercise or add them to a module. They’ll appear here automatically.
              </p>
              <Button asChild variant="secondary">
                <Link to={routes.study}>Go to modules</Link>
              </Button>
            </div>
          ) : words.length === 0 ? (
            <div className={styles.vocabularyEmpty}>
              <h2>No matching words</h2>
              <p>Try a different search or choose another module.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  filters.reset();
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <WordList words={words} />
          )}
        </>
      )}
    </StudyLayout>
  );
};
