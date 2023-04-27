// icons
// @mui
import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Box, Typography } from '@mui/material';
// hooks
// routes
// components
import PageHeader from '../../components/common/PageHeader';
import Masonry from '@mui/lab/Masonry';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {},
}));

const AboutWhyEESection = styled('section')(({ theme }) => ({
  position: 'relative',
  paddingTop: '454px',
  paddingBottom: '80px',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: '636px',
    paddingBottom: '160px',
  },
}));

const ImgHuman = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: '90px',
  right: '-45%',
  width: '660px',
  [theme.breakpoints.up('md')]: {
    top: '152px',
    right: '80px',
    width: '1280px',
  },
}));

const AboutWhyEEBody = styled('div')(({ theme }) => ({
  position: 'relative',
  '& + div': {
    paddingTop: '120px',
    [theme.breakpoints.up('md')]: {
      paddingTop: '240px',
    },
  },
}));

const TokenCardGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: '0 -2px',
    '> div:first-child': {
      marginBottom: 'auto',
    },
    '> div:last-child': {
      paddingTop: '200px',
    },
  },
}));

const TokenCardList = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '0',
  marginBottom: '20px',
  [theme.breakpoints.up('md')]: {
    width: '33.333333%',
    padding: '0 2px',
    marginBottom: '0',
  },
}));

const BlurCard = styled('div')(({ theme }) => ({
  padding: '12px',
  borderRadius: '24px',
  backdropFilter: 'blur(50px)',
  background: 'rgba(0,0,0,.1)',
  [theme.breakpoints.up('md')]: {
    maxWidth: 'inherit',
    margin: 'inherit',
    padding: '24px',
  },
}));

// ----------------------------------------------------------------------

export default function AboutWhyEE() {
  return (
    <RootStyle>
      <AboutWhyEESection>
        <Container maxWidth={false} sx={{ px: { xs: '12px', lg: '80px' } }}>
          <ImgHuman src="/assets/img/img-human.png" />

          <AboutWhyEEBody>
            <Box sx={{ mb: { xs: '40px', lg: '80px' } }}>
              <PageHeader
                title={`Why\nETERNAL EDITIONS?`}
                description={`The main reasons for the departure of the motivation \n of the event organizer and the growth limit.`}
              />
            </Box>

            <Masonry columns={{ xs: 1, md: 3 }} spacing={4}>
              <BlurCard>
                <Typography
                  variant="h2"
                  sx={{ marginBottom: '12px', lineHeight: 1.05, textTransform: 'uppercase' }}
                >
                  Tyranny of
                  <br />
                  Ticket
                  <br />
                  Platforms
                </Typography>
                <Typography variant="subtitle1" sx={{ lineHeight: '18px' }}>
                  Large ticket platforms (Bigtech) do not settle the ticket settlement price until
                  the end of the performance, so performance agencies need early seed funds.
                  <br />
                  Now popular performance tickets are open and have to be purchased, but on most
                  ticket platforms, hoarding through the "Macro Program (Bot)" exists, so ordinary
                  users do not even have a chance to buy tickets.
                </Typography>
              </BlurCard>
              <BlurCard>
                <Typography
                  variant="h2"
                  sx={{ marginBottom: '12px', lineHeight: 1.05, textTransform: 'uppercase' }}
                >
                  Absence of
                  <br />
                  Live Event’s
                  <br />
                  Community
                </Typography>
                <Typography variant="subtitle1" sx={{ lineHeight: '18px' }}>
                  It is time for performance and festival brands to form a community, too. All
                  businesses in the world are developing around the community, and live events are
                  still building communities through SNS of big tech companies that have nothing to
                  do with the interests of users.
                </Typography>
              </BlurCard>
              <BlurCard>
                <Typography
                  variant="h2"
                  sx={{ marginBottom: '12px', lineHeight: 1.05, textTransform: 'uppercase' }}
                >
                  Absence of
                  <br />
                  a Reasonable
                  <br />
                  Secondary Market
                </Typography>
                <Typography variant="subtitle1" sx={{ lineHeight: '18px' }}>
                  There are a growing number of MZ generations who earn side benefits through
                  resell, but there is no reliable rare ticket trading market.
                  <br />
                  If a secondary market recognized by the organizers is established, the organizers
                  will also receive profits from the secondary transaction and fake tickets can be
                  eradicated.
                </Typography>
              </BlurCard>
            </Masonry>
          </AboutWhyEEBody>

          {/* How To Accomplish The Mission */}
          <AboutWhyEEBody>
            <PageHeader title={`How to accomplish \n the mission ?`} />
            <TokenCardGroup>
              <TokenCardList>
                <BlurCard>
                  <Typography
                    variant="h3"
                    sx={{ marginBottom: '24px', lineHeight: 1.05, textTransform: 'uppercase' }}
                  >
                    NFT
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: '150px', lg: '200px' },
                      height: { xs: '150px', lg: '200px' },
                      margin: '0 auto 48px auto',
                      background: 'url("/assets/img/img-nft.png") no-repeat center',
                      backgroundSize: 'cover',
                    }}
                  ></Box>
                  <Typography variant="subtitle1" sx={{ lineHeight: '18px' }}>
                    Non-Fungible Token should be recognized as a medium for solving specific
                    problems for humanity, not as a new marketing forum. In the live event business,
                    NFT is a great way to solve problems that hinder creativity, such as hoarding
                    tickets for macro programs, releasing counterfeit tickets, and earning secondary
                    transactions unrelated to producers or artists.
                  </Typography>
                </BlurCard>
              </TokenCardList>
              <TokenCardList>
                <BlurCard>
                  <Typography
                    variant="h3"
                    sx={{ marginBottom: '24px', lineHeight: 1.05, textTransform: 'uppercase' }}
                  >
                    TOKENOMICS
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: '150px', lg: '200px' },
                      height: { xs: '150px', lg: '200px' },
                      margin: '0 auto 48px auto',
                      background: 'url("/assets/img/img-token.png") no-repeat center',
                      backgroundSize: 'cover',
                    }}
                  ></Box>
                  <Typography variant="subtitle1" sx={{ lineHeight: '18px' }}>
                    In the Web 3.0 ecosystem, encouragement of community engagement and reward
                    structures are important. With limited issuance volume and transparent
                    disclosure of transactions, Token can effectively manage Web 3.0 users'
                    participation and rewards.
                  </Typography>
                </BlurCard>
              </TokenCardList>
              <TokenCardList>
                <BlurCard>
                  <Typography
                    variant="h3"
                    sx={{ marginBottom: '24px', lineHeight: 1.05, textTransform: 'uppercase' }}
                  >
                    CORE IPS
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: '150px', lg: '200px' },
                      height: { xs: '150px', lg: '200px' },
                      margin: '0 auto 48px auto',
                      background: 'url("/assets/img/img-core.png") no-repeat center',
                      backgroundSize: 'cover',
                    }}
                  ></Box>
                  <Typography variant="subtitle1" sx={{ lineHeight: '18px' }}>
                    In order to do Radical things, we need the power of various IPs and brands that
                    have existing influence right now. Eternal Editions already has five Core IPs
                    with long-term track records and a strong fandom, and is leading the growth of
                    the industry through innovations that are not accessible at the startup level
                    through interaction with various expert groups in the live event industry.
                  </Typography>
                </BlurCard>
              </TokenCardList>
            </TokenCardGroup>
          </AboutWhyEEBody>
        </Container>
      </AboutWhyEESection>
    </RootStyle>
  );
}
