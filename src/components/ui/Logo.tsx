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
  sm: { icon: 40, text: 'text-sm font-bold', sub: 'text-[9.5px]' },
  md: { icon: 52, text: 'text-lg sm:text-xl font-black', sub: 'text-[11px]' },
  lg: { icon: 64, text: 'text-xl sm:text-2xl font-black', sub: 'text-xs' },
  xl: { icon: 80, text: 'text-2xl sm:text-3xl font-black', sub: 'text-sm' },
};

export function Logo({
  size = 'md',
  showText = true,
  subtitle = 'Admissions Fair 2026',
  href,
  className,
  inverted = false,
  priority = false,
}: LogoProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]?.icon || 36;
  const currentSizeConfig = typeof size === 'string' ? sizeMap[size] : sizeMap.md;

  const content = (
    <div className={clsx('inline-flex items-center gap-3 select-none group', className)}>
      <div
        className="relative overflow-hidden rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src="/IMG_1746.png"
          alt="Glory Educational Consultancy"
          width={pixelSize * 2}
          height={pixelSize * 2}
          priority={priority}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={clsx(
              'font-display font-black tracking-tight leading-tight',
              currentSizeConfig.text,
              inverted ? 'text-white' : 'text-carbon'
            )}
          >
            GLORY<span className="text-ocean">EDU</span>
          </span>
          {subtitle && (
            <span
              className={clsx(
                'font-semibold uppercase tracking-widest leading-none mt-0.5',
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
