import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CustomTable from '@components/common/CustomTable';
import ProgressLoader from '@components/common/ProgressLoader';
import { SectionHeader } from '@components/styled/SectionHeader';
import { StyledCard } from '@components/styled/StyledCard';
import { getAddress, getIsSharesLoading, getShares, getSharesCount } from '@store/app/AppSelectors';
import { useSelector } from '@store/store';
import sharesColumns from './SharesColumns';

const SharesTable = () => {
  const { t } = useTranslation();
  const columns = sharesColumns;
  const sharesCount = useSelector(getSharesCount);
  const isLoading = useSelector(getIsSharesLoading);
  const shares = useSelector(getShares);
  const address = useSelector(getAddress);

  const [dataTable, setDataTable] = useState<any>([]);

  useEffect(() => {
    if (shares?.length && !isLoading) {
      setDataTable(shares);
    } else {
      setDataTable([]);
    }
  }, [shares, isLoading]);

  return (
    <StyledCard>
      <Box
        component="section"
        sx={{
          p: 2,
          minHeight: sharesCount ? 200 : 100,
          justifyContent: 'center'
        }}>
        <SectionHeader>{t('pendingShares')}</SectionHeader>
        {isLoading && address && <ProgressLoader value={shares.length} />}
        {!isLoading && address && (
          <Box sx={{ height: sharesCount ? 350 : 100 }}>
            <CustomTable
              columns={columns}
              rows={dataTable}
              rowCount={sharesCount}
              isLoading={isLoading}
              hidePagination
            />
          </Box>
        )}
      </Box>
    </StyledCard>
  );
};

export default SharesTable;
