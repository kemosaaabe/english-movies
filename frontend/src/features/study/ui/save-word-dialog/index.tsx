import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { appendCard, listModules, saveModule, studyQueryKey, type SaveWordInput } from '@entities/study';
import { Button, Select } from '@shared/ui';

import { validateRequired } from '../../lib/validateRequired';

import styles from '../save-word/styles.modules.scss';

interface SaveWordDialogProps {
  word: string;
  onClose: () => void;
}

export const SaveWordDialog = ({ word, onClose }: SaveWordDialogProps) => {
  const queryClient = useQueryClient();
  const modules = useQuery({ queryKey: [...studyQueryKey, 'list'], queryFn: listModules });
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveWordInput>({
    defaultValues: {
      moduleId: '',
      term: word,
      definition: '',
      title: '',
    },
  });
  const selectedModule = watch('moduleId');
  const save = useMutation({
    mutationFn: async (input: SaveWordInput) => {
      if (input.moduleId) {
        await appendCard(input.moduleId, { term: input.term, definition: input.definition });
      } else {
        await saveModule({
          title: input.title,
          cards: [{ term: input.term, definition: input.definition }],
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyQueryKey });
      onClose();
    },
  });

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !save.isPending) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.saveOverlay} />
        <Dialog.Content className={styles.saveDialog}>
          <Dialog.Title>Save a word</Dialog.Title>
          <Dialog.Description>Choose a module for your word, or create a new one.</Dialog.Description>
          {modules.isPending ? (
            <p>Loading modules…</p>
          ) : modules.error ? (
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
          ) : (
            <form
              onSubmit={handleSubmit((input) => {
                if (!save.isPending) {
                  save.mutate(input);
                }
              })}
            >
              <label htmlFor="save-module">Module</label>
              <Controller
                control={control}
                name="moduleId"
                render={({ field }) => {
                  return (
                    <Select
                      id="save-module"
                      {...field}
                      onValueChange={field.onChange}
                      disabled={save.isPending}
                      options={[
                        { value: '', label: 'Create a new module' },
                        ...(modules.data ?? []).map((module) => {
                          return { value: module.id, label: module.title };
                        }),
                      ]}
                    />
                  );
                }}
              />
              <label htmlFor="save-term">Term</label>
              <input id="save-term" {...register('term', { validate: validateRequired })} />
              {errors.term && <p role="alert">{errors.term.message}</p>}
              <label htmlFor="save-definition">Definition</label>
              <input id="save-definition" {...register('definition', { validate: validateRequired })} />
              {errors.definition && <p role="alert">{errors.definition.message}</p>}
              {!selectedModule && (
                <>
                  <label htmlFor="save-title">New module title</label>
                  <input
                    id="save-title"
                    {...register('title', {
                      validate: (value) => {
                        return selectedModule ? true : validateRequired(value);
                      },
                    })}
                  />
                  {errors.title && <p role="alert">{errors.title.message}</p>}
                </>
              )}
              <p>Saving a word ends any active Learn session for the selected module.</p>
              {save.error && <p role="alert">{save.error.message}</p>}
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? 'Saving…' : 'Save word'}
              </Button>
            </form>
          )}
          <Dialog.Close asChild>
            <Button type="button" variant="ghost" disabled={save.isPending}>
              Cancel
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
