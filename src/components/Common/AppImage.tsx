import Image, { type StaticImageData } from "next/image";
import { useMemo, useState } from "react";

type AppImageProps = {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string | StaticImageData;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

const isRemoteImage = (value: string) => /^https?:\/\//i.test(value);

export default function AppImage({
  src,
  alt,
  width = 200,
  height = 200,
  className,
  style,
  sizes = "100vw",
  priority,
  fallbackSrc,
  onClick,
  onError,
}: AppImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  const shouldSkipOptimization = useMemo(() => {
    return typeof currentSrc === "string" && isRemoteImage(currentSrc);
  }, [currentSrc]);

  return (
    <Image
      unoptimized={shouldSkipOptimization}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
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
