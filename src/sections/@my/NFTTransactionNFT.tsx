import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination, Stack, useTheme } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { ChangeEvent, useEffect, useState } from 'react';
import { getUserTransactionsByUID } from '../../services/services';
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
import { SUCCESS } from 'src/config';

type UserTransactionsType = {
  id: number;
  uid: string;
  dropsId: number;
  type: string;
  price: number;
  txHash: string;
  createdAt: Date;
  updatedAt: Date;
  drop: {
    id: number;
    mysteryBoxId: number;
    itemId: number;
    tokenId: number;
    buyer: string;
    buyerAddress: string;
    price: number;
    fiatPrice: null;
    txHash: string;
    iapOrderId: null;
    isRevealed: boolean;
    isSent: boolean;
    usePoint: boolean;
    status: string;
    useDate: null | Date;
    createdAt: Date;
    updatedAt: Date;
    mysteryboxInfo: {
      title: {
        ko: string;
        en: string;
      };
    };
    mysteryboxItem: {
      name: string;
    };
  };
};

export default function NFTTransactionNFT() {
  const theme = useTheme();
  const { user } = useSelector((state: any) => state.webUser);
  const [userTransactions, setUserTransactions] = useState<UserTransactionsType[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const fetchTransaction = async () => {
    const userTransactionsRes = await getUserTransactionsByUID(user.uid, page);
    if (userTransactionsRes.data.status === SUCCESS)
      setUserTransactions(userTransactionsRes.data.data.histories);
    setTotalPage(userTransactionsRes.data.data.headers.x_pages_count);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const moveToScope = (txHash: string) => {
    let url = '';
    if (env.REACT_APP_TARGET_NETWORK === 80001) {
      url = `https://mumbai.polygonscan.com/tx/${txHash}`;
    } else {
      url = `https://polygonscan.com/tx/${txHash}`;
    }
    window.open(url, '_blank');
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
                  <HeaderTableCell>Status</HeaderTableCell>
                  <HeaderTableCell>Confirmation</HeaderTableCell>
                </TableRow>
              </TableHead>
              <BodyTable>
                {userTransactions &&
                  userTransactions.map((row: UserTransactionsType, index) => (
                    <BodyTableRow key={index}>
                      <BodyTableCell
                        sx={{ [theme.breakpoints.down('md')]: { marginBottom: '16px' } }}
                      >
                        <DateValue>{new Date(row.createdAt).toLocaleString()}</DateValue>
                        <LinkColumn sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }}>
                          <IconButton
                            onClick={() => moveToScope(row.txHash)}
                            sx={{ backgroundColor: '#F5F5F5', borderRadius: '100%' }}
                            aria-label="hyperlink"
                          >
                            <LaunchIcon sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </LinkColumn>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Type</CellLabel>
                        <CellValue>{row.drop.usePoint ? 'POINT' : 'CRYPTO'}</CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>NFT</CellLabel>
                        <CellValue>
                          <MysteryBoxValue>{`${row.drop.mysteryboxInfo.title.en} - ${row.drop.mysteryboxItem?.name}`}</MysteryBoxValue>
                        </CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Price</CellLabel>
                        <CellValue>
                          {row.drop.usePoint ? `${row.price * 0.1} EDCP` : `${row.price} USDC`}
                        </CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Status</CellLabel>
                        <CellValue>{row.type}</CellValue>
                      </BodyTableCell>
                      <BodyTableCell>
                        <CellLabel>Confirmation</CellLabel>
                        {row.txHash && (
                          <CellValue>
                            <LinkColumn>{`${row.txHash.substring(0, 20)}...`}</LinkColumn>
                          </CellValue>
                        )}
                      </BodyTableCell>
                      <BodyTableCell sx={{ [theme.breakpoints.down('md')]: { display: 'none' } }}>
                        {row.txHash && (
                          <LinkColumn>
                            <HyperlinkButton
                              onClick={() => moveToScope(row.txHash)}
                              styles={{ backgroundColor: '#F5F5F5' }}
                            />
                          </LinkColumn>
                        )}
                      </BodyTableCell>
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
