// @mui
import { Stack } from '@mui/material';
import { JobItemSkeleton } from 'src/components';
import { useEffect, useState } from 'react';
import { getOldMyTicket, getOldMyTicketByUid } from '../../services/services';
import OldTicketItem from '../@eternaledtions/tickets/OldTicketItem';
import { useSelector } from 'react-redux';

type Props = { loading?: boolean };

type OldTicketTypes = {
  id: number;
  name: string;
  thumbnail: string;
  qrcode: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  code: string;
  location: string;
  team: string;
  day: string;
  ticketInfo: {
    id: number;
    image: string;
    code: string;
    status: string;
    price: number;
    location1: string;
    location2: string;
    location3: string;
    usedTime: Date | null;
    used: boolean;
    onSale: boolean;
    onGift: boolean;
    idShow: number;
    showName: string;
    showLocation: string;
    ticketInfoName: string;
    ticketName: string;
    nftContractAddress: string;
    nftTokenID: any;
    nftBuyerWalletAddress: string;
    migrate: {
      migrateId: any;
      migrateTime: Date;
      migrate: boolean;
    };
    showStartTime: Date;
    txHistory: boolean;
    nft333: boolean;
    earlyBird2023: boolean;
  };
};

export default function MyOldTicketList({ loading }: Props) {
  const { user } = useSelector((state: any) => state.webUser);
  const [oldTicket, setOldTicket] = useState<OldTicketTypes[]>([]);

  const fetchOldMyTickets = async () => {
    let result;
    // const result = await getOldMyTicket();
    if (user?.uid) result = await getOldMyTicketByUid(user?.uid);
    else result = await getOldMyTicket();
    console.log(result);
    if (result.data && result.data.data?.length > 0) {
      const temp = result.data.data.map((ticket: any) => {
        const time = new Date().setMinutes(new Date().getMinutes() + 5);
        return {
          id: ticket.id,
          qrcode: `https://entrance.eternaleditions.io/admin-e-ticket/${ticket.ticketInfo.code}?expireTime=${time}`,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          status: ticket.status,
          code: ticket.code,
          ticketInfo: ticket.ticketInfo,
        };
      });
      setOldTicket(temp);
    }
  };

  useEffect(() => {
    fetchOldMyTickets();
  }, []);
  return (
    <>
      <Stack spacing={1} marginTop={1}>
        {!loading ?? <JobItemSkeleton />}
        {oldTicket &&
          oldTicket.map((ticket, index) => <OldTicketItem key={index} ticket={ticket} />)}
      </Stack>
    </>
  );
}
