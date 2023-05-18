import { Grid } from '@mui/material';
import Routes from 'src/routes';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import TicketPostItemContent from './TicketPostItemContent';

// ----------------------------------------------------------------------

type Props = {
  ticket: TicketInfoTypes;
  shouldHideDetail?: boolean;
};

export default function TicketPostItem({ ticket }: Props) {
  if (!ticket) {
    return null;
  }

  const { id } = ticket;

  return (
    <Grid item xs={12} md={4}>
      <NextLink
        passHref
        // as={Routes.eternalEditions.ticket(id.toString())}
        as={Routes.eternalEditions.ticket(id ? id.toString() : '0')}
        href={Routes.eternalEditions.ticket('[slug]')}
      >
        <a>
          <TicketPostItemContent ticket={ticket} />
        </a>
      </NextLink>
    </Grid>
  );
}
