import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { ModuleInput } from '@entities/study';
import { Button } from '@shared/ui';

import { validateRequired } from '../../lib/validateRequired';

import styles from './styles.modules.scss';

interface ModuleCardEditorProps {
  fieldId: string;
  index: number;
  cardCount: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}

export const ModuleCardEditor = ({ fieldId, index, cardCount, onMove, onRemove }: ModuleCardEditorProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ModuleInput>();
  const cardErrors = errors.cards?.[index];

  return (
    <fieldset className={styles.card}>
      <legend>Card {index + 1}</legend>
      <div className={styles.cardFields}>
        <div>
          <label htmlFor={`term-${fieldId}`}>Term</label>
          <input
            id={`term-${fieldId}`}
            placeholder="A word or phrase"
            {...register(`cards.${index}.term`, { validate: validateRequired })}
          />
          {cardErrors?.term && <p role="alert">{cardErrors.term.message}</p>}
        </div>
        <div>
          <label htmlFor={`definition-${fieldId}`}>Definition</label>
          <input
            id={`definition-${fieldId}`}
            placeholder="Translation or meaning"
            {...register(`cards.${index}.definition`, { validate: validateRequired })}
          />
          {cardErrors?.definition && <p role="alert">{cardErrors.definition.message}</p>}
        </div>
      </div>
      <div className={styles.cardActions}>
        <Button
          type="button"
          variant="ghost"
          disabled={index === 0}
          onClick={() => {
            onMove(index, index - 1);
          }}
        >
          <ArrowUp size={14} />
          Move up
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={index === cardCount - 1}
          onClick={() => {
            onMove(index, index + 1);
          }}
        >
          <ArrowDown size={14} />
          Move down
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onRemove(index);
          }}
        >
          <Trash2 size={14} />
          Remove
        </Button>
      </div>
    </fieldset>
  );
};
