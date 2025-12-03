import { useRef, useCallback } from "react";

export function useScrollSpeed() {
  const lastPos = useRef(0);
  const lastTime = useRef(Date.now());
  const speed = useRef(0);

  const handleScroll = useCallback(() => {
    const currentPos = window.scrollY;
    const currentTime = Date.now();

    const deltaPos = currentPos - lastPos.current;
    const deltaTime = currentTime - lastTime.current; // ms

    if (deltaTime > 0) {
      speed.current = deltaPos / deltaTime; 
    }

    lastPos.current = currentPos;
    lastTime.current = currentTime;
  }, []);

  return { handleScroll, speed };
}