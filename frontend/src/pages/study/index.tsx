import { useParams } from 'react-router-dom';

import { StudyLayout } from '@widgets/study-layout';
import { ModuleEditor } from '@features/study';

import { ModuleList } from './ui/module-list';
import { ModulePage } from './ui/module-page';

export const StudyPage = () => {
  const { moduleId, mode } = useParams();

  return (
    <StudyLayout section="modules">
      {moduleId === 'new' ? (
        <ModuleEditor />
      ) : moduleId ? (
        <ModulePage key={moduleId} moduleId={moduleId} mode={mode} />
      ) : (
        <ModuleList />
      )}
    </StudyLayout>
  );
};
