import { BookPlus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@shared/ui';

import { SaveWordDialog } from '../save-word-dialog';

import styles from './styles.modules.scss';

interface SaveWordProps {
  word: string;
  className?: string;
}

export const SaveWord = ({ word, className = '' }: SaveWordProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        className={className}
        variant="ghost"
        title={`Save ${word} to a vocabulary module`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <BookPlus size={16} />
        <span className={styles.saveText}>Save word</span>
      </Button>
      {open && (
        <SaveWordDialog
          word={word}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};
