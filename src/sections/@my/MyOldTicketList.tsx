import { Stack } from '@mui/material';
import { JobItemSkeleton } from 'src/components';
import { useEffect, useState } from 'react';
import { getOldMyTicket, getOldMyTicketByUid } from '../../services/services';
import OldTicketItem from '../@eternaledtions/tickets/OldTicketItem';
import { useSelector } from 'react-redux';
import { OldTicketTypes } from 'src/@types/my/myOldTIcketTypes';

type Props = { loading?: boolean };

export default function MyOldTicketList({ loading }: Props) {
  const { user } = useSelector((state: any) => state.webUser);
  const [oldTicket, setOldTicket] = useState<OldTicketTypes[]>([]);

  const fetchOldMyTickets = async () => {
    let result;
    // const result = await getOldMyTicket();
    if (user?.uid) result = await getOldMyTicketByUid(user?.uid);
    else result = await getOldMyTicket();
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
