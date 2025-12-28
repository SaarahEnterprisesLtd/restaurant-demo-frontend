import React, { useState } from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1200&q=60";

export default function SmartImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const finalSrc = src && !error ? src : FALLBACK;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={finalSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-full w-full object-cover transition-all duration-500 ${
          loaded ? "blur-0 scale-100" : "blur-md scale-[1.02]"
        }`}
      />

      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      )}
    </div>
  );
}
