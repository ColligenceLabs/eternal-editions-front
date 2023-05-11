import { Stack, styled, Tab, tabClasses, Tabs, TabsProps, Typography } from '@mui/material';
import React from 'react';

type CategoryType = {
  category: string;
  count: string;
};

const StyledTab = styled(Tab)(({ theme }) => ({
  [`&.${tabClasses.root}`]: {
    opacity: 0.6,
    color: 'white',
    background: 'rgba(0, 0, 0, 0.24)',
    backdropFilter: 'blur(50px)',
    borderRadius: '60px',
    minHeight: 'unset',
  },
  [`&.${tabClasses.selected}`]: {
    opacity: 1,
  },
  [`&.${tabClasses.root}:first-of-type`]: {
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
    },
  },
  [`&.${tabClasses.root}:not(:last-of-type)`]: {
    marginRight: '2px',
    [theme.breakpoints.up('md')]: {
      marginRight: '4px',
    },
  },
}));

// ----------------------------------------------------------------------

type Props = {
  categories: CategoryType[];
  value: any;
  onChange: TabsProps['onChange'];
};

export default function CategoryTabs({ categories, value, onChange }: Props) {
  return (
    <Tabs
      value={value}
      variant="scrollable"
      TabIndicatorProps={{ sx: { display: 'none' } }}
      onChange={onChange}
    >
      {categories.map((category: CategoryType) => {
        if (category.category !== '')
          return (
            <StyledTab
              key={category.category}
              value={category.category}
              label={
                <Stack
                  flexDirection="row"
                  useFlexGap
                  gap="10px"
                  sx={{
                    fontSize: '14px',
                    lineHeight: 12 / 14,
                    textTransform: 'uppercase',
                    padding: {
                      xs: '10px 12px',
                      md: '10px 16px',
                    },
                  }}
                >
                  <Typography fontSize="inherit" lineHeight="inherit" fontWeight="bold">
                    {category.category}
                  </Typography>
                  <Typography
                    fontSize="inherit"
                    lineHeight="inherit"
                    fontWeight="bold"
                    sx={{ color: 'white' }}
                  >
                    {category.count}
                  </Typography>
                </Stack>
              }
            />
          );
      })}
    </Tabs>
  );
}
