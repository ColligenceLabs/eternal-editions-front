import {styled, useTheme} from '@mui/material/styles';
import {Box, Chip, Typography} from "@mui/material";
import React from "react";
import {TicketProps} from "../../../@types/ticket/ticket";

const ContactCard = styled('div')(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '12px',
  borderRadius: '24px',
  backdropFilter: 'blur(50px)',
  background: 'rgba(0,0,0,.1)',
  height: '290px',
  [theme.breakpoints.up('md')]: {
    height: '320px',
    padding: '24px',
  },
}));

const ContactCardHeader = styled('div')(({theme}) => ({}));
const ContactCardButton = styled('div')(({theme}) => ({
  display: 'flex',
  marginTop: 'auto',
}));

type Props = {
  contact: {
    title: string;
    description: string;
    link: string;
  };
};

export default function ContactCardItem({contact}: Props) {
  const {title, description, link} = contact;
  return (
    <ContactCard>
      <ContactCardHeader>
        <Typography variant="h2" sx={{ mb: '8px'}}>{title}</Typography>
        <Typography variant="subtitle1" sx={{maxWidth: '384px', lineHeight: '20px'}}>
          {description}
        </Typography>
      </ContactCardHeader>
      <ContactCardButton>
        <Chip label="SEND A E-MAIL" variant="outlined" />
      </ContactCardButton>
    </ContactCard>
  )
}
