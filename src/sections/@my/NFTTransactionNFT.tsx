// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination, Stack } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { ChangeEvent, useEffect, useState } from 'react';
import { getTransactionsByUID } from '../../services/services';
import { useSelector } from 'react-redux';
import env from '../../env';
import { IconButton } from '@mui/material';
import {
  BodyTableCell,
  BodyTableRow,
  HeaderTableCell,
  LinkColumn,
} from 'src/components/StyledTable';

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
            <Table
              sx={{
                minWidth: 650,
                background: 'transparent',
                borderCollapse: 'separate',
                borderSpacing: '0 2px',
              }}
              aria-label="simple table"
            >
              <TableHead sx={{ background: 'transparent' }}>
                <TableRow>
                  <HeaderTableCell>Date</HeaderTableCell>
                  <HeaderTableCell>Type</HeaderTableCell>
                  <HeaderTableCell>NFT</HeaderTableCell>
                  <HeaderTableCell>Price</HeaderTableCell>
                  <HeaderTableCell>Chain</HeaderTableCell>
                  <HeaderTableCell>Confirmation</HeaderTableCell>
                  {/*<HeaderTableCell >-</HeaderTableCell>*/}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions &&
                  transactions.map((row: TransactionsType, index) => (
                    <BodyTableRow key={index}>
                      <BodyTableCell>{new Date(row.createdAt).toLocaleString()}</BodyTableCell>
                      <BodyTableCell>NFT</BodyTableCell>
                      <BodyTableCell>{`${row.mysteryboxInfo.title.en} - ${row.mysteryboxItem?.name}`}</BodyTableCell>
                      <BodyTableCell>{row.price}</BodyTableCell>
                      <BodyTableCell>Polygon</BodyTableCell>
                      <BodyTableCell>
                        <LinkColumn
                          href={getExternalUrl(row.txHash)}
                          target="_blank"
                        >{`${row.txHash.substring(0, 20)}...`}</LinkColumn>{' '}
                      </BodyTableCell>
                      <BodyTableCell>
                        <LinkColumn>
                          <IconButton
                            href={getExternalUrl(row.txHash)}
                            target="_blank"
                            sx={{ backgroundColor: '#F5F5F5', borderRadius: '100%' }}
                            aria-label="hyperlink"
                          >
                            <LaunchIcon sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </LinkColumn>
                      </BodyTableCell>
                      {/*<BodyTableCell >-</BodyTableCell>*/}
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
