import { useEffect, useState } from 'react';
import { Wheat } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f6f3ed] via-[#ebe8e2] to-[#e5e2dc] text-[#4f4440] p-6 text-center ${className}`}
      >
        <Wheat className="w-8 h-8 text-[#9a4523]/70" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-serif text-base text-[#210f07] max-w-xs">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
