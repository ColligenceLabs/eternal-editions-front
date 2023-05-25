import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import TicketItem from './TicketItem';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import { useResponsive } from 'src/hooks';
import { TextSelect, TextSelectOption } from 'src/components/common/Select';
import CSnackbar from 'src/components/common/CSnackbar';

type Props = {
  categories?: string[];
  shouldHideCategories?: boolean;
  items: TicketItemTypes[] | undefined;
  boxContractAddress: any;
  quote: string | undefined;
  mysterybox_id: number | undefined;
  ticketInfo?: TicketInfoTypes | null;
};

export default function TicketItemsInDrop({
  items,
  boxContractAddress,
  quote,
  mysterybox_id,
  ticketInfo,
}: Props) {
  const isMobile = useResponsive('down', 'md');

  const [team, setTeam] = useState('default');
  const [day, setDay] = useState('default');
  const [filterOptionTeams, setFilterOptionTeams] = useState<string[]>([]);
  const [filterOptionDays, setFilterOptionDays] = useState<string[]>([]);
  const [ticketItems, setTicketItems] = useState<TicketItemTypes[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: '',
    message: '',
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar({
      open: false,
      type: '',
      message: '',
    });
  };

  useEffect(() => {
    if (ticketInfo?.mysteryboxItems) {
      const items = ticketInfo.mysteryboxItems;

      const tempTeams = Array.from(
        new Set(
          items
            .flatMap(
              (item) =>
                item.properties && item.properties.filter((prop) => prop && prop.type === 'team')
            )
            .map((prop) => prop && prop.name)
            .filter((name) => name !== null)
        )
      );

      setFilterOptionTeams(tempTeams);

      const tempDays = Array.from(
        new Set(
          items
            .flatMap(
              (item) => item.properties && item.properties.filter((prop) => prop.type === 'day')
            )
            .map((prop) => prop && prop.name)
            .filter((name) => name !== null)
        )
      );

      setFilterOptionDays(tempDays);
    }
  }, [ticketInfo]);

  useEffect(() => {
    if (items) {
      let temp = items;

      if (team !== 'default')
        temp = temp.filter((ticket) => {
          return ticket.properties.some(
            (property) => property.type === 'team' && property.name === team
          );
        });

      if (day !== 'default')
        temp = temp.filter((ticket) => {
          return ticket.properties.some(
            (property) => property.type === 'day' && property.name === day
          );
        });

      setTicketItems(temp);
    }
  }, [team, day]);

  useEffect(() => {
    if (items) setTicketItems(items);
  }, [items]);

  if (!ticketItems) {
    return null;
  }

  return (
    <Box>
      <Stack
        gap={{ xs: '28px' }}
        direction={isMobile ? 'column' : 'row'}
        justifyContent={isMobile ? 'flex-start' : 'space-between'}
        alignItems={isMobile ? 'flex-start' : 'flex-end'}
        sx={{ mt: { xs: '120px', md: '161px' } }}
      >
        <Stack direction="row" gap={1}>
          <Typography
            variant={'h1'}
            sx={{
              color: 'primary.main',
              lineHeight: 1,
              whiteSpace: 'pre-line',
              textTransform: 'uppercase',
            }}
          >
            {isMobile ? 'Drops' : 'Items'}
          </Typography>
          {!isMobile ? (
            <Typography fontWeight={700} fontSize="16px" lineHeight={2.5} color={'primary.main'}>
              in this drop
            </Typography>
          ) : null}
        </Stack>
        <Stack
          flexWrap="wrap"
          gap={1}
          sx={{
            mx: {
              xs: '-6px',
              md: 0,
            },
            pb: { xs: 2, md: 0 },
          }}
        >
          <Stack flexDirection="row" gap="27px">
            <TextSelect value={team} onChange={(event) => setTeam(event.target.value as string)}>
              <TextSelectOption value="default">SELECT TEAM</TextSelectOption>
              {filterOptionTeams.map((team) => (
                <TextSelectOption key={team} value={team}>
                  {team}
                </TextSelectOption>
              ))}
            </TextSelect>
            <TextSelect value={day} onChange={(event) => setDay(event.target.value as string)}>
              <TextSelectOption value="default">SELECT DAY</TextSelectOption>
              {filterOptionDays.map((day) => (
                <TextSelectOption key={day} value={day}>
                  {day}
                </TextSelectOption>
              ))}
            </TextSelect>
          </Stack>
        </Stack>
      </Stack>

      {ticketItems && ticketItems?.length ? (
        <Grid
          container
          spacing={{ xs: 1, md: 3 }}
          sx={{
            mt: { md: 0 },
          }}
        >
          {ticketItems.map((ticket, index) => (
            <TicketItem
              key={index}
              ticket={ticket}
              isInDrop={true}
              boxContractAddress={boxContractAddress}
              quote={quote}
              mysterybox_id={mysterybox_id}
              ticketInfo={ticketInfo}
              setOpenSnackbar={setOpenSnackbar}
            />
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" color="grey" sx={{ py: 5 }}>
          No items hav been registered.
        </Typography>
      )}
      <CSnackbar
        open={openSnackbar.open}
        type={openSnackbar.type}
        message={openSnackbar.message}
        handleClose={handleCloseSnackbar}
      />
    </Box>
  );
}
