// icons
// @mui
import {styled} from '@mui/material/styles';
import {Container, Divider, Typography} from '@mui/material';
// hooks
// routes
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {},
}));

const AboutVideoSection = styled('section')(() => ({
  paddingBottom: '60px',
}));

const AboutVideoBox = styled('div')(() => ({
  position: 'relative',
  paddingBottom: '56.25%',
  borderRadius: '24px',
  overflow: 'hidden',
}));

const AboutVideoPlayer = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: '#eee',
}));

const AboutVideoPlayButton = styled('div')(({theme}) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(50px)',
  fontSize: '15px',
  fontWeight: '700',
  lineHeight: '18px',
  textAlign: 'center',
  cursor: 'pointer',
  [theme.breakpoints.up('md')]: {
    width: '150px',
    height: '150px',
  },
}));


// ----------------------------------------------------------------------

export default function AboutVideo() {

  return (
    <RootStyle>
      <AboutVideoSection>
        <Container maxWidth={false} sx={{px: {xs: '12px', lg: '80px'}}}>
          <AboutVideoBox>
            <AboutVideoPlayer>
              <AboutVideoPlayButton>
                PLAY<br />
                VIDEO
              </AboutVideoPlayButton>
            </AboutVideoPlayer>
          </AboutVideoBox>
        </Container>
      </AboutVideoSection>
    </RootStyle>
  );
}
