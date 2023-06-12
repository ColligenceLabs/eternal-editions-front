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
        console.log(ticket);
        return {
          id: ticket.id,
          name: ticket.ticketInfo.ticketName,
          thumbnail: ticket.ticketInfo.image,
          qrcode: `https://entrance.eternaleditions.io/admin-e-ticket/${ticket.ticketInfo.code}?expireTime=${time}`,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          status: ticket.status,
          location: ticket.ticketInfo.location1,
          code: ticket.ticketInfo.code,
          team: ticket.ticketInfo.ticketInfoName,
          day: ticket.ticketInfo.showStartTime,
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
