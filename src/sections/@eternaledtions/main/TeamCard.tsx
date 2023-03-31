import {styled, useTheme} from '@mui/material/styles';
import {Box, Typography} from "@mui/material";
import React from "react";

const TeamCard = styled('div')(({theme}) => ({
  maxWidth: '360px',
  margin: '0 auto',
  padding: '12px',
  borderRadius: '24px',
  backdropFilter: 'blur(50px)',
  background: 'rgba(0,0,0,.1)',
  [theme.breakpoints.up('md')]: {
    maxWidth: 'inherit',
    margin: 'inherit',
    padding: '24px',
  },
}));

const TeamCardHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '24px',
}));

const TeamCardHeaderInfo = styled('div')(({theme}) => ({
  color: theme.palette.grey[0],
  'h2': {
    marginBottom: '8px',
  }
}));

const TeamLogo = styled('img')(() => ({}));

const TeamProfile = styled('figure')(({theme}) => ({
  maxWidth: '150px',
  margin: '0 auto 34px auto',
  borderRadius: '50%',
  overflow: 'hidden',
  'img': {
    width: '100%',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '200px',
    margin: '0 auto 40px auto',
  }
}));

type Props = {
  team: {
    nickname: string;
    image: string;
    history?: string;
    name: string;
    job: string;
    intro?: string;
    isLogo?: boolean;
  }
}

export default function TeamCardItem({team}: Props) {
  const {nickname, image, history, name, job, intro, isLogo} = team;
  return (
    <TeamCard>
      <TeamCardHeader>
        <TeamCardHeaderInfo>
          <Typography variant="h2">{nickname}</Typography>
          <Typography variant="subtitle1" sx={{lineHeight: '18px', whiteSpace: 'pre-line'}}>
            {history}
          </Typography>
        </TeamCardHeaderInfo>
        {isLogo && (
          <TeamLogo src="/assets/img/ee-logo.svg"/>
        )}
      </TeamCardHeader>
      <Box>
        <TeamProfile>
          <img src={image}/>
        </TeamProfile>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle1">{job}</Typography>
        <Typography variant="subtitle2" sx={{lineHeight: '18px'}}>{intro}</Typography>
      </Box>
    </TeamCard>
  )
}
