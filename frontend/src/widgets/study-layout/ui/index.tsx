import { BookOpen, Film, Library } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { Button, Logo } from '@shared/ui';

import styles from './styles.modules.scss';

interface StudyLayoutProps {
  children: ReactNode;
  section: 'modules' | 'vocabulary';
}

export const StudyLayout = ({ children, section }: StudyLayoutProps) => {
  return (
    <div className={styles.layout}>
      <header className={styles.layoutHeader}>
        <Logo to={routes.upload} />
        <nav className={styles.layoutNavigation}>
          <Button asChild variant="ghost">
            <NavLink to={routes.upload}>
              <Film size={16} />
              Movie practice
            </NavLink>
          </Button>
          <Button asChild variant={section === 'modules' ? 'secondary' : 'ghost'}>
            <NavLink to={routes.study}>
              <Library size={16} />
              Modules
            </NavLink>
          </Button>
          <Button asChild variant={section === 'vocabulary' ? 'secondary' : 'ghost'}>
            <NavLink to={routes.vocabulary}>
              <BookOpen size={16} />
              Vocabulary
            </NavLink>
          </Button>
        </nav>
      </header>
      <main className={styles.layoutMain}>{children}</main>
    </div>
  );
};
