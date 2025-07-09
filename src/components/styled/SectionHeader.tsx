import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { PRIMARY_BLUE } from '@styles/colors';

export const SectionHeader = styled(Box)(() => ({
  borderBottom: `2px solid ${PRIMARY_BLUE}`,
  padding: '10px 5px',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginBottom: '1rem',
  color: PRIMARY_BLUE
}));
