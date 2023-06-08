import { useEffect, useState } from 'react';
import { Box, Grid, Button, Stack, Typography } from '@mui/material';
import ProjectPostItem from './ProjectPostItem';
import { Iconify } from 'src/components';
import arrowDown from '@iconify/icons-carbon/arrow-down';
import {
  getProjectCountByCategory,
  getProjectList,
  getTicketsService,
} from 'src/services/services';
import { SUCCESS } from 'src/config';
import CategoryTabs from 'src/components/CategoryTabs';
import { ProjectItemTypes, ProjectTypes } from 'src/@types/project/projectTypes';

// ----------------------------------------------------------------------

type Props = {
  categories: string[];
};

type CategoryTypes = {
  category: string;
  count: string;
};

export default function ProjectsFilter({ categories: originCategories }: Props) {
  const [curPage, setCurPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [selected, setSelected] = useState('All');
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [projectList, setProjectList] = useState<ProjectTypes[]>([]);
  originCategories = ['All', ...Array.from(new Set(originCategories))];
  const perPage = 6;

  const handleChangeCategory = (event: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue);
  };

  const getProjects = async () => {
    const res = await getProjectList(curPage, perPage, selected);
    if (res.status === 200) {
      const currentDate = new Date();
      const temp =
        res.data.list &&
        res.data.list.map((item: ProjectTypes) => {
          const sortedTemp = item.projectItems.sort(
            (a: ProjectItemTypes, b: ProjectItemTypes) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          const latestItem = sortedTemp.find(
            (item: ProjectItemTypes) => new Date(item.startDate) <= currentDate
          );
          const latestTitle = latestItem ? latestItem.title : '';
          return sortedTemp ? { ...item, curCollectionName: latestTitle } : item;
        });

      setProjectList(temp);
    }
  };

  const getMoreProjects = async () => {
    const res = await getTicketsService(curPage, perPage, selected);
    if (res.status === 200) {
      const currentDate = new Date();
      const temp =
        res.data.list &&
        res.data.list.map((item: ProjectTypes) => {
          const sortedTemp = item.projectItems.sort(
            (a: ProjectItemTypes, b: ProjectItemTypes) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          const latestItem = sortedTemp.find(
            (item: ProjectItemTypes) => new Date(item.startDate) <= currentDate
          );
          const latestTitle = latestItem ? latestItem.title : '';
          return sortedTemp ? { ...item, curCollectionName: latestTitle } : item;
        });

      setProjectList((cur) => [...cur, ...temp]);
    }
  };

  const getCountByCategory = async () => {
    const res = await getProjectCountByCategory();

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

  useEffect(() => {
    setCurPage(1);
    // getTickets();
    getProjects();
    getCountByCategory();
  }, [selected]);

  useEffect(() => {
    if (curPage !== 1) getMoreProjects();
  }, [curPage]);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          alignItems: 'center',
          mx: {
            xs: -2.5,
            md: 0,
          },
        }}
      >
        <Box
          sx={{
            pb: { xs: 2, md: 5 },
            flexGrow: 1,
            width: '100%',
          }}
        >
          <CategoryTabs
            categories={categories}
            value={selected.toLocaleLowerCase()}
            onChange={handleChangeCategory}
          />
        </Box>
      </Stack>

      {projectList.length ? (
        <Grid container spacing={3}>
          {projectList.map((project, index) => (
            <ProjectPostItem key={index} project={project} />
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
