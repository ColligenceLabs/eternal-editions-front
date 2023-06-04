import { InputAdornment, Stack, Typography, buttonBaseClasses, styled } from '@mui/material';
import React from 'react';
import ModalCustom, { ModalCustomProps } from 'src/components/common/ModalCustom';
import { Label, StyledInput, Value } from '../../StyledComponents';
import RoundedButton from 'src/components/common/RoundedButton';
import palette from 'src/theme/palette';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { set } from 'lodash';

interface Props extends Omit<ModalCustomProps, 'children'> {
  onSubmitSuccess?: () => void;
}

const FormSchema = Yup.object().shape({
  verificationCode: Yup.string().required('Email is required').length(6),
});

type FormValuesProps = {
  verificationCode: string;
};

function TransferContent({ onSubmitSuccess, ...props }: Props) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const onPaste = async () => {
    const text = await navigator.clipboard.readText();
    setValue('verificationCode', text);
  };

  const onSubmit = (data: FormValuesProps) => {
    console.log(data);

    if (typeof onSubmitSuccess === 'function') {
      onSubmitSuccess();
    }
  };

  return (
    <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h3">Transfer</Typography>

      <Stack gap={1}>
        <StyledLabel>2FA(Google OTP) CODE</StyledLabel>
        <Controller
          name="verificationCode"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <StyledInput
              {...field}
              sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.24)' }}
              placeholder="Please enter verification code."
              size={'small'}
              type="string"
              inputProps={{
                style: {
                  color: palette.dark.common.black,
                  fontSize: 14,
                  lineHeight: 20 / 14,
                },
              }}
              fullWidth
              error={Boolean(error)}
              endAdornment={
                <InputAdornment position="end">
                  <RoundedButton
                    variant="inactive"
                    sx={{
                      padding: '10px 16px',
                      marginBottom: '8px',
                      color: isValid ? palette.dark.common.black : palette.dark.black.lighter,
                      [`&.${buttonBaseClasses.root}`]: {
                        fontSize: 12,
                        lineHeight: 13 / 12,
                      },
                    }}
                    onClick={onPaste}
                  >
                    paste
                  </RoundedButton>
                </InputAdornment>
              }
            />
          )}
        />
      </Stack>

      <RoundedButton type="submit" disabled={!isValid}>
        Send
      </RoundedButton>
    </Stack>
  );
}

export default TransferContent;

// ----------------------------------------------------------------------

const StyledLabel = styled(Label)(() => ({
  color: palette.dark.black.lighter,
}));
