import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import HashrateChart from '@components/charts/HashrateChart';
import PayoutsTable from '@components/tables/payouts/PayoutsTable';
import SharesTable from '@components/tables/shares/SharesTable';
import { useNotification } from '@hooks/UseNotificationHook';
import { addAddress, clearPayouts } from '@store/app/AppReducer';
import { getSkeleton, getSettings } from '@store/app/AppSelectors';
import { connectRelay, getHashrates, getPayouts, getShares } from '@store/app/AppThunks';
import { useDispatch, useSelector } from '@store/store';
import { validateAddress } from '@utils/Utils';

const AddressPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { addr } = router.query;
  const settings = useSelector(getSettings);
  const enableSkeleton = useSelector(getSkeleton);
  const { showError } = useNotification();

  const hasConnectedRelayRef = useRef(false);

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

  useEffect(() => {
    if (settings && !hasConnectedRelayRef.current) {
      dispatch(connectRelay(settings));
      hasConnectedRelayRef.current = true;
    }
  }, [settings]);

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
      {enableSkeleton ? (
        <>
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: 50, width: '100%', marginBottom: 1, bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: 200, width: '100%', marginBottom: 3, bgcolor: 'grey.200' }}
          />
        </>
      ) : (
        <HashrateChart />
      )}

      {enableSkeleton ? (
        <>
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: 50, width: '100%', marginBottom: 1, bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: 200, width: '100%', marginBottom: 3, bgcolor: 'grey.200' }}
          />
        </>
      ) : (
        <SharesTable />
      )}

      {enableSkeleton ? (
        <>
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: 50, width: '100%', marginBottom: 1, bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ height: 200, width: '100%', marginBottom: 1, bgcolor: 'grey.200' }}
          />
        </>
      ) : (
        <PayoutsTable />
      )}
    </Box>
  );
};

export default AddressPage;
