import { BookOpen, Film, Library, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

import { routes } from '@app/router/constants';
import { Button, Logo } from '@shared/ui';

import styles from './styles.modules.scss';

interface AppHeaderProps {
  activeSection: 'moviePractice' | 'modules' | 'vocabulary' | 'profile';
}

export const AppHeader = ({ activeSection }: AppHeaderProps) => {
  return (
    <header className={styles.header}>
      <Logo to={routes.upload} />
      <nav className={styles.headerNavigation}>
        <Button asChild variant={activeSection === 'moviePractice' ? 'secondary' : 'ghost'}>
          <Link aria-current={activeSection === 'moviePractice' ? 'page' : false} to={routes.upload}>
            <Film size={16} />
            Movie practice
          </Link>
        </Button>
        <Button asChild variant={activeSection === 'modules' ? 'secondary' : 'ghost'}>
          <Link aria-current={activeSection === 'modules' ? 'page' : false} to={routes.study}>
            <Library size={16} />
            Modules
          </Link>
        </Button>
        <Button asChild variant={activeSection === 'vocabulary' ? 'secondary' : 'ghost'}>
          <Link aria-current={activeSection === 'vocabulary' ? 'page' : false} to={routes.vocabulary}>
            <BookOpen size={16} />
            Vocabulary
          </Link>
        </Button>
        <Button asChild variant={activeSection === 'profile' ? 'secondary' : 'ghost'}>
          <Link aria-current={activeSection === 'profile' ? 'page' : false} to={routes.profile}>
            <UserRound size={16} />
            Profile
          </Link>
        </Button>
      </nav>
    </header>
  );
};
