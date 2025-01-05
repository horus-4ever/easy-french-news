import { useState, useEffect, RefObject } from 'react';

const useNavHeight = (navRef: RefObject<HTMLElement | null>) => {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navRef]);

  return [navHeight];
};

export default useNavHeight;
