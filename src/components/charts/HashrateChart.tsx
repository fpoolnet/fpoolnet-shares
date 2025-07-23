import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CustomChart from '@components/common/CustomChart';
import ProgressLoader from '@components/common/ProgressLoader';
import { SectionHeader } from '@components/styled/SectionHeader';
import { StyledCard } from '@components/styled/StyledCard';
import { getAddress, getHashrates, getIsHashratesLoading } from '@store/app/AppSelectors';
import { useSelector } from '@store/store';
import { PRIMARY_BLUE } from '@styles/colors';
import { calculateSMA, formatHashrate } from '@utils/Utils';

const HashrateChart = () => {
  const { t } = useTranslation();
  const hashrates = useSelector(getHashrates);
  const isLoading = useSelector(getIsHashratesLoading);
  const address = useSelector(getAddress);

  const [dataPoints, setDataPoints] = useState<any>([]);

  useEffect(() => {
    if (hashrates.length && !isLoading) {
      const lineDataPoints = hashrates
        .map((event: any) => ({
          time: event.timestamp,
          value: event.hashrate
        }))
        .sort((a: { time: number; value: number }, b: { time: number; value: number }) => a.time - b.time);

      setDataPoints(calculateSMA(lineDataPoints, 50));
    } else {
      setDataPoints([]);
    }
  }, [hashrates, isLoading]);

  return (
    <StyledCard>
      <Box
        component="section"
        sx={{
          p: 2,
          minHeight: '150px',
          justifyContent: 'center'
        }}>
        <SectionHeader>
          <Box>{t('hashrateChart')}</Box>
        </SectionHeader>
        {isLoading && address && <ProgressLoader value={hashrates.length} />}
        {!isLoading &&
          (dataPoints.length > 0 && address ? (
            <CustomChart
              dataPoints={dataPoints}
              height={300}
              lineColor={PRIMARY_BLUE}
              valueFormatter={formatHashrate}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 1,
                fontSize: '0.9rem'
              }}>
              No data
            </Box>
          ))}
      </Box>
    </StyledCard>
  );
};

export default HashrateChart;
