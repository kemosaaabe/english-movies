import * as Separator from '@radix-ui/react-separator';
import { Plus, Save } from 'lucide-react';
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
          <h1>{module ? 'Edit module' : 'Create module'}</h1>
        </header>
        <form onSubmit={submit}>
          <fieldset className={styles.editorBody} disabled={saveMutation.isPending}>
            <ModuleDetails />
            <Separator.Root className={styles.editorDivider} />
            <section className={styles.editorCards}>
              <header className={styles.editorCardsHeader}>
                <div>
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
            {module && <p>Saving ends the current Learn session. Your progress is kept.</p>}
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
