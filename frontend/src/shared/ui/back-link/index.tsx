import { ArrowLeft } from 'lucide-react';
import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.modules.scss';

interface BackLinkProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  to: string;
}

export const BackLink = ({ children, onClick, to }: BackLinkProps) => {
  return (
    <Link className={styles.backLink} onClick={onClick} to={to}>
      <span className={styles.backLinkIcon}>
        <ArrowLeft size={16} strokeWidth={2.2} />
      </span>
      <span>{children}</span>
    </Link>
  );
};
