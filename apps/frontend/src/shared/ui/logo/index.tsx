import { Typography } from '../typography';
import styles from './styles.modules.scss';

export const Logo = () => (
  <div className={styles.logo}>
    <span className={styles.mark}>
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
    <Typography>ReelLingo</Typography>
  </div>
);
