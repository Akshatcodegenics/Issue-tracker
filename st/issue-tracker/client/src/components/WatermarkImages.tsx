import React, { useMemo } from 'react';

const images = [
  '/seed-images/bug.svg',
  '/seed-images/rocket.svg',
  '/seed-images/gear.svg'
];

const WatermarkImages: React.FC = () => {
  const tiles = useMemo(() => {
    const items: { key: string; left: string; top: string; size: number; src: string; rotate: number; opacity: number }[] = [];
    const cols = 6;
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) % images.length;
        const size = 120 + ((r + c) % 3) * 30;
        items.push({
          key: `${r}-${c}`,
          left: `${(c + 0.5) * (100 / cols)}%`,
          top: `${(r + 0.5) * (100 / rows)}%`,
          size,
          src: images[idx],
          rotate: ((r * 13 + c * 29) % 360),
          opacity: 0.05 + ((r + c) % 3) * 0.03,
        });
      }
    }
    return items;
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden
    >
      {tiles.map(t => (
        <img
          key={t.key}
          src={t.src}
          alt="watermark"
          style={{
            position: 'absolute',
            left: t.left,
            top: t.top,
            width: t.size,
            height: t.size,
            transform: `translate(-50%, -50%) rotate(${t.rotate}deg)`,
            opacity: t.opacity,
            filter: 'grayscale(100%)',
          }}
        />
      ))}
    </div>
  );
};

export default WatermarkImages;