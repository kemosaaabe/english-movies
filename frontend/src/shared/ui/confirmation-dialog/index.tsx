import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useState } from 'react';
import type { ReactElement } from 'react';

import { Button } from '../button';

import styles from './styles.modules.scss';

interface ConfirmationDialogProps {
  children: ReactElement;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  onConfirm: () => Promise<unknown>;
  destructive?: boolean;
}

export const ConfirmationDialog = ({
  children,
  title,
  description,
  confirmLabel,
  pendingLabel = 'Please wait…',
  onConfirm,
  destructive = false,
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (pending) {
      return;
    }
    setPending(true);
    setError('');
    try {
      await onConfirm();
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending) {
          setOpen(nextOpen);
          setError('');
        }
      }}
    >
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.confirmationOverlay} />
        <AlertDialog.Content className={styles.confirmationContent}>
          <AlertDialog.Title className={styles.confirmationTitle}>{title}</AlertDialog.Title>
          <AlertDialog.Description className={styles.confirmationDescription}>
            {description}
          </AlertDialog.Description>
          {error && (
            <p role="alert" className={styles.confirmationError}>
              {error}
            </p>
          )}
          <div className={styles.confirmationActions}>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={pending}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                className={destructive ? styles.confirmationDestructive : ''}
                disabled={pending}
                onClick={(event) => {
                  event.preventDefault();
                  void handleConfirm();
                }}
              >
                {pending ? pendingLabel : confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
