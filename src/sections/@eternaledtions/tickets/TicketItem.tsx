// next
// @mui
import {Box, Button, Stack, Typography} from '@mui/material';
// routes
// utils
// @types
// components
import {MYTicketProps} from "../../../@types/ticket/ticket";
import EECard from "../../../components/EECard";
import {m} from "framer-motion";
import {Image, TextIconLabel, varHover, varTranHover} from "../../../components";
import React, {ReactElement} from "react";


// ----------------------------------------------------------------------

type Props = {
    ticket?: MYTicketProps;
};

export default function TicketItem({ticket}: Props) {
    const {slug, author, tokenId, content, title, background, subtitle, description, status, createdAt} = ticket;
    console.log(ticket, 'ticket');

    return (
        <Stack
            component={m.div}
            whileHover="hover"
            variants={varHover(1)}
            transition={varTranHover()}
            sx={{borderRadius: 2, overflow: 'hidden', position: 'relative', maxHeight: '380px'}}
        >

            <Stack
                justifyContent="space-between"
                sx={{
                    p: 3,
                    borderRadius: 2,
                    height: 1,
                    zIndex: 1000,
                    right: 0,
                    width: {
                        sm: '50%'
                    },
                    position: 'absolute',
                    color: 'common.black',
                    backgroundColor: 'common.white'
                }}>
                <Stack>
                    <LineItem icon={<></>} label="Reserve Price" value={'$37.45 (Ξ 0.02871)'}/>
                    <LineItem icon={<></>} label="Location"
                              value={'HQ Beercade Nashville Nashville, TN'}/>
                    <LineItem icon={<></>} label="Number of tickets" value={'3'}/>

                    <Stack
                        sx={{mt: 3}}
                        justifyContent="center"
                        alignItems="center"
                    >

                        <img src={"/assets/example/qr.png"} style={{maxWidth: '120px'}}/>
                    </Stack>

                    <Stack
                        sx={{mt: 4}}>
                        <Button size="large" variant="contained" fullWidth={true}>TO ENTER</Button>
                    </Stack>
                </Stack>


            </Stack>

            <Box
                component={"div"}
                variants={varHover(1.25)}
                transition={varTranHover()}
                sx={{
                    width: {
                        sm: '55%'
                    }
                }}
            >
                <Image src={background} alt={title} ratio="6/4"/>
            </Box>

        </Stack>
    );
}

type LineItemProps = {
    icon: ReactElement;
    label: string;
    value: any;
};


function LineItem({icon, label, value}: LineItemProps) {
    return (
        <TextIconLabel
            icon={icon}
            value={
                <>
                    <Typography sx={{fontSize: '14px'}}>{label}</Typography>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: 'common.black',
                            flexGrow: 1,
                            textAlign: 'right',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        {value}
                    </Typography>
                </>
            }
            sx={{
                color: 'common.black',
                '& svg': {mr: 1, width: 24, height: 24},
                borderBottom: '1px solid #bfbfbf',
                mb: 1
            }}
        />
    );
}
