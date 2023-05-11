import {
  Table as MUITable,
  TableCell,
  TableCellProps,
  TableRow,
  TableRowProps,
  TableBody,
  styled,
  Typography,
} from '@mui/material';

export const Table = styled(MUITable)(({ theme }) => ({
  background: 'transparent',
  borderCollapse: 'separate',
  borderSpacing: '0 2px',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

export const HeaderTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(
  ({ theme }) => ({
    fontSize: 12,
    lineHeight: 17 / 12,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'transparent',
    textAlign: 'left',
    padding: '8px 0 8px 24px',

    '&:first-of-type': {
      boxShadow: 'none',
    },
    '&:last-child': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  })
);

export const CellLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  lineHeight: 17 / 12,
  textTransform: 'uppercase',
  color: '#999999',
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

export const CellValue = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 20 / 14,
  color: theme.palette.common.black,
}));

export const BodyTableRow = styled((props: TableRowProps) => <TableRow {...props} />)(
  ({ theme }) => ({
    fontSize: 14,
    lineHeight: 20 / 14,
    color: theme.palette.common.black,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex !important',
      flexDirection: 'column',
      gap: '11px',
      backgroundColor: theme.palette.common.white,
      padding: '16px',
      borderRadius: '24px',
    },
  })
);

export const BodyTable = styled(TableBody)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    width: '100%',
  },
}));

export const BodyTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(
  ({ theme }) => ({
    background: 'transparent',
    color: theme.palette.common.black,
    padding: '24px 0 24px 24px',
    textAlign: 'left',
    fontSize: 14,
    lineHeight: '20px',

    '&:first-of-type': {
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
    },
    '&:last-child': {
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
    },

    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '11px',
      width: '100%',
      padding: 0,
      '&:first-of-type': {
        padding: 0,
      },
    },
  })
);

export const LinkColumn = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.common.black,
}));

export const DateValue = styled(Typography)(({ theme }) => ({
  fontSize: 'inherit',
  lineHeight: 'inherit',
  [theme.breakpoints.down('sm')]: {
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#999999',
  },
}));

export const MysteryBoxValue = styled(Typography)(({ theme }) => ({
  fontSize: 'inherit',
  lineHeight: 'inherit',
  [theme.breakpoints.down('sm')]: {
    color: 'rgba(0, 0, 0, 0.24)',
  },
}));
