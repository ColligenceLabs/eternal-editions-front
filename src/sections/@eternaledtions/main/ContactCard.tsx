import { styled, useTheme } from '@mui/material/styles';
import { Box, Chip, Typography } from '@mui/material';
import React from 'react';
import { TicketProps } from '../../../@types/ticket/ticket';
import Link from 'next/link';

const ContactCard = styled('div')(({ theme }) => ({
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

const ContactCardHeader = styled('div')(({ theme }) => ({}));
const ContactCardButton = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: 'auto',
}));

const Anchor = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'block',
}));

type Props = {
  contact: {
    title: string;
    description: string;
    link: string;
  };
};

export default function ContactCardItem({ contact }: Props) {
  const { title, description, link } = contact;
  return (
    <ContactCard>
      <ContactCardHeader>
        <Typography variant="h2" color="common.white" sx={{ mb: '8px' }}>
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          color="common.white"
          sx={{
            maxWidth: '384px',
            lineHeight: '20px',
          }}
        >
          {description}
        </Typography>
      </ContactCardHeader>
      <ContactCardButton>
        {link && (
          <Anchor href={link} target={'_blank'}>
            <Chip
              label="SEND A E-MAIL"
              variant="outlined"
              sx={{ borderColor: 'common.white', color: 'common.white' }}
            />
          </Anchor>
        )}
      </ContactCardButton>
    </ContactCard>
  );
}
