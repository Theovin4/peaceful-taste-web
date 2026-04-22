import { useState } from 'react';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';
import { getProductFlavorNote, getProductVisualMeta } from '@/lib/productVisuals';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';

type ProductVisualProps = {
  product: Product;
  className?: string;
  variant?: 'hero' | 'card' | 'compact';
};

function Sticker({
  name,
  accent,
  shell,
  highlight,
  compact = false,
}: {
  name: string;
  accent: string;
  shell: string;
  highlight: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'absolute rounded-full border text-center shadow-[0_12px_35px_rgba(0,0,0,0.24)]',
        compact ? 'bottom-2 right-2 h-14 w-14 p-2' : 'bottom-3 right-3 h-20 w-20 p-3'
      )}
      style={{
        background: `radial-gradient(circle at top, ${shell}, #f8f2e4 72%)`,
        borderColor: `${accent}55`,
      }}
    >
      <div
        className={cn('font-semibold leading-none', compact ? 'text-[8px]' : 'text-[10px]')}
        style={{ color: accent }}
      >
        Peaceful
      </div>
      <div
        className={cn(
          'font-black uppercase tracking-[0.12em]',
          compact ? 'text-[7px]' : 'text-[8px]'
        )}
        style={{ color: accent }}
      >
        Taste
      </div>
      <div
        className={cn(
          'mt-1 rounded-full px-1 py-0.5 font-semibold',
          compact ? 'text-[5px]' : 'text-[6px]'
        )}
        style={{ backgroundColor: highlight, color: '#fffaf1' }}
      >
        {name.slice(0, compact ? 7 : 10)}
      </div>
    </div>
  );
}

function ProductPhoto({
  product,
  className,
  variant,
  tint,
}: {
  product: Product;
  className: string;
  variant: ProductVisualProps['variant'];
  tint?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const { palette } = getProductVisualMeta(product);

  return (
    <div className={cn('absolute overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-500',
          loaded ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          background: `linear-gradient(135deg, ${palette.depth}, ${palette.highlight})`,
        }}
      />
      <img
        src={product.image}
        alt={product.name}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        loading={variant === 'hero' ? 'eager' : 'lazy'}
        fetchPriority={variant === 'hero' ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        sizes={
          variant === 'hero'
            ? '(max-width: 768px) 100vw, 50vw'
            : variant === 'compact'
              ? '96px'
              : '(max-width: 768px) 100vw, 25vw'
        }
      />
      {tint ? <div className="absolute inset-0" style={{ background: tint }} /> : null}
    </div>
  );
}

function BottleMockup({
  product,
  compact = false,
  variant = 'card',
}: {
  product: Product;
  compact?: boolean;
  variant?: ProductVisualProps['variant'];
}) {
  const { palette, label } = getProductVisualMeta(product);

  return (
    <div
      className={cn(
        'relative mx-auto flex items-center justify-center',
        compact ? 'h-28 w-20' : 'h-64 w-40'
      )}
    >
      <div
        className={cn(
          'absolute top-0 rounded-t-[1.4rem] rounded-b-md',
          compact ? 'h-8 w-9' : 'h-16 w-16'
        )}
        style={{ backgroundColor: palette.accentSoft }}
      />
      <div
        className={cn(
          'absolute bottom-0 overflow-hidden rounded-[1.8rem] border border-white/40 backdrop-blur-sm',
          compact ? 'h-24 w-16' : 'h-56 w-28'
        )}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.22) 36%, rgba(255,255,255,0.14) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 26px 44px rgba(0,0,0,0.22)',
        }}
      >
        <ProductPhoto
          product={product}
          variant={variant}
          className="bottom-1 left-1 right-1 top-7 rounded-[1.5rem]"
          tint={`linear-gradient(180deg, ${palette.highlight}20, ${palette.accent}25)`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] opacity-80" />
        <div
          className={cn(
            'absolute inset-x-2 rounded-[1.4rem] border px-2 text-center',
            compact ? 'top-9 py-2' : 'top-16 py-4'
          )}
          style={{
            background: `linear-gradient(180deg, ${palette.shell}, #f9f4e8)`,
            borderColor: `${palette.accent}30`,
          }}
        >
          <p
            className={cn('font-semibold', compact ? 'text-[7px]' : 'text-[10px]')}
            style={{ color: palette.accent }}
          >
            Peaceful Taste
          </p>
          <p
            className={cn(
              'font-black uppercase leading-tight',
              compact ? 'text-[7px]' : 'text-[11px]'
            )}
            style={{ color: palette.depth }}
          >
            {product.name}
          </p>
          <p
            className={cn(
              'mt-1 uppercase tracking-[0.18em]',
              compact ? 'text-[6px]' : 'text-[8px]'
            )}
            style={{ color: palette.accentSoft }}
          >
            {label}
          </p>
        </div>
        <Sticker
          name={product.name}
          accent={palette.accent}
          shell={palette.shell}
          highlight={palette.highlight}
          compact={compact}
        />
      </div>
    </div>
  );
}

