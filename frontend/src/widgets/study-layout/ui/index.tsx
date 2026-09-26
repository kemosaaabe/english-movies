import type { ReactNode } from 'react';

import { AppHeader } from '@widgets/app-header';

import styles from './styles.modules.scss';

interface StudyLayoutProps {
  children: ReactNode;
  section: 'modules' | 'vocabulary';
}

export const StudyLayout = ({ children, section }: StudyLayoutProps) => {
  return (
    <div className={styles.layout}>
      <AppHeader activeSection={section} />
      <main className={styles.layoutMain}>{children}</main>
    </div>
  );
};
