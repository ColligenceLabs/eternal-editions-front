import React from "react";
// @mui
import {styled} from '@mui/material/styles';
import {Container, Typography, Box} from '@mui/material';
import Masonry from "@mui/lab/Masonry";
// hooks
import {useResponsive} from "../../hooks";
// components
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from "swiper";
import PageHeader from "../../components/common/PageHeader";
import TeamCard from "../@eternaledtions/main/TeamCard";
// styles
import 'swiper/swiper.min.css';
import "swiper/css/pagination";

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {},
}));

const TeamSection = styled('section')(({theme}) => ({
  paddingBottom: '160px',
  [theme.breakpoints.up('md')]: {},
}));

/* Swiper CSS Custom */
const CustomSwiperBox = styled('div')(({theme}) => ({
  '.swiper': {
    paddingBottom: '30px',
  },
  '.swiper-pagination': {
    bottom: 0,
  },
  '.swiper-pagination .swiper-pagination-bullet': {
    opacity: .3,
    background: theme.palette.grey[0],
  },
  '.swiper-pagination .swiper-pagination-bullet-active': {
    opacity: 1,
    background: theme.palette.primary.main
  },
}));

/**
 * 임시 팀원 데이터
 */
const members = [
  {
    nickname: 'DAN',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    name: 'Dan Namgung',
    job: 'Block Chain Business Specialist',
    intro: 'Bachelor degree in Sociology, Economics, PKU Univ. Master degree in Economical Sociology, PKU Univ. Ph.D Candidate in Cultural Industries and Media Economics, Tsinghua Univ. China Head, d’strict Holdings VP, Sichuan Ruifu Media Vision C.O.O, Chainers C.E.O, JC Capital Korea Head of China, Better Group Holdings C.E.O, Salon de Bloc',
    isLogo: false,
  },
  {
    nickname: 'DAN',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    name: 'Dan Namgung',
    job: 'Block Chain Business Specialist',
    intro: 'Bachelor degree in Sociology, Economics, PKU Univ. Master degree in Economical Sociology, PKU Univ. Ph.D Candidate in Cultural Industries and Media Economics, Tsinghua Univ. China Head, d’strict Holdings VP, Sichuan Ruifu Media Vision C.O.O, Chainers C.E.O, JC Capital Korea Head of China, Better Group Holdings C.E.O, Salon de Bloc',
    isLogo: true,
  },
  {
    nickname: 'DAN',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    name: 'Dan Namgung',
    job: 'Block Chain Business Specialist',
    intro: 'Bachelor degree in Sociology, Economics, PKU Univ. Master degree in Economical Sociology, PKU Univ. Ph.D Candidate in Cultural Industries and Media Economics, Tsinghua Univ. China Head, d’strict Holdings VP, Sichuan Ruifu Media Vision C.O.O, Chainers C.E.O, JC Capital Korea Head of China, Better Group Holdings C.E.O, Salon de Bloc',
    isLogo: false,
  },
  {
    nickname: 'DAN',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    name: 'Dan Namgung',
    job: 'Block Chain Business Specialist',
    intro: 'Bachelor degree in Sociology, Economics, PKU Univ. Master degree in Economical Sociology, PKU Univ. Ph.D Candidate in Cultural Industries and Media Economics, Tsinghua Univ. China Head, d’strict Holdings VP, Sichuan Ruifu Media Vision C.O.O, Chainers C.E.O, JC Capital Korea Head of China, Better Group Holdings C.E.O, Salon de Bloc',
    isLogo: false,
  },
  {
    nickname: 'DAN',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    name: 'Dan Namgung',
    job: 'Block Chain Business Specialist',
    intro: 'Bachelor degree in Sociology, Economics, PKU Univ. Master degree in Economical Sociology, PKU Univ. Ph.D Candidate in Cultural Industries and Media Economics, Tsinghua Univ. China Head, d’strict Holdings VP, Sichuan Ruifu Media Vision C.O.O, Chainers C.E.O, JC Capital Korea Head of China, Better Group Holdings C.E.O, Salon de Bloc',
    isLogo: false,
  },
  {
    nickname: 'DAN',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    name: 'Dan Namgung',
    job: 'Block Chain Business Specialist',
    intro: 'Bachelor degree in Sociology, Economics, PKU Univ. Master degree in Economical Sociology, PKU Univ. Ph.D Candidate in Cultural Industries and Media Economics, Tsinghua Univ. China Head, d’strict Holdings VP, Sichuan Ruifu Media Vision C.O.O, Chainers C.E.O, JC Capital Korea Head of China, Better Group Holdings C.E.O, Salon de Bloc',
    isLogo: false,
  },
];

// ----------------------------------------------------------------------

export default function HomeTeam() {
  const isDesktop = useResponsive('up', 'md');

  return (
    <RootStyle>
      <TeamSection>
        <Container maxWidth={false} sx={{px: {xs: '12px', lg: '80px'}}}>
          <PageHeader title="TEAM" link='/tickets'/>
          {isDesktop ? (
          <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={1}>
            {members.map((team, index) => (
              <TeamCard key={index} team={team} />
            ))}
          </Masonry>
          ) : (
            <CustomSwiperBox>
              <Swiper pagination={true} modules={[Pagination]}>
                {members.map((team, index) => (
                <SwiperSlide key={index}>
                  <TeamCard team={team} />
                </SwiperSlide>
                ))}
              </Swiper>
            </CustomSwiperBox>
          )}
        </Container>
      </TeamSection>
    </RootStyle>
  );
}
