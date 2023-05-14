import { m } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Stack, Typography } from '@mui/material';
import Routes from 'src/routes';
import { Image, TextMaxLine } from 'src/components';
import { varHover, varTranHover } from 'src/components/animate';
import { useRouter } from 'next/router';
import { fDate } from 'src/utils/formatTime';
import { useResponsive } from 'src/hooks';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import { SxProps } from '@mui/system';

// ----------------------------------------------------------------------

type Props = {
  ticket: TicketInfoTypes | null;
  shouldHideDetail?: boolean;
  sx?: SxProps;
};

export default function TicketPostItemContent({ ticket, shouldHideDetail, sx }: Props) {
  const { push } = useRouter();
  const theme = useTheme();
  const isMobile = useResponsive('down', 'md');

  if (!ticket) {
    return null;
  }

  console.log(ticket);
  const {
    id,
    title,
    packageImage,
    categoriesStr,
    featured,
    createdAt,
    whitelistNftId,
    mysteryboxItems,
  } = ticket;

  const handlerClick = () => {
    push(Routes.eternalEditions.ticket(id.toString()));
  };

  return (
    <Stack
      component={m.div}
      whileHover="hover"
      variants={varHover(1)}
      transition={varTranHover()}
      sx={{
        borderRadius: {
          xs: 3,
          md: 5,
        },
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        ...sx,
      }}
      // onClick={handlerClick}
    >
      <Box
        component={m.div}
        variants={varHover(1.25)}
        transition={varTranHover()}
        sx={{ position: 'relative' }}
      >
        <Image src={packageImage} alt={title.en} ratio="3/4" sx={{ minHeight: 280 }} />
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

      {!shouldHideDetail ? (
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
                }}
              >
                {`@${featured?.company.name.en}`}
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
              }}
            >
              {mysteryboxItems &&
                mysteryboxItems[0].properties &&
                mysteryboxItems[0].properties[0].type.toLowerCase() === 'location' &&
                mysteryboxItems[0].properties[0].name}
            </Typography>
          </Stack>
        </Stack>
      ) : null}

      <Stack
        sx={{
          p: isMobile ? 2 : 3,
          height: 1,
          zIndex: 9,
          left: 0,
          position: 'absolute',
        }}
      >
        {whitelistNftId ? (
          <Chip
            label={'WHITELIST MINTING'}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
            }}
          />
        ) : (
          <Chip
            label={'PUBLIC SALE'}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
            }}
          />
        )}
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
                  color: theme.palette.common.white,
                }}
              />
            ))
          : null}
      </Stack>
    </Stack>
  );
}