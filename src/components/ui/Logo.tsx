import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  subtitle?: string;
  href?: string;
  className?: string;
  inverted?: boolean;
  priority?: boolean;
}

const sizeMap = {
  sm: { icon: 40, text: 'text-sm', sub: 'text-[9.5px]' },
  md: { icon: 52, text: 'text-lg sm:text-xl', sub: 'text-[11px]' },
  lg: { icon: 64, text: 'text-xl sm:text-2xl', sub: 'text-xs' },
  xl: { icon: 80, text: 'text-2xl sm:text-3xl', sub: 'text-sm' },
};

// The mark is a PNG with a white background, so on dark surfaces it sits on a white plate.
const MARK_RATIO = 555 / 360;

export function Logo({
  size = 'md',
  showText = true,
  subtitle = 'Education',
  href,
  className,
  inverted = false,
  priority = false,
}: LogoProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]?.icon || 36;
  const currentSizeConfig = typeof size === 'string' ? sizeMap[size] : sizeMap.md;

  const content = (
    <div className={clsx('inline-flex items-center gap-3 select-none', className)}>
      <div
        className={clsx(
          'relative flex items-center justify-center shrink-0 rounded-lg bg-white overflow-hidden',
          inverted && 'p-1'
        )}
        style={{ height: pixelSize, width: Math.round(pixelSize * MARK_RATIO) }}
      >
        <Image
          src="/brand/veridan-mark.png"
          alt="Veridan Education"
          width={555}
          height={360}
          priority={priority}
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={clsx(
              'font-display font-bold tracking-[0.08em] leading-tight',
              currentSizeConfig.text,
              inverted ? 'text-white' : 'text-black'
            )}
          >
            VERIDAN
          </span>
          {subtitle && (
            <span
              className={clsx(
                'font-medium tracking-[0.06em] leading-none mt-0.5',
                currentSizeConfig.sub,
                inverted ? 'text-gold' : 'text-dim-grey'
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
