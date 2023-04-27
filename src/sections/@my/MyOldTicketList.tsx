// @mui
import { Stack } from '@mui/material';
import { JobItemSkeleton } from '../../components';
import { useEffect, useState } from 'react';
import { getOldMyTicket } from '../../services/services';
import OldTicketItem from '../@eternaledtions/tickets/OldTicketItem';

type Props = { loading?: boolean };

type OldTicketTypes = {
  id: number;
  name: string;
  thumbnail: string;
  qrcode: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

export default function MyOldTicketList({ loading }: Props) {
  const [oldTicket, setOldTicket] = useState<OldTicketTypes[]>([]);

  const fetchOldMyTickets = async () => {
    const result = await getOldMyTicket();
    console.log(result);
    if (result.data && result.data.data.length > 0) {
      const temp = result.data.data.map((ticket: any) => {
        const time = new Date().setMinutes(new Date().getMinutes() + 5);
        return {
          id: ticket.id,
          name: ticket.name,
          thumbnail: ticket.thumbnail,
          qrcode: `https://entrance.eternaleditions.io/admin-e-ticket/${ticket.code}?expireTime=${time}`,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          status: ticket.status,
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
          oldTicket.map((ticket, index) => {
            return <OldTicketItem key={index} ticket={ticket} />;
          })}
      </Stack>
    </>
  );
}
