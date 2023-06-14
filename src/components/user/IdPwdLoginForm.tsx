import { Box, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { SUCCESS } from 'src/config';
import { ChangeEvent, useState } from 'react';
import { eternalLogin } from 'src/services/services';
import { Base64 } from 'js-base64';
import Router from 'next/router';

type Props = {
  onClose: () => void;
};

export default function IdPwdSignUpForm({ onClose }: Props) {
  const [openIDPWD, setOpenIDPWD] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPWD, setUserPWD] = useState('');

  const handleChangeUserId = (event: ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleChangeUserPWD = (event: ChangeEvent<HTMLInputElement>) => {
    setUserPWD(event.target.value);
  };

  const onClickIDLogin = async () => {
    const res = await eternalLogin({ email: userId, password: userPWD });
    console.log(`ID : ${userId}`);
    console.log(`PWD : ${userPWD}`);
    console.log(res);
    if (res.data.status === SUCCESS) {
      console.log('로그인 성공');
      window.localStorage.setItem('loginBy', 'password');
      Router.push({
        pathname: '/register',
        query: { eternal: Base64.encode(userPWD) },
      });
    } else {
      alert('로그인에 실패했습니다.');
    }
    onClose();
  };

  return (
    <Stack spacing={2} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.7rem',
          }}
        >
          <TextField
            label="ID"
            variant="outlined"
            fullWidth
            size={'small'}
            inputProps={{ style: { color: '#999999' } }}
            value={userId}
            onChange={handleChangeUserId}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            size={'small'}
            inputProps={{ style: { color: '#999999' } }}
            value={userPWD}
            onChange={handleChangeUserPWD}
          />
        </Box>
        <Box>
          <LogInButton onClick={onClickIDLogin}>Login</LogInButton>
        </Box>
      </Box>

      <IDPWDButton onClick={() => setOpenIDPWD(false)}>뒤로</IDPWDButton>
    </Stack>
  );
}

const IDPWDButton = styled(Button)({
  width: '100% !important',
  height: '36px',
  fontSize: 12,
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#9360d1',
    borderColor: '#4460d1',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});

const LogInButton = styled(Button)({
  width: '100% !important',
  // height: '36px',
  height: '100%',
  fontSize: 12,
  padding: '30px',
  backgroundColor: '#f1f2f5',
  borderColor: '#f1f2f5',
  color: '#000000',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#9360d1',
    borderColor: '#4460d1',
    color: '#ffffff',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'background.paper',
    borderColor: 'background.paper',
    color: '#ffffff',
  },
});
