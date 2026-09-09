import styles from './styles.modules.scss';

export const Brand = () => (
  <div className={styles.brand} aria-label="ReelLingo">
    <span className={styles.mark} aria-hidden="true">
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
    ReelLingo
  </div>
);
