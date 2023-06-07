import { Grid } from '@mui/material';
import Routes from 'src/routes';
import NextLink from 'next/link';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import ProjectPostItemContent from './ProjectPostItemContent';
import { ProjectTypes } from 'src/@types/project/projectTypes';

// ----------------------------------------------------------------------

type Props = {
  project: ProjectTypes;
  shouldHideDetail?: boolean;
};

export default function ProjectPostItem({ project }: Props) {
  if (!project) {
    return null;
  }

  const { id } = project;

  return (
    <Grid item xs={12} md={4}>
      <NextLink
        passHref
        // as={Routes.eternalEditions.ticket(id.toString())}
        as={Routes.eternalEditions.project(id ? id.toString() : '0')}
        href={Routes.eternalEditions.project('[slug]')}
      >
        <a>
          <ProjectPostItemContent project={project} />
        </a>
      </NextLink>
    </Grid>
  );
}
