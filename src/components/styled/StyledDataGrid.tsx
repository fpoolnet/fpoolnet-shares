import { alpha, styled } from '@mui/system';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  PRIMARY_BLUE,
  PRIMARY_WHITE,
  SECONDARY_BLUE_1,
  SECONDARY_GREY_2,
  SECONDARY_RED_1
} from '@styles/colors';

const getAdditionalRowStyles = () => {
  return {
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: SECONDARY_GREY_2,
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(SECONDARY_BLUE_1, 0.2),
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      },
      '&.Mui-selected': {
        backgroundColor: alpha(PRIMARY_BLUE, 0.1),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(PRIMARY_BLUE, 0.2),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(PRIMARY_BLUE, 0.2)
          }
        }
      }
    },
    [`& .${gridClasses.row}.odd`]: {
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(PRIMARY_BLUE, 0.2),
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      },
      '&.Mui-selected': {
        backgroundColor: alpha(PRIMARY_BLUE, 0.1),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(PRIMARY_BLUE, 0.2),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(PRIMARY_BLUE, 0.2)
          }
        }
      }
    },
    [`& .${gridClasses.row}.disabled`]: {
      backgroundColor: alpha(SECONDARY_RED_1, 1),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(SECONDARY_RED_1, 1),
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      },
      '&.Mui-selected': {
        backgroundColor: alpha(SECONDARY_RED_1, 1),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(SECONDARY_RED_1, 1),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(SECONDARY_RED_1, 1)
          }
        }
      }
    }
  };
};

const StyledDataGrid = styled(DataGrid)({
  border: 0,
  backgroundColor: PRIMARY_WHITE,
  '& .text-blue': {
    color: PRIMARY_BLUE
  },
  '& .text-center': {
    textAlign: 'center'
  },
  '& .text-uppercase': {
    textTransform: 'uppercase'
  },
  '& .MuiDataGrid-columnHeaders': {
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold'
    }
  },
  ...getAdditionalRowStyles()
});

export default StyledDataGrid;
