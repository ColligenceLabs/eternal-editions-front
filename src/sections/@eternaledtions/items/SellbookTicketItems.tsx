import { useEffect, useState } from 'react';
import { Grid, Button, Stack, Typography } from '@mui/material';
import { Iconify } from 'src/components';
import arrowDown from '@iconify/icons-carbon/arrow-down';
import { getSellbookCategoryList, getSellBooks, getSellbookTeamsList } from 'src/services/services';
import { SUCCESS } from 'src/config';
import { TicketInfoTypes, TicketItemTypes } from 'src/@types/ticket/ticketTypes';
import CategoryTabs from 'src/components/CategoryTabs';
import { TextSelect, TextSelectOption } from 'src/components/common/Select';
import SellbookTicketItem from 'src/sections/@eternaledtions/items/SellbookTicketItem';
import TICKET from 'src/sample/ticket';

const SALE_TYPE = [
  { label: 'SELECT SALES TYPE', value: '0' },
  {
    label: 'Fixed Price',
    value: '1',
  },
  {
    label: 'Auction',
    value: '2',
  },
];

type Props = {
  shouldHideCategories?: boolean;
};

type CategoryTypes = {
  category: string;
  count: string;
};

type TeamType = {
  label: string;
  value: string;
};

type SellBookTypes = {
  id: number;
  infoId: number;
  itemId: number;
  mysteryboxInfo: TicketInfoTypes;
  mysteryboxItem: TicketItemTypes;
  type: number;
  uid: string;
  wallet: string;
  sellInfo: any;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function SellbookTicketItems({ shouldHideCategories }: Props) {
  const [curPage, setCurPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [salesType, setSalesType] = useState('0');
  const [sellBooks, setSellBooks] = useState<SellBookTypes[]>([]);
  const [teams, setTeams] = useState<TeamType[]>([]);
  const [team, setTeam] = useState('default');

  const originCategories = ['All', ...Array.from(new Set(TICKET.categories))];
  const perPage = 8;

  const handleChangeCategory = (event: React.SyntheticEvent, newValue: string) => {
    setCategory(newValue);
  };

  const fetchCountByCategory = async () => {
    const res = await getSellbookCategoryList();

    if (res.data.status === SUCCESS) setCategories(res.data.data);
    else {
      console.log('[error] item count by category fetch failed. ');
      const temp: CategoryTypes[] = originCategories.map((item) => ({
        category: item.toLowerCase(),
        count: '',
      }));
      setCategories([...temp]);
    }
  };

  const fetchTeamList = async () => {
    const res = await getSellbookTeamsList();

    if (res.data.status === SUCCESS) {
      const temp = res.data.data.teams.map((team: any) => ({
        label: team.team,
        value: team.team,
      }));
      setTeams([{ label: 'SELECT COLLECTION', value: 'default' }, ...temp]);
    }
  };

  const fetchSellBooks = async () => {
    const res = await getSellBooks(curPage, perPage, category, salesType, team);
    if (res.data.status === SUCCESS) {
      setLastPage(res.data.data.headers.x_pages_count);
      setSellBooks(res.data.data.sellbooks);
    }
  };

  const fetchMoreSellBooks = async () => {
    const res = await getSellBooks(curPage, perPage, category, salesType, team);
    if (res.status === 200) {
      setSellBooks((cur) => [...cur, ...res.data.data.sellbooks]);
    }
  };

  useEffect(() => {
    setCurPage(1);
    fetchCountByCategory();
    fetchSellBooks();
    fetchTeamList();
    // fetchCountByCategory();
  }, [category, salesType, team]);

  useEffect(() => {
    if (curPage !== 1) fetchMoreSellBooks();
  }, [curPage]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent={shouldHideCategories ? 'flex-end' : 'space-between'}
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{
          mx: {
            xs: -2.5,
            md: 0,
          },
          pb: { xs: 2, md: 5 },
        }}
      >
        {!shouldHideCategories ? (
          <CategoryTabs
            categories={categories}
            value={category.toLocaleLowerCase()}
            onChange={handleChangeCategory}
          />
        ) : null}

        <Stack
          flexDirection="row"
          gap="27px"
          sx={{
            ml: {
              xs: '20px',
              md: 0,
            },
          }}
        >
          <TextSelect value={team} onChange={(event) => setTeam(event.target.value as string)}>
            <TextSelectOption hidden value="default">
              SELECT COLLECTION
            </TextSelectOption>
            {teams &&
              teams.map((team) => (
                <TextSelectOption key={team.value} value={team.value}>
                  {team.label}
                </TextSelectOption>
              ))}
          </TextSelect>

          <TextSelect
            value={salesType}
            onChange={(event) => setSalesType(event.target.value as string)}
          >
            <TextSelectOption hidden value="default">
              SELECT SALES TYPE
            </TextSelectOption>
            {SALE_TYPE.map((type) => (
              <TextSelectOption key={type.value} value={type.value}>
                {type.label}
              </TextSelectOption>
            ))}
          </TextSelect>
        </Stack>
      </Stack>

      {sellBooks.length ? (
        <Grid container spacing={3}>
          {sellBooks.map((sellbookItem, index) => (
            <SellbookTicketItem key={index} sellbookItem={sellbookItem} />
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" color="grey" sx={{ py: 5 }}>
          No items hav been registered.
        </Typography>
      )}

      {curPage < lastPage && (
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
      )}
    </>
  );
}

// ----------------------------------------------------------------------
