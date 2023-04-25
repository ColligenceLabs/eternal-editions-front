import { pxToRem, responsiveFontSizes } from '../utils/getFontValue';

// ----------------------------------------------------------------------

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'subtitle3'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'caption'
  | 'button'
  | 'overline';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    subtitle3: React.CSSProperties;
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    subtitle3?: React.CSSProperties;
    body3?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    body3: true;
  }
}

const FONT_PRIMARY = "'Kommon Grotesk', sans-serif";
const FONT_SECONDARY = 'Barlow, sans-serif';

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightSemiBold: 600,
  banner1: {
    fontFamily: FONT_PRIMARY,
    fontWeight: 800,
    lineHeight: 132 / 148,
    textTransform: 'uppercase',
    ...responsiveFontSizes({ xs: 52, sm: 64, md: 98, lg: 148 }),
  },
  h1: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 700,
    lineHeight: 80 / 64,
    ...responsiveFontSizes({ xs: 40, sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 700,
    lineHeight: 64 / 48,
    ...responsiveFontSizes({ xs: 32, sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 700,
    lineHeight: 1.5,
    ...responsiveFontSizes({ xs: 24, sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 700,
    lineHeight: 1.5,
    ...responsiveFontSizes({ xs: 20, sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 600,
    lineHeight: 1.5,
    ...responsiveFontSizes({ xs: 18, sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 600,
    lineHeight: 28 / 18,
    ...responsiveFontSizes({ xs: 17, sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 28 / 16,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 26 / 14,
    fontSize: pxToRem(14),
  },
  subtitle3: {
    fontWeight: 600,
    lineHeight: 24 / 13,
    fontSize: pxToRem(13),
  },
  body1: {
    lineHeight: 28 / 16,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 26 / 14,
    fontSize: pxToRem(14),
  },
  body3: {
    lineHeight: 24 / 13,
    fontSize: pxToRem(13),
  },
  caption: {
    lineHeight: 20 / 12,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 600,
    lineHeight: 20 / 12,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 600,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
} as const;

export default typography;
