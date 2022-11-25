// @mui
import {Avatar, AvatarProps, Box} from '@mui/material';
// utils
import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

// ----------------------------------------------------------------------

interface EEAvatarProps extends AvatarProps {
    image?: string;
    account?: string;
    nickname?: string;
}

// ----------------------------------------------------------------------
export default function EEAvatar({
                                     image,
                                     account,
                                     nickname,
                                     ...other
                                 }: EEAvatarProps) {

    const [defaultImage, setDefaultImage] = useState(null);
    // const avatarRef = useRef();

    // useEffect(() => {
    //     const element = avatarRef.current;
    //     if (element && account) {
    //         const icon = jazzicon(64, parseInt(account.slice(2, 10), 16));
    //         if (element['firstChild'] !== undefined) {
    //             // @ts-ignore
    //             element.removeChild(element['firstChild']);
    //         }
    //         // @ts-ignore
    //         element.appendChild(icon);
    //     }
    // }, [account, avatarRef]);

    if (!image && account) {
        return <Avatar

            color={'default'}
            {...other}>
            <Jazzicon diameter={24} seed={jsNumberForAddress(account)} />
        </Avatar>;
    }

    return (
        <Avatar
            src={image}
            alt={nickname}
            color={'default'}
            {...other}
        >
            {image ? image : nickname && nickname.charAt(0).toUpperCase()}
        </Avatar>
    );
}