function CupMockup({
  product,
  compact = false,
  variant = 'card',
}: {
  product: Product;
  compact?: boolean;
  variant?: ProductVisualProps['variant'];
}) {
  const { palette, label } = getProductVisualMeta(product);
  const note = getProductFlavorNote(product);

  return (
    <div
      className={cn(
        'relative mx-auto flex items-center justify-center',
        compact ? 'h-28 w-24' : 'h-64 w-44'
      )}
    >
      <div
        className={cn(
          'absolute top-1 overflow-hidden rounded-t-full border border-white/35 bg-white/20',
          compact ? 'h-7 w-20' : 'h-14 w-32'
        )}
        style={{ boxShadow: '0 18px 30px rgba(0,0,0,0.18)' }}
      />
      <div
        className={cn(
          'absolute bottom-0 overflow-hidden border border-white/35 bg-white/15 backdrop-blur-sm',
          compact
            ? 'h-24 w-20 rounded-b-[1.3rem] rounded-t-[0.8rem]'
            : 'h-56 w-32 rounded-b-[2rem] rounded-t-[1.1rem]'
        )}
      >
        <ProductPhoto
          product={product}
          variant={variant}
          className="inset-1 rounded-[1.4rem]"
          tint={`linear-gradient(180deg, ${palette.highlight}10, ${palette.depth}18)`}
        />
        <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-black/35 to-transparent" />
        <div
          className="absolute inset-x-2 top-[38%] rounded-2xl border px-2 py-2 text-center"
          style={{
            background: `linear-gradient(180deg, ${palette.shell}, #fffaf0)`,
            borderColor: `${palette.accent}35`,
          }}
        >
          <p
            className={cn('font-semibold', compact ? 'text-[7px]' : 'text-[10px]')}
            style={{ color: palette.accent }}
          >
            Peaceful Taste
          </p>
          <p
            className={cn(
              'font-black uppercase leading-tight',
              compact ? 'text-[6px]' : 'text-[9px]'
            )}
            style={{ color: palette.depth }}
          >
            {product.name}
          </p>
          <p
            className={cn('mt-1', compact ? 'text-[5px]' : 'text-[7px]')}
            style={{ color: palette.accentSoft }}
          >
            {label}
          </p>
          <p
            className={cn(compact ? 'text-[5px]' : 'text-[7px]')}
            style={{ color: palette.highlight }}
          >
            {note}
          </p>
        </div>
        <Sticker
          name={product.name}
          accent={palette.accent}
          shell={palette.shell}
          highlight={palette.highlight}
          compact={compact}
        />
      </div>
    </div>
  );
}

