import {ReactElement} from 'react';
// @mui
import {styled} from '@mui/material/styles';
// config
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from '../../src/config';
// utils
import {getAllPosts} from '../../src/utils/get-mardown/travel/posts';
// @types
import {BlogPostProps} from '../../src/@types/blog';
// _data
import {_brands, _members, _testimonials} from '../../_data/mock';
// layouts
import Layout from '../../src/layouts';
// components
import {Page} from '../../src/components';
// sections
import {NewsletterTravel} from '../../src/sections/newsletter';
import {TestimonialsTravel} from '../../src/sections/testimonials';
import {TeamTravelAbout} from '../../src/sections/team';
import {OurClientsTravel} from '../../src/sections/our-clients';
import {TravelAbout, TravelAboutOurVision} from '../../src/sections/@eternaledtions';
import {Container} from "@mui/material";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  posts: BlogPostProps[];
};

export default function EEAboutUsPage({ posts }: Props) {
  return (
    <Page title="About Us">
      <RootStyle>
        <Container>
          About
        </Container>
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
