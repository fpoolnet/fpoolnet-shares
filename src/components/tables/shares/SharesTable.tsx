import CustomTable from '@components/common/CustomTable';
import ProgressLoader from '@components/common/ProgressLoader';
import { SectionHeader } from '@components/styled/SectionHeader';
import { StyledCard } from '@components/styled/StyledCard';
import Box from '@mui/material/Box';
import { getAddress, getIsSharesLoading, getShares } from '@store/app/AppSelectors';
import { useSelector } from '@store/store';
import { useTranslation } from 'react-i18next';
import sharesColumns from './SharesColumns';

const SharesTable = () => {
  const { t } = useTranslation();
  const columns = sharesColumns();
  const isLoading = useSelector(getIsSharesLoading);
  const shares = useSelector(getShares);
  const address = useSelector(getAddress);

  return (
    <StyledCard>
      <Box
        component="section"
        sx={{
          p: 2,
          minHeight: shares.length ? 200 : 100,
          justifyContent: 'center'
        }}>
        <SectionHeader>{t('pendingShares')}</SectionHeader>
        {isLoading && address && <ProgressLoader value={shares.length} />}
        {!isLoading && address && (
          <Box sx={{ height: shares.length ? 'auto' : 100 }}>
            <CustomTable
              columns={columns}
              rows={shares}
              isLoading={isLoading}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'blockHeight', sort: 'desc' }]
                },
                pagination: { paginationModel: { pageSize: 10 } }
              }}
            />
          </Box>
        )}
      </Box>
    </StyledCard>
  );
};

export default SharesTable;
