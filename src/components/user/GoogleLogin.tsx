import * as Yup from 'yup';
import {
  Stack,
  Typography,
  TextField,
  inputBaseClasses,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import { Label, Section } from '../my-tickets/StyledComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import palette from 'src/theme/palette';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RoundedButton from '../common/RoundedButton';
import { ACCOUNT_FULL_FORM, GoogleAccountData } from './GoogleFlow';
import CheckboxFillIcon from 'src/assets/icons/checkboxFill';
import CheckboxIcon from 'src/assets/icons/checkbox';
import CheckboxIndeterminateFillIcon from 'src/assets/icons/checkboxIndeterminateFill';
import CheckIcon from 'src/assets/icons/check';
import CheckFillIcon from 'src/assets/icons/checkFill';

type FormValuesProps = {
  email: string;
  birthDate: Date;
  phoneNumber: string;
  gender: string;
  agree: boolean;
};

const useStyles = makeStyles(() => ({
  menuPaper: {
    backgroundColor: 'white',
  },
}));

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FormSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('That is not an email'),
  birthDate: Yup.date().required('Birth date is required').typeError('Invalid date format'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
  agree: Yup.boolean().oneOf([true], 'Agree to all is required'),
});

type Props = {
  setData: React.Dispatch<React.SetStateAction<Partial<GoogleAccountData>>>;
  setForm: React.Dispatch<React.SetStateAction<string>>;
};

const terms = [
  { title: '이용약관을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '개인정보처리방침을 모두 확인하였으며, 이에 동의합니다.', isRequired: true },
  { title: '프로모션 관련 SMS, E-mail 수신에 동의합니다.', isRequired: false },
];
const GoogleLogin = ({ setForm, setData }: Props) => {
  const classes = useStyles();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues: {
      email: '',
      birthDate: new Date(),
      phoneNumber: '',
      gender: 'male',
      agree: false,
    },
  });

  const onSubmit = ({ email, birthDate, phoneNumber, gender }: FormValuesProps) => {
    setForm(ACCOUNT_FULL_FORM);
    setData({ email: email, birthDate: birthDate, phoneNumber: phoneNumber, gender: gender });
  };

  return (
    <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          fontSize: { xs: '16px', md: '24px' },
          fontWeight: 'bold',
          lineHeight: { xs: '24px', md: '28px' },
        }}
      >
        Google Account
      </Typography>

      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            E-MAIL
          </Label>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                {...field}
                variant="standard"
                size={'small'}
                type="email"
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
        </Section>
      </Stack>
      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            BIRTHDATE
          </Label>

          <Controller
            name="birthDate"
            control={control}
            render={({ field: { ref, onBlur, name, ...restField }, fieldState: { error } }) => (
              <DatePicker
                {...restField}
                inputRef={ref}
                maxDate={new Date()}
                inputFormat="dd/MM/yyyy"
                renderInput={(inputProps) => (
                  <StyledTextField
                    placeholder="00/00/0000"
                    variant="standard"
                    {...inputProps}
                    onBlur={onBlur}
                    name={name}
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />
        </Section>
      </Stack>
      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            PHONE NUMBER
          </Label>

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                {...field}
                variant="standard"
                size={'small'}
                type="string"
                inputProps={{
                  style: { color: palette.dark.common.black, fontSize: 14, lineHeight: 20 / 14 },
                }}
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
        </Section>
      </Stack>
      <Stack gap={1.5}>
        <Section>
          <Label as="label" sx={{ color: palette.dark.black.lighter }}>
            GENDER
          </Label>

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                variant="standard"
                sx={{ color: '#000' }}
                MenuProps={{
                  classes: {
                    paper: classes.menuPaper,
                  },
                }}
              >
                <StyledMenuItem value={'male'}>Male</StyledMenuItem>
                <StyledMenuItem value={'female'}>Female</StyledMenuItem>
              </Select>
            )}
          />
        </Section>
      </Stack>
      <Section>
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxFillIcon />}
                  indeterminateIcon={<CheckboxIndeterminateFillIcon />}
                />
              }
              label="모두 동의합니다."
              {...field}
            />
          )}
        />

        {terms.map(({ title, isRequired }, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={watch('agree')}
                sx={{ padding: 0, px: '8px' }}
                icon={<CheckIcon />}
                checkedIcon={<CheckFillIcon />}
                indeterminateIcon={<CheckboxIndeterminateFillIcon />}
              />
            }
            label={
              <span>
                {isRequired && <span style={{ color: 'red' }}>* </span>}
                {title}
              </span>
            }
          />
        ))}
      </Section>
      <RoundedButton type="submit" disabled={!isValid}>
        Continue
      </RoundedButton>
    </Stack>
  );
};

export default GoogleLogin;

export const StyledTextField = styled(TextField)(({ theme }) => ({
  [`.${inputBaseClasses.input}::placeholder`]: {
    color: '#BBBBBB',
  },
  '& input': {
    color: theme.palette.common.black,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({}) => ({
  backgroundColor: 'white',
  color: 'black',
  borderRadius: '0px',
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    background: '#303030',
  },
  '&.MuiMenu-list': {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
}));