function BowlMockup({
  product,
  compact = false,
  variant = 'card',
}: {
  product: Product;
  compact?: boolean;
  variant?: ProductVisualProps['variant'];
}) {
  const { palette, label } = getProductVisualMeta(product);

  return (
    <div
      className={cn(
        'relative mx-auto flex items-center justify-center',
        compact ? 'h-28 w-28' : 'h-64 w-52'
      )}
    >
      <div
        className={cn(
          'absolute rounded-full border border-white/30 bg-white/10 backdrop-blur-sm',
          compact ? 'bottom-2 h-16 w-24' : 'bottom-5 h-32 w-44'
        )}
        style={{ boxShadow: '0 24px 40px rgba(0,0,0,0.2)' }}
      >
        <ProductPhoto
          product={product}
          variant={variant}
          className="inset-2 rounded-full"
          tint={`linear-gradient(180deg, ${palette.highlight}10, ${palette.depth}22)`}
        />
        <div
          className={cn(
            'absolute rounded-full border px-2 text-center',
            compact
              ? 'bottom-2 left-1/2 w-16 -translate-x-1/2 py-1'
              : 'bottom-4 left-1/2 w-24 -translate-x-1/2 py-2'
          )}
          style={{
            background: `linear-gradient(180deg, ${palette.shell}, #fcf6ea)`,
            borderColor: `${palette.accent}33`,
          }}
        >
          <p
            className={cn('font-semibold', compact ? 'text-[6px]' : 'text-[9px]')}
            style={{ color: palette.accent }}
          >
            Peaceful Taste
          </p>
          <p
            className={cn(
              'font-black uppercase leading-tight',
              compact ? 'text-[5px]' : 'text-[7px]'
            )}
            style={{ color: palette.depth }}
          >
            {product.name}
          </p>
        </div>
      </div>
      <div
        className={cn(
          'absolute rounded-full border border-white/40 bg-white/5',
          compact ? 'bottom-12 h-7 w-24' : 'bottom-24 h-12 w-44'
        )}
      />
      <div
        className={cn(
          'absolute rounded-full border border-white/35 bg-white/5',
          compact ? 'bottom-14 h-9 w-24' : 'bottom-28 h-16 w-44'
        )}
      />
      <div
        className={cn(
          'absolute text-center uppercase tracking-[0.2em]',
          compact ? 'top-1 text-[6px]' : 'top-2 text-[8px]'
        )}
        style={{ color: palette.highlight }}
      >
        {label}
      </div>
    </div>
  );
}

function PastryMockup({
  product,
  compact = false,
  variant = 'card',
}: {
  product: Product;
  compact?: boolean;
  variant?: ProductVisualProps['variant'];
}) {
  const { palette } = getProductVisualMeta(product);

  return (
    <div
      className={cn(
        'relative mx-auto flex items-center justify-center',
        compact ? 'h-28 w-28' : 'h-64 w-52'
      )}
    >
      <div
        className={cn(
          'absolute rounded-[2rem] border border-white/25 bg-white/10 backdrop-blur-sm',
          compact ? 'bottom-3 h-20 w-24' : 'bottom-6 h-36 w-44'
        )}
      >
        <ProductPhoto
          product={product}
          variant={variant}
          className="inset-2 rounded-[1.6rem]"
          tint="linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.1))"
        />
      </div>
      <div
        className={cn(
          'absolute rounded-full border text-center',
          compact ? 'bottom-2 right-4 w-14 px-1 py-1' : 'bottom-4 right-6 w-24 px-2 py-2'
        )}
        style={{
          background: `linear-gradient(180deg, ${palette.shell}, #fef8ef)`,
          borderColor: `${palette.accent}30`,
        }}
      >
        <p
          className={cn('font-semibold', compact ? 'text-[6px]' : 'text-[9px]')}
          style={{ color: palette.accent }}
        >
          Peaceful Taste
        </p>
        <p
          className={cn(
            'font-black uppercase leading-tight',
            compact ? 'text-[5px]' : 'text-[7px]'
          )}
          style={{ color: palette.depth }}
        >
          {product.name}
        </p>
      </div>
    </div>
  );
}

