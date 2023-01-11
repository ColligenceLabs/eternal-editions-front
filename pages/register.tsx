import { ReactElement, useEffect, useState } from 'react';
import { getSession, userRegister } from '../src/services/services';
import Layout from '../src/layouts';
import SupportPage from './support';
import { Page } from '../src/components';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from '../src/config';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));
export default function Register(effect: React.EffectCallback, deps?: React.DependencyList) {
  const [isCheck, setIsCheck] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
  });
  const [isCheckAll, setIsCheckAll] = useState(isCheck.check1 && isCheck.check2 && isCheck.check3);
  const handleCheckItem = (check: 'check1' | 'check2' | 'check3' | 'check4') => {
    const newCheck = { ...isCheck, [check]: !isCheck[check] };
    setIsCheck(newCheck);
  };
  // const isCheckAll = isCheck.check1 && isCheck.check2 && isCheck.check3;
  const handleCheckAll = () => {
    setIsCheckAll((cur) => !cur);
    setIsCheck({
      check1: !isCheckAll,
      check2: !isCheckAll,
      check3: !isCheckAll,
      check4: !isCheckAll,
    });
  };

  const handleClickRegister = async () => {
    const res = await userRegister();
    console.log(res);
    if (res.status === 200) {
      // 성공. 리다이렉트..
      alert('가입이 완료되었습니다. 다시 로그인 해주세요.');
      location.replace('/');
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();
      console.log('session res::::', res);
      if (res.data?.providerAuthInfo) {
        const id_token = JSON.parse(res.data?.providerAuthInfo?.provider_token);
        console.log(id_token);
      }
    };
    fetchSession();
  }, []);

  return (
    <Page title="Register">
      <RootStyle>
        <Box>
          <Box>
            <h1>Register</h1>
          </Box>
          <Box>
            <FormControlLabel
              control={<Checkbox checked={isCheckAll} onClick={handleCheckAll} />}
              label="전체동의"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check1} onClick={() => handleCheckItem('check1')} />
              }
              label="약관1"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check2} onClick={() => handleCheckItem('check2')} />
              }
              label="약관2"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check3} onClick={() => handleCheckItem('check3')} />
              }
              label="약관3"
            />
            <FormControlLabel
              control={
                <Checkbox checked={isCheck.check4} onClick={() => handleCheckItem('check4')} />
              }
              label="약관4"
            />
          </Box>
          <Box>
            <Button
              onClick={handleClickRegister}
              disabled={!isCheck.check1 || !isCheck.check2 || !isCheck.check3 || !isCheck.check4}
              variant={'outlined'}
            >
              가입
            </Button>
          </Box>
        </Box>
      </RootStyle>
    </Page>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
