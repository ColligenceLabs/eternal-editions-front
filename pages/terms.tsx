import { ReactElement } from 'react';
// @mui
import { styled } from '@mui/material/styles';
// config
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from 'src/config';
// utils
import { getAllPosts } from 'src/utils/get-mardown/travel/posts';
// @types
import { BlogPostProps } from 'src/@types/blog';
// _data
// layouts
import Layout from 'src/layouts';
// components
import { Page } from 'src/components';
import { Container } from '@mui/material';
// sections

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: HEADER_MOBILE_HEIGHT,
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
    paddingBottom: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  posts: BlogPostProps[];
};

export default function EEAboutUsPage({ posts }: Props) {
  return (
    <Page title="Tickets">
      <RootStyle>
        <Container>이용약관</Container>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

EEAboutUsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export async function getStaticProps() {
  return {
    props: {
      posts: getAllPosts(),
    },
  };
}
