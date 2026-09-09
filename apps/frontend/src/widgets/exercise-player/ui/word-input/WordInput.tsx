import { KeyRound } from 'lucide-react';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { normalizeWord } from '@shared/lib/normalize-word';
import styles from './styles.modules.scss';

interface Props {
  answer: string;
  expectedWord: string;
  inputId: string;
  index: number;
  isChecked: boolean;
  onChange: (index: number, value: string) => void;
  onCorrect: (index: number) => void;
}

export const WordInput = ({ answer, expectedWord, inputId, index, isChecked, onChange, onCorrect }: Props) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = normalizeWord(answer) === normalizeWord(expectedWord);
  const showValidation = isChecked || isSubmitted;
  const stateClassName = showValidation ? (isCorrect ? styles.correct : styles.incorrect) : '';

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsSubmitted(false);
    onChange(index, event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    setIsSubmitted(true);

    if (isCorrect) {
      onCorrect(index);
    }
  };

  return (
    <div className={styles.wordGroup}>
      <div className={styles.inputWrap}>
        <input
          className={`${styles.wordInput} ${stateClassName}`}
          id={inputId}
          value={answer}
          autoComplete="off"
          aria-label={`Word ${index + 1}`}
          aria-invalid={showValidation && !isCorrect}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.answerButton}
          type="button"
          aria-label={isAnswerVisible ? `Hide answer for word ${index + 1}` : `Show answer for word ${index + 1}`}
          aria-pressed={isAnswerVisible}
          onClick={() => setIsAnswerVisible((isVisible) => !isVisible)}
        >
          <KeyRound size={16} aria-hidden="true" />
        </button>
      </div>
      {isAnswerVisible && <span className={styles.answer}>{expectedWord}</span>}
    </div>
  );
};
