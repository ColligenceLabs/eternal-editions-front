import {ReactElement} from 'react';
// _data
import {_pricingHome} from '../_data/mock';
// layouts
import Layout from '../src/layouts';
// components
import {Page} from '../src/components';
// sections
import {PricingHome} from '../src/sections/pricing';
import {
    MainHero
} from '../src/sections/main';
import MainFeaturedPosts from "../src/sections/@eternaledtions/main/MainFeaturedPosts";
import {getAllPosts} from "../src/utils/get-mardown/marketing/posts";
import {BlogPostProps} from "../src/@types/blog";
import {Container} from "@mui/material";
import {BlogMarketingPostList} from "../src/sections/blog";
import MainAbout from "../src/sections/@eternaledtions/main/MainAbout";

// ----------------------------------------------------------------------
type Props = {
    posts: BlogPostProps[];
};

export default function HomePage({posts}: Props) {
    return (
        <Page title="Main">

            <MainFeaturedPosts posts={posts.slice(-5)}/>
            {/*<MainHero />*/}
            <MainAbout/>

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