import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { emptyModuleInput, saveModule, studyQueryKey } from '@entities/study';
import type { CardInput, ModuleInput, StudyModule } from '@entities/study';

export const useModuleEditor = (module?: StudyModule) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<ModuleInput>({ defaultValues: module ?? emptyModuleInput });
  const cardFields = useFieldArray({ control: form.control, name: 'cards', keyName: 'fieldId' });

  const saveMutation = useMutation({
    mutationFn: (input: ModuleInput) => {
      return saveModule(input, module?.id);
    },
    onSuccess: async (savedModule) => {
      await queryClient.invalidateQueries({ queryKey: studyQueryKey });
      navigate(generatePath(routes.studyModule, { moduleId: savedModule.id }));
    },
  });

  const importCards = (cards: CardInput[]) => {
    const currentCards = form.getValues('cards');
    const hasOnlyEmptyCards = currentCards.every((card) => {
      return !card.id && !card.term.trim() && !card.definition.trim();
    });

    if (hasOnlyEmptyCards) {
      cardFields.replace(cards);
    } else {
      cardFields.append(cards, { shouldFocus: false });
    }

    form.clearErrors('cards');
  };

  const submit = form.handleSubmit((input) => {
    if (!saveMutation.isPending) {
      saveMutation.mutate(input);
    }
  });

  return { form, cardFields, saveMutation, importCards, submit };
};
