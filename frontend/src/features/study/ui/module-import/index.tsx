import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { ClipboardPaste, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { CardInput } from '@entities/study';
import { Button } from '@shared/ui';

import { cardImportExample } from '../../constants';
import { parseCardImport } from '../../lib/parseCardImport';
import type { CardImportInput } from '../../types';

import styles from './styles.modules.scss';

interface ModuleImportProps {
  onImport: (cards: CardInput[]) => void;
  disabled: boolean;
}

export const ModuleImport = ({ onImport, disabled }: ModuleImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, watch, reset, handleSubmit } = useForm<CardImportInput>({ defaultValues: { text: '' } });
  const importResult = parseCardImport(watch('text'));
  const canImport = importResult.cards.length > 0 && importResult.invalidLines.length === 0;

  const submitImport = handleSubmit(({ text }) => {
    const result = parseCardImport(text);

    if (result.cards.length === 0 || result.invalidLines.length > 0) {
      return;
    }

    onImport(result.cards);
    reset();
    setIsOpen(false);
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button type="button" variant="secondary" disabled={disabled}>
          <ClipboardPaste size={16} />
          Import words
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.importOverlay} />
        <Dialog.Content className={styles.importDialog}>
          <header className={styles.importHeader}>
            <div>
              <span className={styles.importEyebrow}>LESS TYPING, MORE LEARNING</span>
              <Dialog.Title>Bring your words along</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" type="button">
                <X size={16} />
                Close
              </Button>
            </Dialog.Close>
          </header>
          <Dialog.Description>
            Paste one word and its translation per line. Existing cards stay in place.
          </Dialog.Description>
          <form
            onSubmit={(event) => {
              event.stopPropagation();
              void submitImport(event);
            }}
          >
            <Tabs.Root defaultValue="paste">
              <Tabs.List className={styles.importTabs}>
                <Tabs.Trigger value="paste">Paste words</Tabs.Trigger>
                <Tabs.Trigger value="preview">Preview · {importResult.cards.length}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="paste" className={styles.importPanel}>
                <label htmlFor="card-import-text">Words and translations</label>
                <textarea
                  id="card-import-text"
                  rows={8}
                  placeholder={cardImportExample}
                  {...register('text')}
                />
                <p>
                  Use a space after a single-word term. For phrases, separate the term and translation with a
                  tab or semicolon: <code>take care; заботиться</code>
                </p>
              </Tabs.Content>
              <Tabs.Content value="preview" className={styles.importPanel}>
                {importResult.cards.length ? (
                  <ol className={styles.importPreview}>
                    {importResult.cards.map((card, index) => {
                      return (
                        <li key={`${index}-${card.term}`}>
                          <strong>{card.term}</strong>
                          <span>{card.definition}</span>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p>Paste some words to see your cards here.</p>
                )}
              </Tabs.Content>
            </Tabs.Root>
            {importResult.invalidLines.length > 0 && (
              <p role="alert">
                Add both a term and a translation on lines {importResult.invalidLines.join(', ')}.
              </p>
            )}
            <footer className={styles.importFooter}>
              <span>{importResult.cards.length} cards ready</span>
              <Button type="submit" disabled={!canImport}>
                Add to module
              </Button>
            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
