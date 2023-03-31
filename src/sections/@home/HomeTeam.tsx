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
    image: '/assets/img/dan.png',
    name: 'Dan Namgung',
    job: 'Business Development',
    intro: '+6 Years of CT(Contents Technology) Business, ' +
        '+4 Years of Block Chain Business, ' +
        'Bachelor degree in Sociology, Economics, PKU Univ., ' +
        'Master degree in Economical Sociology, PKU Univ., ' +
        'Ph.D Candidate in Cultural Industries and Media, ' +
        'Economics, Tsinghua Univ., ' +
        'China Head, d’strict Holdings, ' +
        'VP, Sichuan Ruifu Media Vision, ' +
        'C.O.O, Chainers, ' +
        'C.E.O, JC Capital Korea, ' +
        'Founder, Salon de Bloc',
    isLogo: false,
  },
  {
    nickname: 'Joon Young Lim',
    history: `Eternal Editions\nBlock Chain Business\nDevelopment`,
    image: '/assets/img/dan.png',
    name: 'Joon Young Lim',
    job: 'Business Development',
    intro: 'C.E.O of Brand Architects, ' +
        'Branding, Global Content Business, ' +
        'Ex) Samsung Electronics, VD division. , ' +
        'Master degree in Business Management, KAIST , ' +
        '2010-2014 Samsung TV global launching campaign, PM , ' +
        'Theme Parks (Jurassic World Seoul, Snoop Garden Jeju, Kakao Busan), ' +
        'Samsung global content partnership with NBC Universal, , ' +
        '     Fox, Paramount, Netflix, Warner Brothers, Paramount, PM , ' +
        '2019 Licensee of the year of NBC Universal, ' +
        '2014, 2010 Samsung Marketing Achievement Award  , ' +
        '2012 Telly Award of AEG Network Live, ' +
        '2007 New York Festival Awards, Special Award',
    isLogo: true,
  },
  {
    nickname: 'Marvin Lee',
    history: `Eternal Editions\nBranding, Art & Design`,
    image: '/assets/img/mavin.png',
    name: 'Marvin Lee',
    job: 'Branding, Art & Design',
    intro: 'Professor of Visual Design, Hongik University, ' +
        'Ex) Professor of Visual Design, Ewha Womans University, , ' +
        'Seoul National University, ' +
        'Master of Visual Design, Seoul National University, ' +
        'Bachelor in UCLA Visual Communication Design, ' +
        'NFT Platform Edenloop Brand Consulting, ' +
        'Branding, visual design, media, and art planning professionals, ' +
        'Samsung Electronics and many other global brand design , ' +
        'consulting companies',
    isLogo: false,
  },
  {
    nickname: 'Icksoo Han',
    history: `Eternal Editions\nProject Management`,
    image: '/assets/img/iksoo.png',
    name: 'Icksoo Han',
    job: 'Project Management',
    intro: 'Cultural contents planner, producer, ' +
        '+22 Years of Experience in Live Event Business, ' +
        'Founder of Waterbomb, 5tardium, Rainbow Camping , ' +
        'Music Festival, The Final Countdown, Seoul Fashion , ' +
        'Festival, Global Gathering Korea, ' +
        'Contents Developer of Pentaport Rock Festival, ' +
        'Show DC Hall Bangkok, Modo Beijing',
    isLogo: false,
  },
  {
    nickname: 'Chang',
    history: `Eternal Editions\nTechnology`,
    image: '/assets/img/chang.png',
    name: 'CL Chang',
    job: 'Technology',
    intro: 'Mobile App. / Web App. / DApp. Developer, ' +
        '2016-2022 Web/Native App Development, ' +
        'LG Electronics Groro mobile app/web development, ' +
        '(Awarded the 2021 iAward Grand Prize), ' +
        'Daehan Flour Vitis Mall development, ' +
        'Samsung Electronics Galaxy S20 promotion , ' +
        'CJ Healthcare’s own mall development, ' +
        'Adidas original app development, ' +
        'Queen\'s Smile web/kiosk development',
    isLogo: false,
  },
  {
    nickname: 'Woosung Lim',
    history: `Eternal Editions\nCommunity Development`,
    image: '/assets/img/woosung.png',
    name: 'Woosung Lim',
    job: 'Community Development',
    intro: '+13 Years of Experience in Live Event Business, ' +
        'BTL Event Manager / MKT Manager, ' +
        'Project Manager and Director of Waterbomb, ' +
        '5tardium, Rainbow Camping Music Festival, ' +
        'The Final Countdown, Seoul Fashion Festival, ' +
        'Festival Brand IP Directing, Branding, BTL Event Professionals, ' +
        'Festival Community Manager / CS Experiences',
    isLogo: false,
  },
  {
    nickname: 'Kendrick Na',
    history: `Eternal Editions\nMarketing`,
    image: '/assets/img/na.png',
    name: 'Kendrick Na',
    job: 'Marketing',
    intro: 'Indigochild CEO, ' +
        'Coinreaders Advisor, ' +
        'MetaBeat, Mamamoo NFT Advisor, ' +
        '+7 Years of Blockchain Business, ' +
        '400+ Blockchain/NFT/Web3 Company Marketing, Consulting, ' +
        '300+ Blockchain/NFT/Web3 Community Management, ' +
        'Dongguk University Fintech Blockchain Convergence Industry Supreme Leader Course Completion',
    isLogo: false,
  },
  {
    nickname: 'Ronny Jung',
    history: `Eternal Editions\nCommunity Ambassador`,
    image: '/assets/img/ronny.png',
    name: 'Ronny Jung',
    job: 'Community Ambassador',
    intro: 'Indigochild CMO, ' +
        'Coinreaders Advisor, ' +
        'MetaBeat Advisor, ' +
        'KAIST DFMP 1st BDA(Blockchain & Digital Assets) Course Completion, ' +
        '+6 Years of Blockchain Business, ' +
        '2020 Project Manager, Crypto VC, ' +
        '2019 Head of Marketing, JC Capital Korea, ' +
        '2018 Senior Meetup Manager, Chainers, ' +
        'Master\'s degree in Sociology at PKU Univ.',
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
