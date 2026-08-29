import { useRef } from "react";
import "./HorizontalScroller.css";

export default function HorizontalScroller({ children }) {
  const trackRef = useRef(null);

  function scrollBy(distance) {
    trackRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  }

  return (
    <div className="scroller">
      <button
        type="button"
        className="scroller__nav scroller__nav--prev"
        aria-label="Scroll left"
        onClick={() => scrollBy(-320)}
      >
        ‹
      </button>
      <div className="scroller__track" ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className="scroller__nav scroller__nav--next"
        aria-label="Scroll right"
        onClick={() => scrollBy(320)}
      >
        ›
      </button>
    </div>
  );
}
