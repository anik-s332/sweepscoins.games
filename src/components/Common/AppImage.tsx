import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type AppImageProps = {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  fallbackSrc?: string | StaticImageData;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

export default function AppImage({
  src,
  alt,
  width = 200,
  height = 200,
  className,
  style,
  sizes = "100vw",
  priority,
  unoptimized,
  fallbackSrc,
  onClick,
  onError,
}: AppImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      unoptimized={unoptimized}
      className={className}
      style={style}
      priority={priority}
      onClick={onClick}
      onError={(event) => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
}
