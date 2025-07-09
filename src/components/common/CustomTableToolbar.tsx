import { useTranslation } from 'react-i18next';
import { GridToolbarContainer } from '@mui/x-data-grid';
import CustomButton from './CustomButton';

interface CustomTableToolbarProps {
  addAction?: boolean;
  handleAddNewRow?: () => void;
}

const CustomTableToolbar = (props: CustomTableToolbarProps) => {
  const { addAction, handleAddNewRow } = props;
  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      {addAction && handleAddNewRow && (
        <CustomButton
          iconName="AddCircleIcon"
          size="small"
          onClick={() => handleAddNewRow()}
          label={t('add')}
        />
      )}
    </GridToolbarContainer>
  );
};

export default CustomTableToolbar;
