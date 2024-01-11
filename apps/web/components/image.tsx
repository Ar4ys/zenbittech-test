import { ComponentProps, FC, useEffect, useMemo } from 'react';

export type ImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: string | Blob;
};

export const Image: FC<ImageProps> = ({ src, ...props }) => {
  const source = useMemo(() => {
    if (typeof src === 'string') return src;
    else if (src instanceof Blob) return URL.createObjectURL(src);
    else return undefined;
  }, [src]);

  // Revoke previous objectUrl if src has changed
  useEffect(
    () => () => {
      if (typeof src !== 'string' && src && source) {
        URL.revokeObjectURL(source);
      }
    },
    [source, src],
  );

  return <img {...props} src={source} />;
};