function CakeMockup({
  product,
  compact = false,
  variant = 'card',
}: {
  product: Product;
  compact?: boolean;
  variant?: ProductVisualProps['variant'];
}) {
  const { palette, label } = getProductVisualMeta(product);

  return (
    <div
      className={cn(
        'relative mx-auto flex items-center justify-center',
        compact ? 'h-28 w-28' : 'h-64 w-52'
      )}
    >
      <div
        className={cn(
          'absolute rounded-full bg-[#d8b170]',
          compact ? 'bottom-2 h-5 w-24' : 'bottom-5 h-10 w-40'
        )}
      />
      <div
        className={cn(
          'absolute overflow-hidden rounded-[1.6rem]',
          compact ? 'bottom-5 h-14 w-20' : 'bottom-10 h-32 w-32'
        )}
        style={{
          background: `linear-gradient(180deg, ${palette.shell}, ${palette.highlight})`,
          boxShadow: '0 18px 30px rgba(0,0,0,0.2)',
        }}
      >
        <ProductPhoto
          product={product}
          variant={variant}
          className="inset-1 rounded-[1.3rem]"
          tint="linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.08))"
        />
        <div className="absolute left-0 right-0 top-[18%] h-[14%] rounded-full bg-white/70" />
      </div>
      <div
        className={cn(
          'absolute rounded-full border text-center',
          compact ? 'bottom-3 right-4 w-14 px-1 py-1' : 'bottom-5 right-5 w-24 px-2 py-2'
        )}
        style={{
          background: `linear-gradient(180deg, ${palette.shellSoft}, #fff7ea)`,
          borderColor: `${palette.accent}30`,
        }}
      >
        <p
          className={cn('font-semibold', compact ? 'text-[6px]' : 'text-[9px]')}
          style={{ color: palette.accent }}
        >
          Peaceful Taste
        </p>
        <p
          className={cn(
            'font-black uppercase leading-tight',
            compact ? 'text-[5px]' : 'text-[7px]'
          )}
          style={{ color: palette.depth }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default function ProductVisual({
  product,
  className,
  variant = 'card',
}: ProductVisualProps) {
  const { packaging, palette, label, sublabel } = getProductVisualMeta(product);
  const compact = variant === 'compact';
  const hero = variant === 'hero';

  return (
    <div
      role="img"
      aria-label={`${product.name} branded packaging mockup`}
      className={cn(
        'relative isolate overflow-hidden rounded-[2rem] border border-white/10',
        hero ? 'min-h-[420px]' : compact ? 'min-h-[112px]' : 'min-h-[260px]',
        className
      )}
      style={{
        background: `radial-gradient(circle at top right, ${palette.highlight}25, transparent 28%), linear-gradient(180deg, ${palette.depth}, #0e1515 74%)`,
        boxShadow: '0 28px 60px rgba(0,0,0,0.28)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 42%, rgba(255,255,255,0.04))',
        }}
      />
      <div
        className={cn(
          'absolute left-0 right-0 top-0 z-10 flex items-start justify-between',
          compact ? 'p-2' : 'p-4'
        )}
      >
        <div>
          <p
            className={cn(
              'font-semibold uppercase tracking-[0.24em]',
              compact ? 'text-[7px]' : 'text-[10px]'
            )}
            style={{ color: palette.highlight }}
          >
            {label}
          </p>
          <p
            className={cn(
              'mt-1 font-black leading-tight text-white',
              compact
                ? 'max-w-[5rem] text-[10px]'
                : hero
                  ? 'max-w-xs text-3xl'
                  : 'max-w-[12rem] text-lg'
            )}
          >
            {product.name}
          </p>
          <p className={cn('mt-1 text-white/70', compact ? 'text-[7px]' : 'text-xs')}>
            {sublabel}
          </p>
        </div>
        <div
          className={cn(
            'rounded-full border px-3 py-1 font-semibold text-white/90',
            compact ? 'text-[7px]' : 'text-[10px]'
          )}
          style={{ borderColor: `${palette.highlight}55`, backgroundColor: `${palette.highlight}30` }}
        >
          {product.size || 'Fresh daily'}
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-x-0 flex items-center justify-center',
          compact ? 'bottom-1 top-5' : hero ? 'bottom-2 top-16' : 'bottom-2 top-14'
        )}
      >
        {packaging === 'bottle' && (
          <BottleMockup product={product} compact={compact} variant={variant} />
        )}
        {packaging === 'cup' && <CupMockup product={product} compact={compact} variant={variant} />}
        {packaging === 'bowl' && (
          <BowlMockup product={product} compact={compact} variant={variant} />
        )}
        {packaging === 'pastry' && (
          <PastryMockup product={product} compact={compact} variant={variant} />
        )}
        {packaging === 'cake' && (
          <CakeMockup product={product} compact={compact} variant={variant} />
        )}
      </div>

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 flex items-center justify-between rounded-t-[1.5rem] border-t border-white/10 bg-black/20 backdrop-blur-md',
          compact ? 'px-2 py-1' : 'px-4 py-3'
        )}
      >
        <div>
          <p className={cn('font-semibold text-white', compact ? 'text-[7px]' : 'text-[10px]')}>
            Peaceful Taste
          </p>
          <p className={cn('text-white/65', compact ? 'text-[6px]' : 'text-[10px]')}>
            {PEACEFUL_TASTE_CONTACT.instagram} · {PEACEFUL_TASTE_CONTACT.tiktok}
          </p>
        </div>
        <p
          className={cn(
            'text-right font-semibold text-white/80',
            compact ? 'text-[6px]' : 'text-[10px]'
          )}
        >
          {PEACEFUL_TASTE_CONTACT.phone}
        </p>
      </div>
    </div>
  );
}
