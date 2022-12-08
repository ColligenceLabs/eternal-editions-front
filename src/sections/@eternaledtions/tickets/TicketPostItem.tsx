import { m } from 'framer-motion';
// next
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Chip, Stack, Typography } from '@mui/material';
// routes
import Routes from '../../../routes';
// utils
// @types
// components
import { Image, TextMaxLine } from '../../../components';
import { varHover, varTranHover } from '../../../components/animate';
import { TicketProps } from '../../../@types/ticket/ticket';
import EEAvatar from '../../../components/EEAvatar';
import { useRouter } from 'next/router';
import { fDate } from '../../../utils/formatTime';
import NextLink from 'next/link';
import { TicketInfoTypes } from '../../../@types/ticket/ticketTypes';

// ----------------------------------------------------------------------

type Props = {
  ticket: TicketInfoTypes;
};

export default function TicketPostItem({ ticket }: Props) {
  console.log(ticket);
  const {
    id,
    title,
    // author,
    // tokenId,
    // content,
    packageImage,
    categoriesStr,
    introduction,
    // status,
    featured,
    createdAt,
    mysteryboxItems,
  } = ticket;

  const { push } = useRouter();
  const theme = useTheme();
  const handlerClick = () => {
    push(Routes.eternalEditions.ticket(id.toString()));
  };

  return (
    <Stack
      component={m.div}
      whileHover="hover"
      variants={varHover(1)}
      transition={varTranHover()}
      sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}
      // onClick={handlerClick}
    >
      <m.div variants={varHover(1.25)} transition={varTranHover()}>
        <Image src={packageImage} alt={title.en} ratio="6/4" />
      </m.div>

      <Stack
        justifyContent="space-between"
        sx={{
          p: 3,
          height: 1,
          zIndex: 9,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ opacity: 0.72, typography: 'caption' }}
          >
            <EEAvatar
              account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
              image={featured?.company.image}
              nickname={featured?.company.name.en}
              sx={{ mr: 0, width: 24, height: 24 }}
            />

            <Typography>{featured?.company.name.en}</Typography>
          </Stack>

          <TextMaxLine variant="h3" sx={{ width: '80%' }}>
            {title.en}
          </TextMaxLine>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              mt: { xs: 1, sm: 0.5 },
              color: 'common.white',
            }}
          >
            {createdAt && fDate(createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          p: 3,
          height: 1,
          zIndex: 9,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
        }}
      >
        {categoriesStr && categoriesStr.split(',').length > 0
          ? categoriesStr
              .split(',')
              .map((category: string) => <Chip label={category.toUpperCase()} variant="outlined" />)
          : null}
      </Stack>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
        sx={{
          p: 3,
          height: 1,
          zIndex: 9,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <NextLink
          passHref
          // as={Routes.eternalEditions.ticket(id.toString())}
          as={Routes.eternalEditions.ticket(id ? id.toString() : '0')}
          href={Routes.eternalEditions.ticket('[slug]')}
        >
          <Button size="large" variant="contained" fullWidth={true}>
            View Details
          </Button>
        </NextLink>
      </Stack>
    </Stack>
  );
}
