import { Box, Stack, useTheme } from '@mui/material';
import React, { SetStateAction } from 'react';
import TicketSellForm from 'src/components/my-tickets/TicketSellForm';
import Badge from 'src/components/ticket/Badge';
import { CardInner } from 'src/components/ticket/CardInner';
import { CardWrapper } from 'src/components/ticket/CardWrapper';
import CompanyInfo from 'src/components/ticket/CompanyInfo';
import { TicketName } from 'src/components/ticket/TicketName';
import { MyTicketTypes } from 'src/@types/my/myTicket';

type MyTicketSellProps = {
  sellTicketInfo: MyTicketTypes;

  team: string;
  day: string;
  isForSale: boolean;
  setOpenSnackbar: SetStateAction<any>;
};
const MyTicketSell: React.FC<MyTicketSellProps> = ({
  sellTicketInfo,
  team,
  day,
  isForSale,
  setOpenSnackbar,
}) => {
  const theme = useTheme();
  console.log(sellTicketInfo);
  return (
    <Box sx={{ height: '100%', [theme.breakpoints.down('md')]: { pt: '480px', height: 'auto' } }}>
      <CardWrapper>
        <CardInner>
          <Stack flexDirection="row" justifyContent="space-between">
            <CompanyInfo
              account={'0x8B7B2b4F7A391b6f14A81221AE0920a9735B67Fc'}
              // image={`url(/assets/static/avatars/1.jpg)`}
              label={`by @${sellTicketInfo.mysteryboxInfo.featuredId}`}
            />
            {isForSale && <Badge label={'For sale'} />}
          </Stack>
          <TicketName>{sellTicketInfo.mysteryboxItem.name}</TicketName>
          <TicketSellForm
            sellTicketInfo={sellTicketInfo}
            day={day}
            team={team}
            isForSale={isForSale}
            setOpenSnackbar={setOpenSnackbar}
          />
        </CardInner>
      </CardWrapper>
    </Box>
  );
};

export default MyTicketSell;
