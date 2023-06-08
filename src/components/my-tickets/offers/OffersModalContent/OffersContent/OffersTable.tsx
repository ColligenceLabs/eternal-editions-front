// ----------------------------------------------------------------------
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack, TableBody, useTheme } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BodyTableCell, BodyTableRow, HeaderTableCell, Table } from './StyledTable';
import { getShotAddress } from 'src/utils/wallet';
import RoundedButton from 'src/components/common/RoundedButton';
import { OfferType } from './OffersContent';

const offers = [
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '17% above',
    expiration: 'in 2 days',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '16% above',
    expiration: 'in 3 hours',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '16% above',
    expiration: 'in 3 hours',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '16% above',
    expiration: 'in 3 hours',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '16% above',
    expiration: 'in 3 hours',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '16% above',
    expiration: 'in 3 hours',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
  {
    price: '12.4134 MATIC',
    usdPrice: '$ 37.45',
    floorDifference: '16% above',
    expiration: 'in 3 hours',
    address: '0x033c5e2f3059b57b6a91de1cb5ad0697023ea83a',
  },
];

interface Props {
  onClickItem?: (offer: OfferType) => void;
  sellbookId: number;
}

export default function OffersTable({ sellbookId, onClickItem }: Props) {
  const { user } = useSelector((state: any) => state.webUser);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [bids, setBids] = useState([]);

  const fetchBids = async () => {
    console.log('!! check offers : selBook id = ', sellbookId);
    // TODO : // TODO : DB 에서 해당 sellBook 건과 관련된 auction bid 정보 가져오기...
    setBids([]);
  };

  useEffect(() => {
    fetchBids();
  }, [sellbookId]);

  return (
    <>
      <Stack spacing={3}>
        <Stack>
          <TableContainer
            component={Paper}
            sx={{ width: '100%', maxHeight: '374px', background: 'transparent' }}
          >
            <Table aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  <HeaderTableCell>PRICE</HeaderTableCell>
                  <HeaderTableCell>USD PRICE</HeaderTableCell>
                  <HeaderTableCell>Floor Difference</HeaderTableCell>
                  <HeaderTableCell>EXPIRATION</HeaderTableCell>
                  <HeaderTableCell>FROM</HeaderTableCell>
                  <HeaderTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {offers &&
                  offers.map((row, index) => (
                    <BodyTableRow key={index} onClick={() => onClickItem && onClickItem(row)}>
                      <BodyTableCell>{row.price}</BodyTableCell>
                      <BodyTableCell>{row.usdPrice}</BodyTableCell>
                      <BodyTableCell>{row.floorDifference}</BodyTableCell>
                      <BodyTableCell>{row.expiration}</BodyTableCell>
                      <BodyTableCell>{getShotAddress(row.address)}</BodyTableCell>
                      <BodyTableCell>
                        <RoundedButton variant="inactive" sx={{ padding: '11px 16px' }}>
                          Winning Bid
                        </RoundedButton>
                      </BodyTableCell>
                    </BodyTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        {/* <Stack direction="row" justifyContent="center" alignItems="center">
          <Pagination
            count={totalPage}
            page={page}
            variant="outlined"
            color="primary"
            onChange={handlePageChange}
          />
        </Stack> */}
      </Stack>
    </>
  );
}
