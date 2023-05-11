import { TableCell, TableCellProps, TableRow, TableRowProps, styled } from '@mui/material';

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
  })
);

export const BodyTableRow = styled((props: TableRowProps) => <TableRow {...props} />)(
  ({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    fontSize: 14,
    lineHeight: 20 / 14,
    width: '100%',
  })
);

export const BodyTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(
  ({ theme }) => ({
    background: 'transparent',
    color: theme.palette.common.black,
    padding: '24px 0 24px 24px',
    textAlign: 'left',

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

export const LinkColumn = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.common.black,
}));
