import { useState } from 'react';
import { BAKERY_INFO } from '@/src/data/bakeryData';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = '' }: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const customLogo = BAKERY_INFO.logoImageUrl.trim();
  const showCustomLogo = Boolean(customLogo) && !imgError;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {showCustomLogo ? (
        <span className="w-10 h-10 rounded-full overflow-hidden border border-[#d3c3bd] bg-[#f6f3ed] shrink-0 inline-flex items-center justify-center">
          <img
            src={customLogo}
            alt={`Logo oficial de Panadería y Confitería ${BAKERY_INFO.brandName} ${BAKERY_INFO.ownerLine}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover scale-[1.08]"
          />
        </span>
      ) : (
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0 text-[#9a4523]"
        >
          <path
            d="M5 26V15C5 8.92487 9.92487 4 16 4C22.0751 4 27 8.92487 27 15V26"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M9.5 26V16C9.5 12.4101 12.4101 9.5 16 9.5C19.5899 9.5 22.5 12.4101 22.5 16V26"
            stroke="#210f07"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 13.5V23.5M13 17.5C14.5 17.5 16 18.5 16 20C16 18.5 17.5 17.5 19 17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 26H29"
            stroke="#210f07"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className="font-serif text-xl sm:text-[1.35rem] font-medium tracking-tight text-[#210f07] whitespace-nowrap">
        {BAKERY_INFO.brandName}
      </span>
    </span>
  );
}
