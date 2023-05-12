// ----------------------------------------------------------------------
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination, Stack, Typography, useTheme } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { ChangeEvent, useEffect, useState } from 'react';
import { getTransactionsByUID } from '../../services/services';
import { useSelector } from 'react-redux';
import env from '../../env';
import { IconButton } from '@mui/material';
import {
  BodyTable,
  BodyTableCell,
  BodyTableRow,
  HeaderTableCell,
  CellLabel,
  LinkColumn,
  Table,
  CellValue,
  DateValue,
  MysteryBoxValue,
} from 'src/components/StyledTable';
import HyperlinkButton from 'src/components/ticket/HyperlinkButton';

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
  const theme = useTheme();
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
          <TableContainer component={Paper} sx={{ minWidth: '100%', background: 'transparent' }}>
            <Table aria-label="simple table">
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
              <BodyTable>
                {transactions &&
                  transactions.map((row: TransactionsType, index) => (
                    <BodyTableRow key={index}>
                      <BodyTableCell
                        sx={{ [theme.breakpoints.down('md')]: { marginBottom: '16px' } }}
                      >
                        <DateValue>{new Date(row.createdAt).toLocaleString()}</DateValue>
                        <LinkColumn sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }}>
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
                      <BodyTableCell>
                        <CellLabel>Type</CellLabel>
                        <CellValue>NFT</CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>NFT</CellLabel>
                        <CellValue>
                          <MysteryBoxValue>{`${row.mysteryboxInfo.title.en} - ${row.mysteryboxItem?.name}`}</MysteryBoxValue>
                        </CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Price</CellLabel>
                        <CellValue>{row.price}</CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Blockchain</CellLabel>
                        <CellValue>Polygon</CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Confirmation</CellLabel>
                        <CellValue>
                          <LinkColumn
                            href={getExternalUrl(row.txHash)}
                            target="_blank"
                          >{`${row.txHash.substring(0, 20)}...`}</LinkColumn>
                        </CellValue>
                      </BodyTableCell>
                      <BodyTableCell sx={{ [theme.breakpoints.down('md')]: { display: 'none' } }}>
                        <LinkColumn>
                          <HyperlinkButton
                            href={getExternalUrl(row.txHash)}
                            styles={{ backgroundColor: '#F5F5F5' }}
                          />
                        </LinkColumn>
                      </BodyTableCell>
                      {/*<BodyTableCell >-</BodyTableCell>*/}
                    </BodyTableRow>
                  ))}
              </BodyTable>
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
