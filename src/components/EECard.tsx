// @mui
import {Box, CardProps} from '@mui/material';
// utils
import {ReactNode} from "react";

// ----------------------------------------------------------------------

interface EECardProps extends CardProps {
    children: ReactNode;
}

// ----------------------------------------------------------------------
export default function EECard({children, ...other}: EECardProps) {


    return (
        <Box
            sx={{
                borderRadius: '24px',
                p: 3,
                backdropFilter: 'blur(50px)',
                WebkitBackdropFilter: 'blur(50px)'
            }}
            {...other}
        >
            {children}
        </Box>
    );
}
