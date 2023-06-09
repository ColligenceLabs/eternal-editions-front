import {MDXRemoteSerializeResult} from 'next-mdx-remote';
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
    author?: string;
};

export type CategoryProps = {
    slug: string;
    title: string;
};


export type MYTicketProps = {
    slug: string;
    tokenId: string;
    content?: MDXRemoteSerializeResult;
    title?: string;
    subtitle?: string;
    description?: string;
    status?: string;
    createdAt?: Date | string | number;
    background?: string;
    author?: string;
};