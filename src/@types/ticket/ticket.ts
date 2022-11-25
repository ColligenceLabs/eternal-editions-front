import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import {CaseStudyFrontmatter} from "../marketing";
//

// ----------------------------------------------------------------------

// type PostFrontmatter = {
//     title: string;
//     description: string;
//     category: string;
//     coverImg: string;
//     heroImg: string;
//     createdAt: Date | string | number;
//     duration: string;
//     favorited: boolean;
//     shareLinks?: SocialLinks;
//     author: AuthorProps;
//     tags: string[];
// };

export type TicketProps = {
    slug: string;
    tokenId: string;
    content?: MDXRemoteSerializeResult;
    title?: string;
    subtitle?: string;
    description?: string;
    status?: string;
    createdAt?: Date | string | number;
    background?: string;
};

export type CategoryProps = {
    slug: string;
    title: string;
};

