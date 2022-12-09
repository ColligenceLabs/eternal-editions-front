// icon
// next
import {useRouter} from 'next/router';
// @mui
import {styled, useTheme} from '@mui/material/styles';
import {Typography, Link} from "@mui/material";
//

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  marginBottom: '32px',
  [theme.breakpoints.up('md')]: {
    marginBottom: '40px',
  }
}));

const IconArrow = styled('span')(({theme}) => ({
  position: 'relative',
  top: '-5px',
  marginLeft: '8px',
  fontWeight: 400,
  [theme.breakpoints.up('md')]: {
    marginLeft: '30px',
  }
}));

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  link?: any;
};

export default function PageHeader({title, description, link, ...other}: Props) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <RootStyle {...other}>
      {!link ? (
        <Typography variant={"h1"} sx={{color: theme.palette.primary.main, lineHeight: 1, whiteSpace: 'pre-line', textTransform: 'uppercase' }}>{title}</Typography>
      ) : (
        <Link
          variant={"h1"}
          href={link}
          sx={{
            color: theme.palette.primary.main,
            lineHeight: 1,
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
            '&:hover': {
              textDecoration: 'none'
            },
          }}
        >
          {title}
          <IconArrow>&gt;</IconArrow>
        </Link>
      )}
      {description && <Typography sx={{ whiteSpace: 'pre-line' }}>{description}</Typography>}
    </RootStyle>
  );
}
