import { MDXRemoteSerializeResult } from 'next-mdx-remote';
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
    content: MDXRemoteSerializeResult;
    title: string;
    description: string;
};
