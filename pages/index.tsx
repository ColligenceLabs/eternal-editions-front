import {ReactElement} from 'react';
// _data
// layouts
import Layout from '../src/layouts';
// components
import {Page} from '../src/components';
// sections
import {getAllPosts} from "../src/utils/get-mardown/marketing/posts";
import {BlogPostProps} from "../src/@types/blog";
import {styled} from "@mui/material/styles";
import {HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT} from "../src/config";
import {Container} from "@mui/material";
import HomeHero from "../src/sections/@home/HomeHero";
import HomeEvent from "../src/sections/@home/HomeEvent";
import HomeEternalEditions from "../src/sections/@home/HomeEternalEditions";
import HomeTeam from "../src/sections/@home/HomeTeam";
import HomeContact from "../src/sections/@home/HomeContact";

// ----------------------------------------------------------------------
type Props = {
  posts: BlogPostProps[];
};

const RootStyle = styled('div')(({theme}) => ({
  // paddingTop: HEADER_MOBILE_HEIGHT,
  // [theme.breakpoints.up('md')]: {
  //     paddingTop: HEADER_DESKTOP_HEIGHT,
  // }
}));

export default function HomePage({posts}: Props) {
  return (
    <Page title="Main">
      <RootStyle>
        <HomeHero/>
        <HomeEvent/>
        <HomeEternalEditions/>
        <HomeTeam/>
        <HomeContact/>
      </RootStyle>
    </Page>
  );
}

// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export async function getStaticProps() {
  return {
    props: {
      posts: getAllPosts(),
    },
  };
}
