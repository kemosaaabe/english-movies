import * as Separator from '@radix-ui/react-separator';
import { Layers3, Plus, Save } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

import { routes } from '@app/router/constants';
import type { StudyModule } from '@entities/study';
import { BackLink, Button } from '@shared/ui';

import { useModuleEditor } from '../../model/hooks/useModuleEditor';
import { ModuleCardEditor } from '../module-card-editor';
import { ModuleDetails } from '../module-details';
import { ModuleImport } from '../module-import';

import styles from './styles.modules.scss';

interface ModuleEditorProps {
  module?: StudyModule;
}

export const ModuleEditor = ({ module }: ModuleEditorProps) => {
  const { form, cardFields, saveMutation, importCards, submit } = useModuleEditor(module);
  const cardCount = cardFields.fields.length;

  return (
    <FormProvider {...form}>
      <div className={styles.editor}>
        <BackLink to={routes.study}>All collections</BackLink>
        <header className={styles.editorHeader}>
          <span className={styles.editorIcon}>
            <Layers3 size={28} />
          </span>
          <div>
            <p className={styles.editorEyebrow}>YOUR PERSONAL WORD BANK</p>
            <h1>{module ? 'Make it your own.' : 'Small words. Big progress.'}</h1>
            <p>
              {module
                ? 'Refine your collection and keep learning.'
                : 'Build a collection today. Make the words yours tomorrow.'}
            </p>
          </div>
        </header>
        <form onSubmit={submit}>
          <fieldset className={styles.editorBody} disabled={saveMutation.isPending}>
            <ModuleDetails />
            <Separator.Root className={styles.editorDivider} />
            <section className={styles.editorCards}>
              <header className={styles.editorCardsHeader}>
                <div>
                  <span className={styles.editorEyebrow}>02 / THE WORDS</span>
                  <h2>
                    Your flashcards <span>{cardCount}</span>
                  </h2>
                  <p>Add at least one card to start learning.</p>
                </div>
                <ModuleImport onImport={importCards} disabled={saveMutation.isPending} />
              </header>
              {cardFields.fields.map((field, index) => {
                return (
                  <ModuleCardEditor
                    key={field.fieldId}
                    fieldId={field.fieldId}
                    index={index}
                    cardCount={cardCount}
                    onMove={cardFields.move}
                    onRemove={cardFields.remove}
                  />
                );
              })}
              <Button
                className={styles.editorAdd}
                type="button"
                variant="secondary"
                onClick={() => {
                  cardFields.append({ term: '', definition: '' });
                }}
              >
                <Plus size={18} />
                Add another card
              </Button>
              {cardCount === 0 && <p role="alert">Add at least one card before saving.</p>}
            </section>
          </fieldset>
          {saveMutation.error && <p role="alert">{saveMutation.error.message}</p>}
          <footer className={styles.editorFooter}>
            <p>
              {module
                ? 'Saving ends the current Learn session. Your progress is kept.'
                : 'A little practice now. A bigger vocabulary later.'}
            </p>
            <Button type="submit" disabled={saveMutation.isPending || cardCount === 0}>
              <Save size={16} />
              {saveMutation.isPending ? 'Saving…' : module ? 'Save changes' : 'Create module'}
            </Button>
          </footer>
        </form>
      </div>
    </FormProvider>
  );
};
