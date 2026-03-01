import { useRef, useState, useEffect, useCallback } from "react";

interface CropSliderProps {
  setPercentage: React.Dispatch<React.SetStateAction<number>>;
}

const CropSlider: React.FC<CropSliderProps> = ({ setPercentage }) => {
  const [dragging, setDragging] = useState(false);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const lastUpdate = useRef(0);

  // Move the ball
  const moveBall = useCallback((clientX: number) => {
    if (!sliderRef.current || !ballRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;

    // clamp inside slider
    const x = Math.min(Math.max(offsetX - 10, 0), rect.width - 15);
    const percent = x / (rect.width - 15);
    setPercentage(percent * .8 + .2);
    sliderRef.current.style.setProperty("--after-width", `${percent * 100}%`);
    ballRef.current.style.left = `${x}px`;
  }, [setPercentage]);

  // Mouse and touch move - only when dragging
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!dragging) return;

      const now = performance.now();
      if (now - lastUpdate.current < 16) return;
      lastUpdate.current = now;

      moveBall(clientX);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, moveBall]);

  // Start dragging when clicking/touching the ball
  const handleMouseDown = (e: React.MouseEvent) => {
    moveBall(e.clientX);
    setDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    moveBall(e.touches[0].clientX);
    setDragging(true);
  };

  return (
    <div className="crop-size-slider">
      <div className="slider-container">
        <span>&minus;</span>

        <div className="slider" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} ref={sliderRef}>
          <div
            className="slider-ball"
            ref={ballRef}
          ></div>
        </div>

        <span>+</span>
      </div>
    </div>
  );
};

export default CropSlider;
