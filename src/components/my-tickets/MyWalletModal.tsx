import React from 'react';
import ModalCustom, { ModalCustomProps } from '../common/ModalCustom';
import { Stack, Typography, useTheme } from '@mui/material';
import { SectionText } from 'pages/my/account';
import Image from '../Image';
import palette from 'src/theme/palette';
import { Box } from '@mui/material';
import CopyButton from '../common/CopyButton';

interface Props extends Omit<ModalCustomProps, 'children'> {
  walletAddress: string;
  iconSrc?: string;
}

function MyWalletModal({ walletAddress, iconSrc, ...props }: Props) {
  const theme = useTheme();

  return (
    <ModalCustom
      {...props}
      sx={{ [theme.breakpoints.down('md')]: { mx: 2 } }}
      containerStyles={{ borderRadius: '40px' }}
    >
      <Stack gap={3}>
        <Typography variant="h3">My WALLET</Typography>

        <SectionText>
          To receive assets in my wallet, please send them to the address below.
        </SectionText>

        <Stack gap={3} px="12px" py="24px" sx={{ background: '#F5F5F5', borderRadius: '16px' }}>
          <Stack flexDirection="row" justifyContent="space-between">
            <Box sx={{ width: '32px', height: '32px' }}>
              <Image
                width={32}
                height={32}
                alt="currency-icon"
                src={iconSrc || '/assets/icons/matic-token-icon.svg'}
              />
            </Box>
            <CopyButton content={walletAddress} />
          </Stack>
          <Typography variant="h4" sx={{ wordBreak: 'break-all' }}>
            {walletAddress}
          </Typography>
        </Stack>

        <Stack gap={1}>
          <SectionText>
            Eternal Editions Wallet supports Polygon. It does not support multi-token standards such
            as KIP-37 or ERC-1155
          </SectionText>
          <Typography
            sx={{
              fontSize: '12px',
              lineHeight: 20 / 12,
              color: palette.dark.black.lighter,
              wordBreak: 'break-word',
            }}
          >
            In case of depositing unsupported assets, the company will not be held responsible
            unless there is intentional or negligent conduct on the company's part.
          </Typography>
        </Stack>
      </Stack>
    </ModalCustom>
  );
}

export default MyWalletModal;
