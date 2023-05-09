import { m } from 'framer-motion';
// next
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Box, Grid, Chip, Stack, Typography } from '@mui/material';
// routes
import Routes from 'src/routes';
// utils
// @types
// components
import { Image, TextMaxLine } from 'src/components';
import { varHover, varTranHover } from 'src/components/animate';
import EEAvatar from 'src/components/EEAvatar';
import { useRouter } from 'next/router';
import { fDate } from 'src/utils/formatTime';
import NextLink from 'next/link';
import { useResponsive } from 'src/hooks';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';

// ----------------------------------------------------------------------

type Props = {
  ticket: TicketInfoTypes;
};

export default function TicketPostItem({ ticket }: Props) {
  const { id, title, packageImage, categoriesStr, featured, createdAt } = ticket;
  const isMobile = useResponsive('down', 'md');

  const { push } = useRouter();
  const theme = useTheme();
  const handlerClick = () => {
    push(Routes.eternalEditions.ticket(id.toString()));
  };

  return (
    <Grid item xs={12} sm={4}>
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
          <Box
            component={m.div}
            variants={varHover(1.25)}
            transition={varTranHover()}
            sx={{ position: 'relative' }}
          >
            <Image src={packageImage} alt={title.en} ratio="4/6" sx={{ minHeight: 280 }} />
            <Box
              sx={{
                position: 'absolute',
                background: 'rgba(0, 0, 0, 0.2)',
                zIndex: 3,
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                // pointerEvents: 'none',
              }}
            />
          </Box>

          <Stack
            justifyContent="flex-end"
            sx={{
              p: isMobile ? 2 : 3,
              height: 1,
              zIndex: 9,
              position: 'absolute',
              color: 'common.white',
            }}
          >
            <Stack spacing={0.25}>
              {/* <Stack
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
              </Stack> */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ opacity: 0.72, typography: 'caption' }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 12,
                      md: 14,
                    },
                    lineHeight: 20 / 14,
                    color: 'red',
                  }}
                >
                  @iloveseoul
                </Typography>
              </Stack>

              <TextMaxLine
                sx={{
                  fontSize: { xs: 24, md: 40 },
                  lineHeight: {
                    xs: 28 / 24,
                    md: 44 / 40,
                  },
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {title.en}
              </TextMaxLine>
              <Typography
                sx={{
                  mb: 1,
                  mt: { xs: 1, sm: 0.5 },
                  fontSize: 12,
                  lineHeight: 16 / 12,
                  color: 'common.white',
                }}
              >
                {createdAt && fDate(createdAt, 'EEEE (MMMM dd, yyyy)')}
              </Typography>
              <Typography
                sx={{
                  mb: 1,
                  mt: { xs: 1, sm: 0.5 },
                  fontSize: 12,
                  lineHeight: 16 / 12,
                  color: 'red',
                }}
              >
                HQ Beercade Nashville Nashville, TN
              </Typography>
            </Stack>
          </Stack>

          <Stack
            sx={{
              p: isMobile ? 2 : 3,
              height: 1,
              zIndex: 9,
              left: 0,
              position: 'absolute',
            }}
          >
            <Chip
              label={'WHITELIST MINTING'}
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                color: 'red',
              }}
            />
          </Stack>

          <Stack
            sx={{
              p: isMobile ? 2 : 3,
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
              ? categoriesStr.split(',').map((category: string, index) => (
                  <Chip
                    key={index}
                    label={category.toUpperCase()}
                    variant="outlined"
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  />
                ))
              : null}
          </Stack>
        </Stack>
      </NextLink>
    </Grid>
  );
}
