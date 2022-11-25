// icon
// next
import {useRouter} from 'next/router';
// @mui
import {styled, useTheme} from '@mui/material/styles';
import {Typography} from "@mui/material";
//

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({}));

// ----------------------------------------------------------------------

type Props = {
    title?: string;
    description?: string;
};

export default function PageHeader({title, description, ...other}: Props) {
    const router = useRouter();
    const theme = useTheme();
    return (
        <RootStyle {...other}>
            <Typography variant={"h1"} sx={{ color: theme.palette.primary.main }}>{title}</Typography>
            {description && <Typography>{description}</Typography>}
        </RootStyle>
    );
}
