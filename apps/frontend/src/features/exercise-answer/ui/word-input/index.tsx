import { KeyRound } from 'lucide-react';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

import { normalizeWord } from '@shared/lib';
import { Button, Typography } from '@shared/ui';

import type { WordInputProps } from '../../types';
import styles from './styles.modules.scss';

export const WordInput = ({
  answer,
  expectedWord,
  inputId,
  isChecked,
  onChange,
  onCorrect,
  wordIndex,
}: WordInputProps) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = normalizeWord(answer) === normalizeWord(expectedWord);
  const shouldShowValidation = isChecked || isSubmitted;
  const validationClassName = shouldShowValidation ? (isCorrect ? styles.correct : styles.incorrect) : '';
  const answerButtonClassName = isAnswerVisible
    ? `${styles.answerButton} ${styles.answerButtonActive}`
    : styles.answerButton;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(false);
    onChange(wordIndex, event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    setIsSubmitted(true);

    if (isCorrect) {
      onCorrect(wordIndex);
    }
  };

  const toggleAnswer = () => {
    setIsAnswerVisible((isVisible) => !isVisible);
  };

  return (
    <div className={styles.wordGroup}>
      <div className={styles.inputWrap}>
        <input
          className={`${styles.wordInput} ${validationClassName}`}
          id={inputId}
          value={answer}
          autoComplete="off"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          className={answerButtonClassName}
          type="button"
          title={
            isAnswerVisible
              ? `Hide answer for word ${wordIndex + 1}`
              : `Show answer for word ${wordIndex + 1}`
          }
          variant="ghost"
          onClick={toggleAnswer}
        >
          <KeyRound size={16} />
        </Button>
      </div>
      {isAnswerVisible && (
        <Typography className={styles.answer}>{expectedWord}</Typography>
      )}
    </div>
  );
};
