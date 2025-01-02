import { useState, useEffect, RefObject } from "react";

export function useIsInViewport(ref: RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!ref.current) {
      setIsInView(false);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
        root: null, // viewport
        threshold: 1 // consider "in view" if everything is visible
    });

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref.current]);

  return isInView;
}
