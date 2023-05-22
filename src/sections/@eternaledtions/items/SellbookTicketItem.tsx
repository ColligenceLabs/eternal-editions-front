import { m } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Chip, Stack, Typography, styled } from '@mui/material';
import { Image, TextMaxLine } from 'src/components';
import { varHover, varTranHover } from 'src/components/animate';
import { useResponsive } from 'src/hooks';
import BuyNowButton from './BuyNowButton';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

const Wrapper = styled(Stack)(() => ({
  background: 'rgba(0, 0, 0, 0.24)',
  backdropFilter: 'blur(50px)',
  borderRadius: '40px',
  padding: '16px',
  gap: '12px',
}));

// ----------------------------------------------------------------------

type Props = {
  sellbookItem: any;
  isInDrop?: boolean;
  boxContractAddress?: any;
  quote?: string | undefined;
};

export default function SellbookTicketItem({ sellbookItem, isInDrop }: Props) {
  // console.log(sellbookItem);
  const router = useRouter();
  // const isMobile = useResponsive('down', 'md');
  const { id, mysteryboxItem } = sellbookItem;
  const { name, imageLink, categoriesStr, releaseDatetime, price, properties } = mysteryboxItem;
  console.log(sellbookItem);
  const [team, setTeam] = useState('');
  const [day, setDay] = useState('');
  const isOnAuction = router.query.status; // TODO: Update value
  const theme = useTheme();
  const [dollarPrice, setDollarPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [klayPrice, setKlayPrice] = useState(0);

  const getCoinPrice = () => {
    const url = 'https://bcn-api.talken.io/coinmarketcap/cmcQuotes?cmcIds=4256,3890';
    try {
      if (klayPrice === 0 || maticPrice === 0) {
        axios(url).then((response) => {
          const klayUsd = response.data.data[4256].quote.USD.price;
          // const klayKrw = response.data.data[4256].quote.KRW.price;
          const maticUsd = response.data.data[3890].quote.USD.price;
          // const maticKrw = response.data.data[3890].quote.KRW.price;
          setKlayPrice(parseFloat(klayUsd));
          setMaticPrice(parseFloat(maticUsd));
        });
      }
    } catch (error: any) {
      console.log(new Error(error));
    }
  };

  useEffect(() => {
    if (properties) {
      properties.map((property: any) =>
        property.type === 'team'
          ? setTeam(property.name)
          : property.type === 'day'
          ? setDay(property.name)
          : null
      );
    }
  }, [properties]);

  useEffect(() => {
    getCoinPrice();
  }, []);

  useEffect(() => {
    setDollarPrice((price ?? 0) * maticPrice);
  }, [price, maticPrice]);

  if (!sellbookItem) {
    return null;
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Wrapper>
        <Stack
          component={m.a}
          whileHover="hover"
          variants={varHover(1)}
          transition={varTranHover()}
          sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
        >
          <Box
            component={m.div}
            variants={varHover(1.25)}
            transition={varTranHover()}
            sx={{ position: 'relative' }}
          >
            <Image src={imageLink} alt={name} ratio="3/4" sx={{ minHeight: 280 }} />
            <Box
              sx={{
                position: 'absolute',
                background: 'rgba(0, 0, 0, 0.2)',
                zIndex: 3,
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
              }}
            />
          </Box>
          <Stack
            justifyContent="flex-end"
            sx={{
              p: 2,
              height: 1,
              zIndex: 9,
              position: 'absolute',
              color: 'common.white',
            }}
          >
            <Stack spacing={0.25}>
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: 12 / 17,
                }}
              >
                {`#${id}`}
              </Typography>
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
                {name}
              </TextMaxLine>
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: 16 / 12,
                  color: 'common.white',
                }}
              >
                {/*{createdAt && fDate(createdAt, 'EEEE (MMMM dd, yyyy)')}*/}
                {day}
              </Typography>
              <Stack flexDirection="row" gap={0.5} alignItems="center">
                <Typography
                  sx={{
                    fontSize: 12,
                    lineHeight: 16 / 12,
                  }}
                >
                  {`Team ${team}`}
                </Typography>
                <Box
                  sx={{
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    backgroundColor: `${team}`,
                    width: '8px',
                    height: '8px',
                    borderRadius: '100%',
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
          {!isInDrop && (
            <>
              <Stack
                sx={{
                  p: 2,
                  height: 1,
                  zIndex: 9,
                  left: 0,
                  position: 'absolute',
                }}
              >
                <Chip
                  label={isOnAuction ? 'On Auction' : 'For Sale'}
                  variant="outlined"
                  color="primary"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                />
              </Stack>
              <Stack
                sx={{
                  p: 2,
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
                  ? categoriesStr.split(',').map((category: string, index: number) => (
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
            </>
          )}
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '16px',
              lineHeight: 24 / 16,
              marginLeft: '16px',
            }}
          >
            {`${(dollarPrice / 10).toFixed(4)} EDCP`}
          </Typography>
          <BuyNowButton releasedDate={releaseDatetime} />
        </Stack>
      </Wrapper>
    </Grid>
  );
}
