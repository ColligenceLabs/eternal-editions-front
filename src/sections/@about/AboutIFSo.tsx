// icons
// @mui
import {styled} from '@mui/material/styles';
import {Container, Divider, Typography} from '@mui/material';
import React from "react";
import PageHeader from "../../components/common/PageHeader";
// hooks
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {},
}));

const AboutIfSoSection = styled('section')(({theme}) => ({
  position: 'relative',
  paddingBottom: '80px',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: '160px',
    paddingBottom: '160px',
  },
}));

const BlurCard = styled('div')(({theme}) => ({
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

export default function AboutIFSo() {

  return (
    <RootStyle>
      <AboutIfSoSection>
        <Container maxWidth={false} sx={{px: {xs: '12px', lg: '80px'}}}>
        <PageHeader
          title={`If so ?`}
        />

        <BlurCard>
          <Typography variant="h2" sx={{marginBottom: '12px', lineHeight: 1.05, textTransform: 'uppercase',}}>
            No one knows the result. However, it is clear<br/>
            that your active participation can completely<br/>
            change the future of our Eternal Editions.
          </Typography>
          <Typography variant="subtitle1" sx={{lineHeight: '18px', marginBottom: '16px'}}>
            We may be having a very radical dream. But humans are always experiencing change, and they're thinking about
            how to produce and distribute value more efficiently. Because humans are social animals. Web 3.0 might be
            far from us right now. However, the background of this discourse is a mixture of many problems in the
            existing web environment and human instinctive problem consciousness.
          </Typography>
          <Typography variant="subtitle1" sx={{lineHeight: '18px'}}>
            I think humanity has been thinking a lot about increasing the efficiency of the concept of collaboration in
            the various processes of starting with the family, forming a tribal society, and forming a nation. Eternal
            Editions contemplates the structure of new collaborations related to live events that entertain humanity
            with analog sensibilities. We sincerely hope that the structure of innovative collaboration will help more
            diverse people to host and participate in live events.
          </Typography>
        </BlurCard>
      </Container>
      </AboutIfSoSection>
    </RootStyle>
  );
}
