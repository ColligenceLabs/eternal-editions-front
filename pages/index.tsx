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

// ----------------------------------------------------------------------
type Props = {
    posts: BlogPostProps[];
};

const RootStyle = styled('div')(({theme}) => ({
    paddingTop: HEADER_MOBILE_HEIGHT,
    [theme.breakpoints.up('md')]: {
        paddingTop: HEADER_DESKTOP_HEIGHT,
    },
    // background: 'red'
}));

export default function HomePage({posts}: Props) {
    return (
        <Page title="Main">
            <RootStyle>
                <Container>
                    MAIN Page
                </Container>
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