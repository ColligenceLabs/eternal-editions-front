// ----------------------------------------------------------------------
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack, TableBody } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BodyTableCell, BodyTableRow, HeaderTableCell, Table } from './StyledTable';
import { getShotAddress } from 'src/utils/wallet';
import RoundedButton from 'src/components/common/RoundedButton';
import { getBidListBySellbookId } from 'src/services/services';
import { SUCCESS } from 'src/config';

type BidTypes = {
  id: number;
  price: number;
  sellbookId: number;
  uid: string;
  wallet: string;
  bidInfo: any;
  createdAt: Date;
  updatedAt: Date;
};

interface Props {
  onClickItem?: (offer: BidTypes) => void;
  sellbookId: number | undefined;
  reservePrice: number;
}

export default function OffersTable({ sellbookId, reservePrice, onClickItem }: Props) {
  const { user } = useSelector((state: any) => state.webUser);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [bids, setBids] = useState<BidTypes[]>([]);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchBids = async (id: number) => {
    console.log('!! check offers : selBook id = ', id);
    const res = await getBidListBySellbookId(id.toString());
    console.log(res.data);
    if (res.data.status === SUCCESS) {
      console.log(res.data);
      // TODO : // TODO : DB 에서 해당 sellBook 건과 관련된 auction bid 정보 가져오기...
      setBids(res.data.data);
    }
  };

  useEffect(() => {
    if (sellbookId) fetchBids(sellbookId);
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
                  {/*<HeaderTableCell>EXPIRATION</HeaderTableCell>*/}
                  <HeaderTableCell>FROM</HeaderTableCell>
                  <HeaderTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {bids &&
                  bids.map((bid, index) => {
                    const quote = bid.bidInfo === null ? 'EDCP' : 'USDC';
                    const price = bid.bidInfo === null ? bid.price / 10 : bid.price;

                    return (
                      <BodyTableRow key={index}>
                        <BodyTableCell>{`${price} ${quote}`}</BodyTableCell>
                        <BodyTableCell>$ {bid.price}</BodyTableCell>
                        <BodyTableCell>
                          {((reservePrice / bid.price) * 100).toFixed(0)}%
                        </BodyTableCell>
                        {/*<BodyTableCell>{bid.expiration}</BodyTableCell>*/}
                        <BodyTableCell>{getShotAddress(bid.wallet)}</BodyTableCell>
                        <BodyTableCell>
                          <RoundedButton
                            variant="inactive"
                            sx={{ padding: '11px 16px' }}
                            onClick={() => onClickItem && onClickItem(bid)}
                          >
                            Winning Bid
                          </RoundedButton>
                        </BodyTableCell>
                      </BodyTableRow>
                    );
                  })}
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
