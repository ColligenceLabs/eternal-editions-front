import { styled } from '@mui/material';
import { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode;
}

const Label = styled('label')`
  display: block;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-right: 12px;

  /* When the radio button is checked, add a blue background */
  input:checked ~ .checkmark {
    background-color: #00ba03;
    border: 2px solid #00ba03;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: white;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  input:checked ~ .checkmark:after {
    display: block;
  }
`;

const Checkmark = styled('span')`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 17px;
  width: 16px;
  background: white;
  border-radius: 50%;
  border: 2px solid #d9d9d9;
`;

const Input = styled('input')`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

export default function Radio({ label, ...props }: Props) {
  return (
    <Label>
      <Input type="radio" {...props} />
      <Checkmark className="checkmark" />
      {label}
    </Label>
  );
}
