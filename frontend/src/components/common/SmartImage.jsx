import React, { useEffect, useRef, useState } from "react";
import { warmImageCache } from "../../utils/imagePipeline";

export default function SmartImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  priority = false,
  onLoad,
  ...rest
}) {
  const wrapperRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    setShouldLoad(Boolean(priority));
  }, [src, priority]);

  useEffect(() => {
    if (!src || !priority) {
      return;
    }

    warmImageCache([src], { highPriorityCount: 1 });
  }, [src, priority]);

  useEffect(() => {
    if (priority || shouldLoad) {
      return;
    }

    const node = wrapperRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "240px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  return (
    <div ref={wrapperRef} className={`smart-image-shell ${wrapperClassName}`}>
      {!loaded && !errored ? <div className="smart-image-shimmer" /> : null}
      <img
        src={shouldLoad ? src : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`smart-image ${loaded ? "is-loaded" : ""} ${className}`}
        onLoad={(event) => {
          setLoaded(true);
          if (typeof onLoad === "function") {
            onLoad(event);
          }
        }}
        onError={() => {
          setErrored(true);
          setLoaded(true);
        }}
        {...rest}
      />
    </div>
  );
}
