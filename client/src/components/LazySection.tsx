import { type ReactNode, useEffect, useRef, useState } from 'react';

type LazySectionProps = {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
};

export default function LazySection({
  children,
  fallback = null,
  rootMargin = '320px',
  className,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;
    if (typeof window === 'undefined') return;

    const marker = markerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={markerRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}
