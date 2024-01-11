import { useMediaQuery } from './media-query';

export const useIsMobile = () => {
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  return isMobile;
};
