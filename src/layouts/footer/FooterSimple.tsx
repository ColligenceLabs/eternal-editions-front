// @mui
import { Container, Typography } from '@mui/material';
// components
import { Logo } from 'src/components';

// ----------------------------------------------------------------------

export default function FooterSimple() {
  return (
    <Container sx={{ textAlign: 'center', py: 8 }}>
      <Logo isSimple sx={{ mb: 3 }} />
      <Typography variant="body3" sx={{ color: 'text.secondary' }}>
        © 2022. Eternal Editions, All rights reserved.
      </Typography>
    </Container>
  );
}
