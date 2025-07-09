import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import HashrateChart from '@components/charts/HashrateChart';
import PayoutsTable from '@components/tables/payouts/PayoutsTable';
import SharesTable from '@components/tables/shares/SharesTable';
import { useNotification } from '@hooks/UseNotificationHook';
import { addAddress, clearPayouts } from '@store/app/AppReducer';
import { getSettings } from '@store/app/AppSelectors';
import { getHashrates, getPayouts, getShares } from '@store/app/AppThunks';
import { useDispatch, useSelector } from '@store/store';
import { validateAddress } from '@utils/Utils';

const AddressPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { addr } = router.query;
  const settings = useSelector(getSettings);
  const { showError } = useNotification();

  useEffect(() => {
    if (addr && typeof addr === 'string') {
      dispatch(clearPayouts());
      const isAddrValid: boolean = validateAddress(addr, settings.network);
      if (isAddrValid) {
        dispatch(addAddress(addr));
        dispatch(getHashrates(addr));
        dispatch(getShares(addr));
        dispatch(getPayouts(addr));
      } else {
        showError({
          message: t('invalidAddress'),
          options: {
            position: 'bottom-center',
            toastId: 'invalid-address'
          }
        });
      }
    }
  }, [addr]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginBottom: '50px',
        justifyContent: 'center'
      }}>
      <HashrateChart />
      <SharesTable />
      <PayoutsTable />
    </Box>
  );
};

export default AddressPage;
