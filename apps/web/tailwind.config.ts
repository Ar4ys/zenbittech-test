import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { Color, TextVariant } from './theme';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './icons/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: Color,
    /**
     * As per tailwind documentation, disabling plugins using `corePlugins` is preferable because
     * it's "consistent" with other plugins. In our case, we DO NOT WANT to disable entire
     * `fontSize` plugin, as we use it for one-time values (for example `text-[40px]`). If we
     * disable whole `fontSize` plugin - previous example stops working, as tailwind now thinks that
     * `40px` is a `color`, not a `font-size`. Instead we want to only remove default text-related
     * utilities in favour of our custom ones.
     *
     * @see https://tailwindcss.com/docs/theme#disabling-an-entire-core-plugin
     */
    fontSize: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        [TextVariant.HeadingOne]: {
          'font-size': '64px',
          'font-weight': '600',
          'line-height': '80px',
        },
        [TextVariant.HeadingTwo]: {
          'font-size': '48px',
          'font-weight': '600',
          'line-height': '56px',
        },
        [TextVariant.HeadingThree]: {
          'font-size': '32px',
          'font-weight': '600',
          'line-height': '40px',
        },
        [TextVariant.HeadingFour]: {
          'font-size': '24px',
          'font-weight': '700',
          'line-height': '32px',
        },
        [TextVariant.HeadingFive]: {
          'font-size': '20px',
          'font-weight': '700',
          'line-height': '24px',
        },
        [TextVariant.HeadingSix]: {
          'font-size': '16px',
          'font-weight': '700',
          'line-height': '24px',
        },
        [TextVariant.BodyLarge]: {
          'font-size': '20px',
          'font-weight': '500',
          'line-height': '32px',
        },
        [TextVariant.BodyRegular]: {
          'font-size': '16px',
          'font-weight': '700',
          'line-height': '24px',
        },
        [TextVariant.BodySmall]: {
          'font-size': '14px',
          'font-weight': '400',
          'line-height': '24px',
        },
        [TextVariant.BodyExtraSmall]: {
          'font-size': '12px',
          'font-weight': '400',
          'line-height': '16px',
        },
        [TextVariant.Caption]: {
          'font-size': '14px',
          'font-weight': '400',
          'line-height': '16px',
        },
        '.content-auto': {
          contentVisibility: 'none',
        },
      });
    }),
  ],
};
export default config;
