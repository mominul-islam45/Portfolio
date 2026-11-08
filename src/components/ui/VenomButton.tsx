'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import OriginkitVenomButton from '@/components/originkit/ui/venom-button';

type VenomButtonProps = {
  href: string;
  label?: string;
};

type ActionButtonProps = {
  href?: never;
  label?: string;
  onClick: () => void;
};

type Props = VenomButtonProps | ActionButtonProps;

const buttonStageStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(600px, 100vw)',
  height: 'min(420px, 70vh)',
  minWidth: 0,
  minHeight: 0,
  overflow: 'visible',
  pointerEvents: 'none',
  background: 'transparent',
};

export default function VenomButton(props: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const label = props.label ?? 'View more';
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  const normalButtonClassName = 'inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-colors duration-200 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200';

  const renderNormalButton = () => 'href' in props && props.href ? (
    <Link href={props.href} className={normalButtonClassName}>{label}</Link>
  ) : (
    <button type="button" onClick={'onClick' in props ? props.onClick : undefined} className={normalButtonClassName}>{label}</button>
  );

  const handleDesktopClick = () => {
    if ('onClick' in props) {
      props.onClick();
    } else {
      router.push(props.href);
    }
  };

  return (
    <>
      {isDesktop ? (
        <span className="relative inline-flex h-14 w-44 align-middle">
          <OriginkitVenomButton
            label={label}
            size={56}
            onClick={handleDesktopClick}
            style={buttonStageStyle}
          />
        </span>
      ) : renderNormalButton()}
    </>
  );
}
