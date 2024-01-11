import { FC } from 'react';

import { tw } from '@/utils';

import { Button } from '.';

export type PagerProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPage(page: number): void;
};

export const Pager: FC<PagerProps> = ({ className, currentPage, totalPages, onPage }) => {
  const handlePrevClick = () => {
    if (currentPage > 0) onPage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage + 1 < totalPages) onPage(currentPage + 1);
  };

  return (
    <div className={tw('flex gap-4', className)}>
      <Button
        variant="clear"
        className={tw(currentPage === 0 && 'opacity-50')}
        onClick={handlePrevClick}
      >
        Prev
      </Button>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant="clear"
            className={tw('h-8 w-8 rounded bg-card', currentPage === i && 'bg-primary')}
            onClick={() => onPage(i)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Button
        variant="clear"
        className={tw(currentPage === totalPages - 1 && 'opacity-50')}
        onClick={handleNextClick}
      >
        Next
      </Button>
    </div>
  );
};
