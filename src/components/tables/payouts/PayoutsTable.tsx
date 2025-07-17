import CustomTable from '@components/common/CustomTable';
import CustomTooltip from '@components/common/CustomTooltip';
import ProgressLoader from '@components/common/ProgressLoader';
import { SectionHeader } from '@components/styled/SectionHeader';
import { StyledCard } from '@components/styled/StyledCard';
import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import {
  getAddress,
  getIsPayoutsLoading,
  getPayouts,
  getPayoutsCount,
  getUnconfirmedBalance
} from '@store/app/AppSelectors';
import { useSelector } from '@store/store';
import { lokiToFlc } from '@utils/Utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import payoutsColumns from './PayoutsColumns';

const PayoutsTable = () => {
  const { t } = useTranslation();
  const columns = payoutsColumns;
  const payoutsCount = useSelector(getPayoutsCount);
  const isLoading = useSelector(getIsPayoutsLoading);
  const payouts = useSelector(getPayouts);
  const address = useSelector(getAddress);
  const unconfirmedBalance = useSelector(getUnconfirmedBalance);

  const [dataTable, setDataTable] = useState<any>([]);

  useEffect(() => {
    if (payouts?.length && !isLoading) {
      setDataTable(payouts);
    } else {
      setDataTable([]);
    }
  }, [payouts, isLoading]);

  return (
    <StyledCard>
      <Box
        component="section"
        sx={{
          p: 2,
          minHeight: '200px',
          justifyContent: 'center'
        }}>
        <SectionHeader>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>{t('payouts')}</Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {unconfirmedBalance > 0 && (
                <CustomTooltip title={t('unconfirmedBalance')} placement="top" textBold>
                  <Chip
                    label={lokiToFlc(unconfirmedBalance) + ' FLC'}
                    sx={{ fontWeight: 'bold', borderRadius: 1, marginLeft: 1 }}
                    size="small"
                  />
                </CustomTooltip>
              )}
            </Box>
          </Box>
        </SectionHeader>
        {isLoading && address && <ProgressLoader value={payouts.length} />}
        {!isLoading && address && (
          <CustomTable
            columns={columns}
            rows={dataTable}
            rowCount={payoutsCount}
            isLoading={isLoading}
            initialState={{
              sorting: {
                sortModel: [{ field: 'blockHeight', sort: 'desc' }]
              }
            }}
          />
        )}
      </Box>
    </StyledCard>
  );
};

export default PayoutsTable;
