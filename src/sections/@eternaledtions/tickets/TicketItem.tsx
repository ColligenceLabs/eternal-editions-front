import {m} from 'framer-motion';
// next
// @mui
import {Card, Stack} from '@mui/material';
// routes
// utils
// @types
// components
import {varHover, varTranHover} from '../../../components/animate';
import {TicketProps} from "../../../@types/ticket/ticket";


// ----------------------------------------------------------------------

type Props = {
    ticket?: TicketProps
};

export default function TicketItem({ticket}: Props) {

    return (
        <Stack
            component={m.div}
            whileHover="hover"
            variants={varHover(1)}
            transition={varTranHover()}
            sx={{overflow: 'hidden', position: 'relative'}}
        >

            <Card>
                <Stack>
                    slug: {ticket?.slug}
                </Stack>

                <Stack>
                    tokenId: {ticket?.tokenId}
                </Stack>

                <Stack>
                    title: {ticket?.title}
                </Stack>

                <Stack>
                    subtitle: {ticket?.subtitle}
                </Stack>

                <Stack>
                    status: {ticket?.status}
                </Stack>
            </Card>

        </Stack>
    );
}
