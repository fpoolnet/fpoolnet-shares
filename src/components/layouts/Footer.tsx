import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CustomModal from '@components/common/CustomModal';
import SettingsModal from '@components/modals/SettingsModal';
import styles from '@styles/scss/Footer.module.scss';

const Footer = () => {
  const { t } = useTranslation();
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const handleOpenSettingsModal = () => {
    setOpenSettingsModal(true);
  };

  const handleCloseSettingsModal = () => {
    setOpenSettingsModal(false);
  };

  return (
    <footer className={styles.footer} style={{ display: 'flex', alignItems: 'center' }}>
      <p style={{ flex: 1, textAlign: 'center' }}>{t('footer.title')}</p>
      <Tooltip title={t('settings')}>
        <IconButton onClick={handleOpenSettingsModal}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <CustomModal open={openSettingsModal} handleClose={handleCloseSettingsModal} size="small">
        <SettingsModal close={handleCloseSettingsModal} />
      </CustomModal>
    </footer>
  );
};

export default Footer;
