import { useEffect, useState } from 'react';
import { Box, Grid, Button, Stack, Typography } from '@mui/material';
import TicketItem from './TicketItem';
import { Iconify } from 'src/components';
import arrowDown from '@iconify/icons-carbon/arrow-down';
import { getTicketCountByCategory, getTicketsService } from 'src/services/services';
import { SUCCESS } from 'src/config';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import { useResponsive } from 'src/hooks';
import { TextSelect, TextSelectOption } from 'src/components/common/Select';
import { Modify } from 'notistack';

const COLLECTIONS = [
  {
    label: 'Yellow Team',
    value: 'yellow',
  },
  {
    label: 'Purple Team',
    value: 'purple',
  },
];

// ----------------------------------------------------------------------

type Props = {
  categories?: string[];
  shouldHideCategories?: boolean;
  items: TicketItemTypes[] | undefined;
  boxContractAddress: any;
  quote: string | undefined;
  mysterybox_id: number | undefined;
  ticketInfo?: TicketInfoTypes | null;
};

type CategoryTypes = {
  category: string;
  count: string;
};

type ExTicketItemType = Modify<
  TicketItemTypes,
  {
    categoriesStr: string;
    releaseDatetime: Date;
  }
>;

export default function TicketItemsInDrop({
  // categories: originCategories,
  items,
  boxContractAddress,
  quote,
  mysterybox_id,
  ticketInfo,
}: Props) {
  const isMobile = useResponsive('down', 'md');
  const [curPage, setCurPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [selected, setSelected] = useState('All');
  const [ticketInfoList, setTicketInfoList] = useState<TicketInfoTypes[]>([]);
  // const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [team, setTeam] = useState('default');
  const [salesType, setSalesType] = useState('default');
  const [teams, setTeams] = useState<string[]>([]);

  // originCategories = ['All', ...Array.from(new Set(originCategories))];
  const perPage = 6;

  const handleChangeCategory = (event: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue);
  };

  const getMoreTickets = async () => {
    const res = await getTicketsService(curPage, perPage, selected);
    console.log(res);
    if (res.status === 200) {
      setTicketInfoList((cur) => [...cur, ...res.data.list]);
    }
  };

  useEffect(() => {
    if (ticketInfo?.mysteryboxItems) {
      const items = ticketInfo.mysteryboxItems;
      console.log(items);
      items.map((item) => {
        if (item.properties) {
          const team = item.properties.filter((property) => property.type === 'team');

          if (team.length > 0 && team[0].name) {
            console.log(team[0].name);
            if (!teams.includes(team[0].name)) {
              setTeams((cur) => [...cur, team[0].name]);
            }
          }
        }
      });
    }
  }, [ticketInfo]);

  useEffect(() => {
    setCurPage(1);
    // getCountByCategory();
  }, [selected]);

  useEffect(() => {
    if (curPage !== 1) getMoreTickets();
  }, [curPage]);

  useEffect(() => {
    console.log(`team: ${team}`);
    console.log(items);
  }, [team]);

  if (!items) {
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
              <TextSelectOption hidden value="default">
                SELECT TEAM
              </TextSelectOption>
              {teams.map((team) => (
                <TextSelectOption key={team} value={team}>
                  {team}
                </TextSelectOption>
              ))}
            </TextSelect>
            <TextSelect
              value={salesType}
              onChange={(event) => setSalesType(event.target.value as string)}
            >
              <TextSelectOption hidden value="default">
                SELECT DAY
              </TextSelectOption>
            </TextSelect>
          </Stack>
        </Stack>
      </Stack>

      {items?.length ? (
        <Grid
          container
          spacing={{ xs: 1, md: 3 }}
          sx={{
            mt: { md: 0 },
          }}
        >
          {items.map((ticket, index) => (
            <TicketItem
              key={index}
              ticket={ticket}
              isInDrop={true}
              boxContractAddress={boxContractAddress}
              quote={quote}
              mysterybox_id={mysterybox_id}
              ticketInfo={ticketInfo}
            />
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" color="grey" sx={{ py: 5 }}>
          No items hav been registered.
        </Typography>
      )}
      {/* {curPage < lastPage && (
        <Stack
          alignItems="center"
          sx={{
            pt: 8,
            pb: { xs: 8, md: 10 },
          }}
        >
          <Button
            size="large"
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon={arrowDown} sx={{ width: 20, height: 20 }} />}
            sx={{ color: 'common.white' }}
            onClick={() => {
              setCurPage((cur) => cur + 1);
            }}
          >
            LOAD MORE
          </Button>
        </Stack>
      )} */}
    </Box>
  );
}

// ----------------------------------------------------------------------
