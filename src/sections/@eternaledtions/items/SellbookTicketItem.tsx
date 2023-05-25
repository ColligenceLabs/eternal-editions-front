import { m } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Chip, Stack, Typography, styled } from '@mui/material';
import { Image, TextMaxLine } from 'src/components';
import { varHover, varTranHover } from 'src/components/animate';
import BuyNowButton from './BuyNowButton';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import Routes from 'src/routes';
import { useSelector } from 'react-redux';

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
  const webUser = useSelector((state: any) => state.webUser);
  const router = useRouter();
  // const isMobile = useResponsive('down', 'md');
  const { id, mysteryboxItem, sellInfo } = sellbookItem;
  let startDate = new Date();
  if (sellInfo && sellInfo.parameters) startDate = sellInfo.parameters.startDate;
  const { name, imageLink, categoriesStr, properties } = mysteryboxItem;
  const [team, setTeam] = useState('');
  const [day, setDay] = useState('');
  const isOnAuction = router.query.status; // TODO: Update value
  const theme = useTheme();

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

  if (!sellbookItem) {
    return null;
  }

  return (
    <Grid component="a" item xs={12} sm={6} md={4} lg={3}>
      <Wrapper>
        <NextLink
          as={Routes.eternalEditions.item(sellbookItem.id ? sellbookItem.id.toString() : '0')}
          href={Routes.eternalEditions.item('[slug]')}
          // href={`/items/${sellbookItem.id}`}
          passHref
        >
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
                {webUser.user.uid === sellbookItem.uid && (
                  <Stack
                    sx={{
                      p: 2,
                      height: 1,
                      zIndex: 9,
                      right: 0,
                      position: 'absolute',
                    }}
                  >
                    <Chip
                      label={'My sales'}
                      variant="outlined"
                      color="secondary"
                      sx={{
                        textTransform: 'uppercase',
                        fontWeight: theme.typography.fontWeightBold,
                      }}
                    />
                  </Stack>
                )}

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
        </NextLink>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '16px',
              lineHeight: 24 / 16,
              marginLeft: '16px',
            }}
          >
            {/*{`${(dollarPrice / 10).toFixed(4)} EDCP`}*/}

            {`${sellbookItem.drop?.usePoint ? sellbookItem.price / 10 : sellbookItem.price} ${
              sellbookItem.drop?.usePoint ? 'EDCP' : 'USDC'
            }`}
          </Typography>
          <BuyNowButton
            releasedDate={startDate}
            onClick={() => router.push(`/items/${sellbookItem.id}`)}
          />
        </Stack>
      </Wrapper>
    </Grid>
  );
}
