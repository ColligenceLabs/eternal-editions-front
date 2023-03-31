// icons
// @mui
import {styled} from '@mui/material/styles';
import {Container} from '@mui/material';
import PageHeader from "../../components/common/PageHeader";
import React from "react";
import ContactCard from "../@eternaledtions/main/ContactCard";
import Masonry from "@mui/lab/Masonry";
// hooks
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {},
}));

const ContactSection = styled('section')(({theme}) => ({
  paddingBottom: '160px',
  [theme.breakpoints.up('md')]: {},
}));

const contacts = [
  {
    title: 'Media&Press',
    description: 'All media and press related requests can be made through these channels.',
    link: 'mailto:eternaleditions@gmail.com',
  },
  {
    title: 'Consultations',
    description: 'All consultation related requests can be done through these channels. No request is too small. Please be patient and we will do our best to provide a prompt response.',
    link: 'mailto:eternaleditions@gmail.com',
  },
];

// ----------------------------------------------------------------------

export default function HomeContact() {
  return (
    <RootStyle>
      <ContactSection>
        <Container maxWidth={false} sx={{px: {xs: '12px', lg: '80px'}}}>
          <PageHeader title="CONTACT" />

          <Masonry columns={{xs: 1, md: 2}} spacing={1}>
            {contacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </Masonry>
        </Container>
      </ContactSection>
    </RootStyle>
  );
}
