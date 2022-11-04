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

export default function AboutIFSo() {
    
    return (
        <RootStyle>
            <Container maxWidth={'lg'}>

                <Typography>
                    IF SO
                </Typography>
                
            </Container>
        </RootStyle>
    );
}
