// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Pagination, Stack } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell/TableCell';
import { TableRowProps } from '@mui/material/TableRow/TableRow';
import { ChangeEvent, useEffect, useState } from 'react';
import { getTransactionsByUID } from '../../services/services';
import { useSelector } from 'react-redux';
import env from '../../env';

type TransactionsType = {
  buyer: string;
  buyerAddress: string;
  createdAt: Date;
  mysteryboxInfo: {
    title: {
      ko: string;
      en: string;
    };
  };
  mysteryboxItem: {
    name: string;
  };
  price: number;
  txHash: string;
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

const LinkColumn = styled('a')`
  text-decoration: none;
  color: #fff;
`;

export default function NFTTransactionNFT() {
  const { user } = useSelector((state: any) => state.webUser);
  console.log(user);
  const [transactions, setTransactions] = useState<TransactionsType[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const fetchTransaction = async () => {
    // const res = await getTransactionsByUID('435eTNke', page);
    const res = await getTransactionsByUID(user.uid, page);
    if (res.data.status === 1) {
      setTransactions(res.data.data.drops);
      setTotalPage(res.data.data.headers.x_pages_count);
    }
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getExternalUrl = (txHash: string) => {
    let url = '';
    if (env.REACT_APP_TARGET_NETWORK === 80001) {
      url = `https://mumbai.polygonscan.com/tx/${txHash}`;
    } else {
      url = `https://polygonscan.com/tx/${txHash}`;
    }
    return url;
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
                  <HeaderTableCell align="right">Type</HeaderTableCell>
                  <HeaderTableCell align="right">NFT</HeaderTableCell>
                  <HeaderTableCell align="right">Price</HeaderTableCell>
                  <HeaderTableCell align="right">Chain</HeaderTableCell>
                  <HeaderTableCell align="right">Confirmation</HeaderTableCell>
                  {/*<HeaderTableCell align="right">-</HeaderTableCell>*/}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions &&
                  transactions.map((row: TransactionsType, index) => (
                    <BodyTableRow key={index}>
                      <BodyTableCell>{new Date(row.createdAt).toLocaleString()}</BodyTableCell>
                      <BodyTableCell align="right">NFT</BodyTableCell>
                      <BodyTableCell align="right">{`${row.mysteryboxInfo.title.en} - ${row.mysteryboxItem.name}`}</BodyTableCell>
                      <BodyTableCell align="right">{row.price}</BodyTableCell>
                      <BodyTableCell align="right">Polygon</BodyTableCell>
                      <BodyTableCell align="right">
                        <LinkColumn
                          href={getExternalUrl(row.txHash)}
                          target="_blank"
                        >{`${row.txHash.substring(0, 20)}...`}</LinkColumn>{' '}
                      </BodyTableCell>
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
