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


// ----------------------------------------------------------------------

export default function HomeEternalEditions() {
    
    return (
        <RootStyle>
            <Container maxWidth={'lg'}>

                <Typography>Eternal Editions</Typography>

            </Container>
        </RootStyle>
    );
}
