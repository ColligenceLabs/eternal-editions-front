import { styled } from '@mui/material/styles';

type Props = {
  quantity: number;
  setQuantity: (value: number) => void;
};

const size = '40px';

const quantityButtonStyle = {
  cursor: 'pointer',
  border: 'none',
  height: size,
  width: size,
  backgroundColor: '#F5F5F5',
  fontSize: '20px',
};

const HideInnerOuterSpinButton = styled('input')(() => ({
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
  },
  border: 'none;',
  outline: 'none',
  textAlign: 'center',
  backgroundColor: '#F5F5F5',
  fontWeight: 'bold',
  height: size,
  width: `calc(100% - ${size} * 2)`,
}));

const QuantityControl = ({ quantity, setQuantity }: Props) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
    <button
      style={{ ...quantityButtonStyle, borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%' }}
      onClick={() => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
      }}
    >
      -
    </button>
    <HideInnerOuterSpinButton
      type="number"
      value={quantity}
      onChange={(e) => {
        if (+e.target.value <= 1) {
          setQuantity(1);
        } else {
          setQuantity(+e.target.value);
        }
      }}
    />
    <button
      style={{
        ...quantityButtonStyle,
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
      }}
      onClick={() => setQuantity(quantity + 1)}
    >
      +
    </button>
  </div>
);
export default QuantityControl;
