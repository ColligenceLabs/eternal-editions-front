// material
import { useTheme } from '@mui/material/styles';
// theme
import { TypographyVariant } from '../theme/typography';
// hooks
import useResponsive from '../hooks/useResponsive';

// ----------------------------------------------------------------------

export default function GetFontValue(variant: TypographyVariant) {
  const theme = useTheme();
  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === 'xl' ? 'lg' : breakpoints);

  const hasResponsive =
    variant === 'h1' ||
    variant === 'h2' ||
    variant === 'h3' ||
    variant === 'h4' ||
    variant === 'h5' ||
    variant === 'h6';

  const getFont: any =
    hasResponsive && theme.typography[variant][key]
      ? theme.typography[variant][key]
      : theme.typography[variant];

  const fontSize = remToPx(getFont.fontSize);
  const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;
  const fontWeight = theme.typography[variant].fontWeight;
  const letterSpacing = theme.typography[variant].letterSpacing;

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}

// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({
  xs,
  sm,
  md,
  lg,
  xl,
}: {
  xs?: number;
  sm: number;
  md: number;
  lg: number;
  xl?: number;
}) {
  return {
    fontSize: pxToRem(xs || sm),
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:960px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1280px)': {
      fontSize: pxToRem(lg),
    },
    '@media (min-width:1920px)': {
      fontSize: pxToRem(xl || lg),
    },
  };
}

// ----------------------------------------------------------------------

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    // @ts-ignore not sure what is this
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useResponsive('up', key);
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}
