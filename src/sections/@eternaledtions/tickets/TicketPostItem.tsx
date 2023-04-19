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
  const { id, title, packageImage, categoriesStr, featured, createdAt } = ticket;

  const { push } = useRouter();
  const theme = useTheme();
  const handlerClick = () => {
    push(Routes.eternalEditions.ticket(id.toString()));
  };

  return (
    <NextLink
      passHref
      // as={Routes.eternalEditions.ticket(id.toString())}
      as={Routes.eternalEditions.ticket(id ? id.toString() : '0')}
      href={Routes.eternalEditions.ticket('[slug]')}
    >
      <Stack
        component={m.div}
        whileHover="hover"
        variants={varHover(1)}
        transition={varTranHover()}
        sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
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
                .map((category: string, index) => (
                  <Chip key={index} label={category.toUpperCase()} variant="outlined" />
                ))
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
          <Button size="large" variant="contained" fullWidth={true}>
            View Details
          </Button>
        </Stack>
      </Stack>
    </NextLink>
  );
}
