import { InputSelectIcon } from './CustomIcons';

// ----------------------------------------------------------------------

export default function Select() {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: InputSelectIcon,
      },
    },
    styleOverrides: {
      root: {
        background: ['white']
      },

    }
  };
}
