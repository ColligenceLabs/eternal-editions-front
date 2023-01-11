import { ReactElement, useEffect, useState } from 'react';
import { getSession } from '../src/services/services';
import Layout from '../src/layouts';
import SupportPage from './support';
import { Page } from '../src/components';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';

// TODO : dkeys WASM Go Initialize...
import '../src/abc/sandbox/index';
import { controllers, accountRestApi, services, nonceTracker } from '../src/abc/background/init';
import { AbcLoginResult } from '../src/abc/main/abc/interface';

export default function Register() {
  const { abcController } = controllers;

  const [isCheck, setIsCheck] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
  });
  const [isCheckAll, setIsCheckAll] = useState(isCheck.check1 && isCheck.check2 && isCheck.check3);
  const [idToken, setIdToken] = useState('');
  const [service, setService] = useState('');

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
    console.log('Register');
    const abcAuth: AbcLoginResult = await abcController.snsLogin(idToken, service);
    console.log('==========> ', abcAuth);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await getSession();
      console.log('session res::::', res);
      if (res.data?.providerAuthInfo) {
        console.log('=====> ', res.data?.providerAuthInfo);
        const id_token = res.data?.providerAuthInfo?.provider_token;
        const service = res.data?.providerAuthInfo?.provider;
        console.log(service, id_token);
        setIdToken(id_token);
        setService(service);
      }
    };
    fetchSession();
  }, []);

  return (
    <Page title="Register">
      <Box>
        <Box>Register</Box>
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
    </Page>
  );
}

SupportPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
