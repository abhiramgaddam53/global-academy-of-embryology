'use client';

import styles from './DnaLoader.module.css';

export default function DnaLoader() {
  // Gradient colors extracted from the logo
  const strandColors = [
    '#0b3d68', '#164f70', '#226179', '#2d7381', '#39858a',
    '#449792', '#50a99b', '#5bbbfa', '#50a99b', '#449792',
    '#39858a', '#2d7381', '#226179', '#164f70', '#0b3d68'
  ];

  return (
    <div className={styles.container}>
      <div className={styles.dnaLoader}>
        {strandColors.map((color, index) => (
          <div
            key={index}
            className={styles.strand}
            style={{
              backgroundColor: color,
              // Calculate delay to create the wave motion (-1.5s to -0.1s)
              animationDelay: `${-1.5 + (index * 0.1)}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}