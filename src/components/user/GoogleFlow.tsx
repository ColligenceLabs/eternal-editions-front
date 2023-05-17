import React, { useState } from 'react';
import GoogleFullSignUp from './GoogleFullSignUp';
import GoogleLogin from './GoogleLogin';
import CreateWalletForm from './CreateWalletForm';

export const ACCOUNT_SHORT_FORM = 'ACCOUNT_SHORT_FORM';
export const WALLET_FORM = 'WALLET_FORM';
export const ACCOUNT_FULL_FORM = 'ACCOUNT_FULL_FORM';

const GoogleFlow = () => {
  const [form, setForm] = useState(ACCOUNT_FULL_FORM);
  return (
    <>
      {form === ACCOUNT_SHORT_FORM && <GoogleLogin />}
      {form === ACCOUNT_FULL_FORM && <GoogleFullSignUp setForm={setForm} />}
      {form === WALLET_FORM && <CreateWalletForm onClose={() => {}} />}
    </>
  );
};

export default GoogleFlow;
