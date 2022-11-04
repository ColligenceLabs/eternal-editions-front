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

export default function AboutHeader() {
    
    return (
        <RootStyle>
            <Container maxWidth={'lg'}>

                <Typography>ETERNAL<br/>
                    EDITIONS<br/>
                    2022.11.01<br/>
                    11:59:53</Typography>

                <Typography>
                    Eternal Editions gives new values in the live event industry.In the WEB 3.0 world, live event planners and participants communicate, BUIDL up, and share together. Our mission is to make all those experiences fun and convenient
                </Typography>
                
            </Container>
        </RootStyle>
    );
}
