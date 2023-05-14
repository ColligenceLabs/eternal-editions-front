import { Divider, Stack, styled, useTheme } from '@mui/material';
import { Typography } from '@mui/material';
import palette from 'src/theme/palette';
import React from 'react';
import { Circle } from '@mui/icons-material';
import EEAvatar from '../EEAvatar';
import { getShotAddress } from 'src/utils/wallet';
import { truncate } from 'lodash';

type Props = {
  date: Date;
  title: string;
  status: Status;
};

type Status = 'ended' | 'minting' | 'upcoming';

const StatusText: Record<Status, string> = {
  ended: 'Ended',
  minting: 'Currently Minting',
  upcoming: 'Starting on {{date}}',
};

export default function ScheduleCard({}: Props) {
  const theme = useTheme();

  return (
    <Stack
      padding="16px"
      sx={{
        backgroundColor: theme.palette.common.white,
        borderRadius: 3,
        color: theme.palette.common.black,
      }}
    >
      <Stack direction="row" gap={2}>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: 2,
            width: '48px',
            height: '48px',
          }}
        >
          <Month>Feb</Month>
          <BoldText>12</BoldText>
        </Stack>
        <Stack>
          <BoldText>Whitelist Mint</BoldText>
          <Stack direction="row" alignItems="center">
            <SmallText sx={{ color: theme.palette.common.black }}>{StatusText['ended']}</SmallText>
            <Circle
              sx={{
                color: palette.dark.black.lighter,
                fontSize: '3px',
                marginLeft: '21px',
                marginRight: '6px',
              }}
            />
            <SmallText sx={{ color: '#222222' }}>4:00pm</SmallText>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ mt: '12px', mb: '16px' }} />

      <Stack direction="row" alignItems="center" gap={1}>
        <Stack direction="row">
          <Avatar
            // account={account}
            // image={image}
            nickname={'by @iloveseoul'}
          />
          <Avatar
            // account={account}
            // image={image}
            nickname={'by @iloveseoul'}
            sx={{}}
          />
        </Stack>
        <SmallText>
          {truncate('Strange Parades, Superchief NFT x funticon', {
            length: 41,
          })}
        </SmallText>
      </Stack>
    </Stack>
  );
}

const Month = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  lineHeight: 17 / 12,
  textTransform: 'uppercase',
}));

const BoldText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: 24 / 16,
}));

const SmallText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: 16 / 12,
}));

const Avatar = styled(EEAvatar)(({ theme }) => ({
  mr: 0,
  width: 24,
  height: 24,
  border: '2px solid #FFFFFF',
  '&+&': {
    marginLeft: '-8px',
  },
}));
