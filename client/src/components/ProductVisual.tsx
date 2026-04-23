import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

type ProductVisualProps = {
  product: Product;
  className?: string;
  variant?: 'hero' | 'card' | 'compact';
};

export default function ProductVisual({
  product,
  className,
  variant = 'card',
}: ProductVisualProps) {
  const hero = variant === 'hero';
  const compact = variant === 'compact';
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = product.image?.trim() ?? '';
  const hasImage = Boolean(imageUrl) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#11181d,#0c1216)]',
        hero ? 'min-h-[420px]' : compact ? 'min-h-[112px]' : 'min-h-[260px]',
        className
      )}
    >
      {hasImage ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          loading={hero ? 'eager' : 'lazy'}
          fetchPriority={hero ? 'high' : 'auto'}
          decoding="async"
          sizes={
            hero
              ? '(max-width: 768px) 100vw, 50vw'
              : compact
                ? '96px'
                : '(max-width: 768px) 100vw, 25vw'
          }
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.18),transparent_30%),linear-gradient(180deg,#172127,#0d1317)] px-4 text-center">
          <div className="rounded-full border border-accent/25 bg-accent/10 p-4 text-accent">
            <ImagePlus className={cn(compact ? 'h-5 w-5' : 'h-8 w-8')} />
          </div>
          {!compact && (
            <>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                Product Image Needed
              </p>
              <p className="mt-2 max-w-xs text-sm text-white/70">
                Upload your real product photo from the admin dashboard to show it here.
              </p>
            </>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.3))]" />

      <div
        className={cn(
          'absolute inset-x-0 top-0 z-10 flex items-start justify-between',
          compact ? 'p-2' : 'p-4'
        )}
      >
        <div>
          <p className={cn('font-semibold uppercase tracking-[0.24em] text-accent', compact ? 'text-[7px]' : 'text-[10px]')}>
            Peaceful Taste
          </p>
          <p
            className={cn(
              'mt-1 font-black leading-tight text-white',
              compact ? 'max-w-[5rem] text-[10px]' : hero ? 'max-w-xs text-3xl' : 'max-w-[12rem] text-lg'
            )}
          >
            {product.name}
          </p>
        </div>
        <div className={cn('rounded-full border border-accent/30 bg-black/35 px-3 py-1 font-semibold text-white/90', compact ? 'text-[7px]' : 'text-[10px]')}>
          {product.size || 'Fresh daily'}
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 flex items-center justify-between rounded-t-[1.5rem] border-t border-white/10 bg-black/35 backdrop-blur-md',
          compact ? 'px-2 py-1' : 'px-4 py-3'
        )}
      >
        <div>
          <p className={cn('font-semibold text-white', compact ? 'text-[7px]' : 'text-[10px]')}>
            Peaceful Taste
          </p>
          <p className={cn('text-white/65', compact ? 'text-[6px]' : 'text-[10px]')}>
            Real product photo
          </p>
        </div>
      </div>
    </div>
  );
}
