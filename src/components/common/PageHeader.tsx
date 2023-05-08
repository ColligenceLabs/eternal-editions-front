// icon
// next
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Link, IconButton, tooltipClasses, TooltipProps, Box } from '@mui/material';
import { Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
//

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  marginBottom: '32px',
  [theme.breakpoints.up('md')]: {
    marginBottom: '40px',
  },
}));

const IconArrow = styled('span')(({ theme }) => ({
  position: 'relative',
  top: '-5px',
  marginLeft: '8px',
  fontWeight: 400,
  [theme.breakpoints.up('md')]: {
    marginLeft: '30px',
  },
}));

const GreenTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    color: 'black',
    fontSize: 12,
    lineHeight: 16 / 12,
    padding: '6px 10px',
    maxWidth: '147px',
  },

  [`&.${tooltipClasses.popper} .${tooltipClasses.tooltipPlacementBottom}`]: {
    marginTop: '4px',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  link?: any;
  tooltipMessage?: string;
};

export default function PageHeader({ title, description, link, tooltipMessage, ...other }: Props) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <RootStyle {...other}>
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
        {!link ? (
          <Typography
            variant={'h1'}
            sx={{
              color: theme.palette.primary.main,
              lineHeight: 1,
              whiteSpace: 'pre-line',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
        ) : (
          <Link
            variant={'h1'}
            href={link}
            sx={{
              color: theme.palette.primary.main,
              lineHeight: 1,
              whiteSpace: 'pre-line',
              textTransform: 'uppercase',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            {title}
            <IconArrow>&gt;</IconArrow>
          </Link>
        )}

        {tooltipMessage ? (
          <GreenTooltip title={tooltipMessage} placement="bottom-start">
            <IconButton color="primary" sx={{ padding: 0, marginTop: 1 }}>
              <HelpOutline sx={{ fontSize: '22px' }} />
            </IconButton>
          </GreenTooltip>
        ) : null}
      </Box>

      {description && <Typography sx={{ whiteSpace: 'pre-line' }}>{description}</Typography>}
    </RootStyle>
  );
}
