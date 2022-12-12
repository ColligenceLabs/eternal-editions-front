import React, { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// hooks
import { useResponsive } from '../../hooks';
// routes
// components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import PageHeader from '../../components/common/PageHeader';
import Masonry from '@mui/lab/Masonry';
import TicketPostItem from '../@eternaledtions/tickets/TicketPostItem';
import { TicketProps } from '../../@types/ticket/ticket';
import TICKET from '../../sample/ticket';
// styles
import 'swiper/swiper.min.css';
import 'swiper/css/pagination';
import TeamCard from '../@eternaledtions/main/TeamCard';
import { getTicketsService } from '../../services/services';
import { TicketInfoTypes } from '../../@types/ticket/ticketTypes';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {},
}));

const EventNowSection = styled('section')(({ theme }) => ({
  paddingTop: '32px',
  paddingBottom: '0',
  [theme.breakpoints.up('md')]: {
    paddingTop: '120px',
  },
}));

/* Swiper CSS Custom */
const CustomSwiperBox = styled('div')(({ theme }) => ({
  '.swiper': {
    paddingBottom: '30px',
  },
  '.swiper-pagination': {
    bottom: 0,
  },
  '.swiper-pagination .swiper-pagination-bullet': {
    opacity: 0.3,
    background: theme.palette.grey[0],
  },
  '.swiper-pagination .swiper-pagination-bullet-active': {
    opacity: 1,
    background: theme.palette.primary.main,
  },
}));

// ----------------------------------------------------------------------

export default function HomeNowEvent() {
  const tickets: TicketProps[] = TICKET.tickets;
  const isDesktop = useResponsive('up', 'md');
  const [ticketInfoList, setTicketInfoList] = useState<TicketInfoTypes[]>([]);

  const getTickets = async () => {
    const res = await getTicketsService(1, 6, '');
    console.log(res);
    if (res.status === 200) {
      setTicketInfoList(res.data.list);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <RootStyle>
      <EventNowSection>
        <Container maxWidth={false} sx={{ px: { xs: '12px', lg: '80px' } }}>
          <PageHeader title="NOW EVENTS" link="/tickets" />
          {isDesktop ? (
            <>
              {ticketInfoList && (
                <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>
                  {ticketInfoList.map((ticket, index) => (
                    <TicketPostItem key={index} ticket={ticket} />
                  ))}
                </Masonry>
              )}
            </>
          ) : (
            <CustomSwiperBox>
              <Swiper pagination={true} modules={[Pagination]} spaceBetween={30}>
                {ticketInfoList.map((ticket, index) => (
                  <SwiperSlide key={index}>
                    <TicketPostItem key={index} ticket={ticket} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </CustomSwiperBox>
          )}
        </Container>
      </EventNowSection>
    </RootStyle>
  );
}
