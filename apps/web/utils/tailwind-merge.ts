import { extendTailwindMerge } from 'tailwind-merge';

import { Color, TextVariant } from '@/theme';

export const tw = extendTailwindMerge<'textVariants'>({
  override: {
    theme: {
      colors: Object.values(Color),
    },
  },
  extend: {
    classGroups: {
      textVariants: Object.values(TextVariant).map((x) => x.slice(1)),
    },
    conflictingClassGroups: {
      textVariants: ['font-size', 'font-weight', 'font-family', 'leading'],
    },
  },
});

export type ClassNameValue = Parameters<typeof tw>[number];
