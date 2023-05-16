import { Stack, Typography, Divider } from '@mui/material';
import React, { useState } from 'react';
import { TicketInfoTypes } from 'src/@types/ticket/ticketTypes';
import RoundedButton from 'src/components/common/RoundedButton';
import { fDate } from 'src/utils/formatTime';
import QuantityControl from './QuantityControl';
import Radio from 'src/components/common/Radio';
import palette from 'src/theme/palette';

type Props = {
  ticket: TicketInfoTypes;
  setIsTicketItemModalOpen: (value: boolean) => void;
};

const ticketLabel = {
  day: 'day',
  team: 'team',
  price: 'price',
  limit: 'limit',
  total: 'total',
  qty: 'qty',
  totalPrice: 'total price',
  transaction: 'transaction',
  paymentDate: 'payment date',
  location: 'location',
};

const methodType = {
  edcp: 'edcp',
  usdc: 'usdc',
};

const TicketItemModal = ({ ticket, setIsTicketItemModalOpen }: Props) => {
  const { createdAt, mysteryboxItems, title } = ticket;
  const [quantity, setQuantity] = useState<number>(1);
  const [method, setMethod] = useState<string>(methodType.edcp);
  const [isCompleteModal, setIsCompleteModal] = useState<boolean>(false);

  const onSubmit = () => {
    setIsCompleteModal(true);
  };

  const onMyItem = () => {};
  const onComplete = () => {
    setIsTicketItemModalOpen(false);
  };

  const ticketinfo = (label: string, data: any) => (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: '5px',
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: '12px',
            md: '14px',
          },
          fontWeight: '400',
          lineHeight: '16.52px',
          textTransform: 'uppercase',
          color: '#999999',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: {
            xs: '12px',
            md: '14px',
          },
          fontWeight: '400',
          lineHeight: '16.52px',
          color: 'red',
          wordBreak: 'break-all',
          width: '50%',
          textAlign: 'right',
        }}
      >
        {data}
      </Typography>
    </Stack>
  );

  return (
    <>
      <Stack gap={3}>
        <Typography
          sx={{
            fontSize: { xs: '24px', md: '32px' },
            fontWeight: 'bold',
            lineHeight: { xs: '28px', md: '36px' },
          }}
        >
          {isCompleteModal ? 'Complete' : 'Mint'}
        </Typography>
        <Stack>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: { xs: '24px', md: '28px' },
              marginBottom: '4px',
            }}
          >
            {title.en}
          </Typography>
          {createdAt && (
            <Typography
              sx={{
                fontSize: { xs: '12px', md: '16px' },
                lineHeight: { xs: '16px', md: '20px' },
                fontWeight: '400',
              }}
            >
              {fDate(createdAt, 'MMMM dd')} -{' '}
              <span
                style={{
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: 'red',
                }}
              >
                31, 2022
              </span>
            </Typography>
          )}
          {mysteryboxItems && (
            <Typography
              sx={{
                fontSize: { xs: '12px', md: '16px' },
                lineHeight: { xs: '16px', md: '20px' },
                fontWeight: '400',
              }}
            >
              {mysteryboxItems[0].properties &&
                mysteryboxItems[0].properties[0].type.toLowerCase() === ticketLabel.location &&
                mysteryboxItems[0].properties[0].name}
            </Typography>
          )}
        </Stack>
        <Stack>
          <Divider sx={{ marginBottom: '12px' }} />
          <Stack gap={0.5}>
            {ticketinfo(ticketLabel.day, 'Friday (November 11,2023)')}
            {ticketinfo(ticketLabel.team, 'Team Yellow')}
            {isCompleteModal ? (
              <>
                {ticketinfo(ticketLabel.qty, quantity)}
                {ticketinfo(
                  ticketLabel.totalPrice,
                  `${1000 * quantity} USDC (~$${1000 * quantity})`
                )}
                {ticketinfo(ticketLabel.transaction, '0x1234as5d4as8dsdasdas23da5dasdasdas25123')}
                {ticketinfo(ticketLabel.paymentDate, '2022.10.11 13:00:25')}
              </>
            ) : (
              <>
                {ticketinfo(ticketLabel.price, '1000 EDCP (~ $1000)')}
                {ticketinfo(ticketLabel.limit, '5 per wallet')}
              </>
            )}
          </Stack>
        </Stack>
        {!isCompleteModal && <QuantityControl quantity={quantity} setQuantity={setQuantity} />}
        {!isCompleteModal && (
          <Stack gap={3}>
            <Typography sx={{ color: '#999999', fontSize: '12px' }}>PAYMENT METHOD</Typography>
            <Radio
              checked={method === methodType.edcp}
              value="edcp"
              label={
                <Typography
                  fontWeight={700}
                  fontSize={14}
                  lineHeight="12px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {methodType.edcp.toUpperCase()}
                </Typography>
              }
              onClick={() => setMethod('edcp')}
            />
            <Radio
              checked={method === methodType.usdc}
              value="usdc"
              label={
                <Typography
                  fontWeight={700}
                  fontSize={14}
                  lineHeight="12px"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  {methodType.usdc.toUpperCase()}
                </Typography>
              }
              onClick={() => setMethod('usdc')}
            />
          </Stack>
        )}
        {!isCompleteModal && <Divider />}
      </Stack>
      {isCompleteModal ? (
        <Stack gap={0.25} sx={{ marginTop: '12px' }}>
          <RoundedButton
            onClick={onMyItem}
            variant="inactive"
            sx={{ color: palette.dark.common.black }}
          >
            MY ITEM
          </RoundedButton>
          <RoundedButton onClick={onComplete}>CONFIRM</RoundedButton>
        </Stack>
      ) : (
        <Stack gap={3} sx={{ marginTop: '12px' }}>
          {ticketinfo(ticketLabel.total, `${1000 * quantity} USDC (~$${1000 * quantity})`)}
          <RoundedButton onClick={onSubmit}>COMPLETE PURCHASE</RoundedButton>
        </Stack>
      )}
    </>
  );
};

export default TicketItemModal;
