import { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Modal, Typography } from '@mui/material';
import { PRIMARY_WHITE, SECONDARY_BLUE_1, SECONDARY_GREY_2 } from '@styles/colors';

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  children: ReactElement;
  size?: 'large' | 'small';
  title?: string;
}

const CustomModal = (props: CustomModalProps): JSX.Element => {
  const { open, handleClose, children, size, title } = props;
  const calculateSizeStyles = () => {
    if (size === 'large') {
      return {
        width: '80%',
        minHeight: '31%'
      };
    }

    if (size === 'small') {
      return {
        width: 500
      };
    }

    return {
      width: '50%',
      minHeight: '25%'
    };
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        '&:focus': {
          outline: 'none',
          border: `unset`
        }
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: PRIMARY_WHITE,
          border: `1px solid ${SECONDARY_GREY_2}`,
          borderRadius: '5px',
          margin: 'auto',
          ...calculateSizeStyles(),
          width: { xs: '95%', sm: calculateSizeStyles().width },
          maxHeight: '90vh',
          overflow: 'hidden',
          // Ensure the Box is focusable
          tabindex: -1,
          '&:focus': {
            outline: 'none',
            borderColor: SECONDARY_BLUE_1 // Change the border color on focus
          }
        }}>
        <CloseIcon
          onClick={handleClose}
          sx={{
            width: '30px',
            height: '30px',
            position: 'absolute',
            right: '10px',
            top: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-out 0s',
            '&:hover': {
              transform: 'scale(1.2)'
            },
            zIndex: 1000
          }}
        />
        <Box
          sx={{
            padding: '10px 20px 10px 20px'
          }}>
          {title && (
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
          )}
          <Box sx={{ flex: 1, overflow: 'auto' }}>{children}</Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
