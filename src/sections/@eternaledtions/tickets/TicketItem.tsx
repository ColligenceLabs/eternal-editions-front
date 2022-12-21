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
import {Image, TextIconLabel, TextMaxLine, varHover, varTranHover} from "../../../components";
import React, {ReactElement} from "react";
import EEAvatar from "../../../components/EEAvatar";
import {fDate} from "../../../utils/formatTime";


// ----------------------------------------------------------------------

type Props = {
    ticket?: MYTicketProps;
};

export default function TicketItem({ticket}: Props) {
    // const {slug, author, tokenId, content, title, background, subtitle, description, status, createdAt} = ticket;
    // console.log(ticket, 'ticket');

    // return (
    //     <Stack
    //         component={m.div}
    //         whileHover="hover"
    //         variants={varHover(1)}
    //         transition={varTranHover()}
    //         sx={{borderRadius: 2, overflow: 'hidden', position: 'relative', maxHeight: '380px'}}
    //     >

    //         <Stack
    //             justifyContent="space-between"
    //             sx={{
    //                 p: 3,
    //                 borderRadius: 2,
    //                 height: 1,
    //                 zIndex: 1000,
    //                 right: 0,
    //                 width: {
    //                     sm: '50%'
    //                 },
    //                 position: 'absolute',
    //                 color: 'common.black',
    //                 backgroundColor: 'common.white'
    //             }}>
    //             <Stack>
    //                 <LineItem icon={<></>} label="Reserve Price" value={'$37.45 (Ξ 0.02871)'}/>
    //                 <LineItem icon={<></>} label="Location"
    //                           value={'HQ Beercade Nashville Nashville, TN'}/>
    //                 <LineItem icon={<></>} label="Number of tickets" value={'3'}/>

    //                 <Stack
    //                     sx={{mt: 3}}
    //                     justifyContent="center"
    //                     alignItems="center"
    //                 >

    //                     <img src={"/assets/example/qr.png"} style={{maxWidth: '120px'}}/>
    //                 </Stack>

    //                 <Stack
    //                     sx={{mt: 4}}>
    //                     <Button size="large" variant="contained" fullWidth={true}>TO ENTER</Button>
    //                 </Stack>
    //             </Stack>


    //         </Stack>

    //         <Box
    //             component={"div"}
    //             sx={{
    //                 width: {
    //                     sm: '55%'
    //                 }
    //             }}
    //         >
    //             <Stack spacing={1}
    //                    sx={{position: 'absolute', zIndex: 999, left:20 ,top:20}}>
    //                 <Stack direction="row" spacing={1} alignItems="center" sx={{opacity: 0.72, typography: 'caption'}}>

    //                     <EEAvatar account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
    //                               sx={{mr: 0, width: 24, height: 24}}/>

    //                     <Typography>{author}</Typography>
    //                 </Stack>

    //                 <TextMaxLine variant="h3" sx={{width: '80%'}}>
    //                     {title}
    //                 </TextMaxLine>
    //                 <Typography
    //                     variant="body1"
    //                     sx={{
    //                         mb: 1,
    //                         mt: {xs: 1, sm: 0.5},
    //                         color: 'common.white',
    //                     }}
    //                 >
    //                     {createdAt && fDate(createdAt)}
    //                 </Typography>
    //             </Stack>

    //             <Image src={background} alt={title} ratio="6/4"/>
    //         </Box>

    //     </Stack>
    // );
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
