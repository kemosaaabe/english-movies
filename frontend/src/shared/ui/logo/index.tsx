import { Link } from 'react-router-dom';

import { Typography } from '../typography';
import styles from './styles.modules.scss';

interface LogoProps {
  to: string;
}

export const Logo = ({ to }: LogoProps) => (
  <Link className={styles.logo} to={to}>
    <span className={styles.mark}>
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
    <Typography className={styles.name} variant="bodyL">
      ReelLingo
    </Typography>
  </Link>
);
