'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function Logo() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // initial theme check
    const checkDark = document.documentElement.classList.contains('dark');
    setIsDark(checkDark);

    // observe class changes on <html>
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains('dark');
      setIsDark(darkNow);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-center transition-all duration-300">
      <Link href="/">
        <Image
          src={isDark ? '/logo/MOCK.png' : '/logo/MOCK2.png'}
          alt="Mock Miya Logo"
          width={80}
          height={40}
          priority
        />
      </Link>
    </div>
  );
}

export default Logo;
