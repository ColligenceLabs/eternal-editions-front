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
import HomeHero from "../src/sections/@home/HomeHero";
import HomeEvent from "../src/sections/@home/HomeEvent";
import HomeNowEvent from "../src/sections/@home/HomeNowEvent";
import HomeEternalEditions from "../src/sections/@home/HomeEternalEditions";
import HomeTeam from "../src/sections/@home/HomeTeam";
import HomeContact from "../src/sections/@home/HomeContact";

// ----------------------------------------------------------------------
type Props = {
  posts: BlogPostProps[];
};

const RootStyle = styled('div')(({theme}) => ({
}));

const HomeBackground = styled('div')(() => ({
  background: 'url("/assets/background/bg-main.jpg") no-repeat top center',
  backgroundSize: 'cover',
  borderRadius: '24px',
}));

export default function HomePage({posts}: Props) {
  return (
    <Page title="Main">
      <RootStyle>
        <HomeHero/>
        {/* <HomeEvent/> */}
        {/* TODO 홈 이벤트 추가때 사용 */}
        {/* <HomeNowEvent/> */}
        <HomeBackground>
          <HomeEternalEditions/>
          <HomeTeam/>
          <HomeContact/>
        </HomeBackground>
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
