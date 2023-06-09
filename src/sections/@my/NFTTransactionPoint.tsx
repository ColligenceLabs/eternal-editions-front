// icons
// @mui
import useWallets from '../../hooks/useWallets';

// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { CardActionArea, Pagination, Stack } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell/TableCell';
import { TableRowProps } from '@mui/material/TableRow/TableRow';
import { useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { getEdcTransactionByUID, getTransactionsByUID } from '../../services/services';

type TransactionsType = {
  user_id: string;
  order_id: string;
  point: number;
  type: string;
  createdAt: Date;
};

const HeaderTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(
  ({ theme }) => ({
    background: 'transparent',
    '&:first-of-type': {
      boxShadow: 'none',
    },
    '&:last-child': {
      boxShadow: 'none',
    },
  })
);

const BodyTableRow = styled((props: TableRowProps) => <TableRow {...props} />)(({ theme }) => ({
  backgroundColor: '#151515',
  borderRadius: 20,
  margin: '5px',
  // display: 'block',
  width: '100%',
}));

const BodyTableCell = styled((props: TableCellProps) => <TableCell {...props} />)(({ theme }) => ({
  background: 'transparent',
  '&:first-of-type': {
    boxShadow: 'none',
  },
  '&:last-child': {
    boxShadow: 'none',
  },
}));

export default function NFTTransactionPoint() {
  const { user } = useSelector((state: any) => state.webUser);
  const [transactions, setTransactions] = useState<TransactionsType[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const fetchTransaction = async () => {
    // const res = await getTransactionsByUID('435eTNke', page);
    const res = await getEdcTransactionByUID(user.uid, page);
    if (res.data.status === 1) {
      console.log(res.data.data.histories);
      setTransactions(res.data.data.histories);
      setTotalPage(res.data.data.headers.x_pages_count);
    }
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    fetchTransaction();
  }, [page]);

  return (
    <>
      <Stack spacing={3}>
        <Stack>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table sx={{ minWidth: 650, background: 'transparent' }} aria-label="simple table">
              <TableHead sx={{ background: 'transparent' }}>
                <TableRow sx={{ background: 'transparent', boxShadow: 'none' }}>
                  <HeaderTableCell>Date</HeaderTableCell>
                  {/*<HeaderTableCell align="right">User Id</HeaderTableCell>*/}
                  <HeaderTableCell align="right">Order #</HeaderTableCell>
                  <HeaderTableCell align="right">+/- Amount</HeaderTableCell>
                  <HeaderTableCell align="right">Type</HeaderTableCell>

                  {/*<HeaderTableCell align="right">-</HeaderTableCell>*/}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions &&
                  transactions.map((row: TransactionsType, index) => (
                    <BodyTableRow key={index}>
                      <BodyTableCell>{new Date(row.createdAt).toLocaleString()}</BodyTableCell>
                      {/*<BodyTableCell align="right">{row.user_id}</BodyTableCell>*/}
                      <BodyTableCell align="right">{row.order_id}</BodyTableCell>
                      <BodyTableCell align="right">{row.point}</BodyTableCell>
                      <BodyTableCell align="right">{row.type}</BodyTableCell>
                      {/*<BodyTableCell align="right">-</BodyTableCell>*/}
                    </BodyTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Pagination
            count={totalPage}
            page={page}
            variant="outlined"
            color="primary"
            onChange={handlePageChange}
          />
        </Stack>
      </Stack>
    </>
  );
}
