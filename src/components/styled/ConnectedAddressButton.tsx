import { alpha, styled } from '@mui/material/styles';

export const ConnectedAddressButton = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}));

export const ConnectedAddressIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

export const StyledAddressButton = styled('button')(({ theme }) => ({
  color: 'inherit',
  backgroundColor: 'transparent',
  letterSpacing: '0.05em',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  fontSize: '0.9rem',
  padding: '10px 10px 10px 0',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  textAlign: 'left',
  transition: theme.transitions.create('width'),
  '&:focus': {
    outline: 'none'
  }
}));
