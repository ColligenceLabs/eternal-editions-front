import {
  Table as MUITable,
  TableCell,
  TableCellProps,
  TableRow,
  TableRowProps,
  styled,
  Typography,
} from '@mui/material';
import palette from 'src/theme/palette';

export const Table = styled(MUITable)(({ theme }) => ({
  background: 'transparent',
  borderCollapse: 'separate',
  borderSpacing: '0 2px',
}));

export const HeaderTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(
  ({ theme }) => ({
    fontSize: 12,
    lineHeight: 17 / 12,
    textTransform: 'uppercase',
    color: palette.dark.black.lighter,
    background: 'white',
    textAlign: 'left',
    padding: '8px 0 8px 24px',

    '&:first-of-type': {
      boxShadow: 'none',
    },
    '&:last-child': {
      boxShadow: 'none',
    },
  })
);

export const CellLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  lineHeight: 17 / 12,
  textTransform: 'uppercase',
  color: palette.dark.black.lighter,
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
    backgroundColor: theme.palette.common.white,
  })
);

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
  })
);
