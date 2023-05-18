import React, { useState } from 'react';
import GoogleFullSignUp from './GoogleFullSignUp';
import GoogleLogin from './GoogleLogin';
import CreateWalletForm from './CreateWalletForm';

export const ACCOUNT_SHORT_FORM = 'ACCOUNT_SHORT_FORM';
export const WALLET_FORM = 'WALLET_FORM';
export const ACCOUNT_FULL_FORM = 'ACCOUNT_FULL_FORM';

export type GoogleFormData = {
  email: string;
  birthDate?: Date;
  phoneNumber?: string;
  gender?: string;
};

const GoogleFlow = () => {
  const [form, setForm] = useState(ACCOUNT_SHORT_FORM);
  const [data, setData] = useState({});
  console.log('data: ', data);
  return (
    <>
      {form === ACCOUNT_SHORT_FORM && <GoogleLogin setForm={setForm} setData={setData} />}
      {form === ACCOUNT_FULL_FORM && <GoogleFullSignUp setForm={setForm} />}
      {form === WALLET_FORM && <CreateWalletForm onClose={() => {}} />}
    </>
  );
};

export default GoogleFlow;
