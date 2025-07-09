import { AreaSeries, createChart, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface CustomChartProps {
  dataPoints: LineData[];
  height?: number;
  lineColor?: string;
  areaTopColor?: string;
  areaBottomColor?: string;
  valueFormatter?: (value: number) => any;
}

const CustomChart = ({
  dataPoints,
  height = 300,
  lineColor = 'blue',
  areaTopColor = 'rgba(33, 150, 243, 0.4)',
  areaBottomColor = 'rgba(33, 150, 243, 0.0)',
  valueFormatter
}: CustomChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: { attributionLogo: false },
      rightPriceScale: {
        visible: false
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true
      }
    });

    areaSeriesRef.current = chartRef.current.addSeries(AreaSeries, {
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      lineColor: lineColor,
      lineWidth: 2,
      title: valueFormatter
        ? valueFormatter(dataPoints[dataPoints.length - 1].value)
        : dataPoints[dataPoints.length - 1].value.toString()
    });

    areaSeriesRef.current.setData(dataPoints);

    const legend = document.createElement('div');
    legend.style.cssText = `
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 1;
  font-size: 16px;
  line-height: 15px;
  font-weight: 300;
  color: #0e52d2;
`;
    containerRef.current.appendChild(legend);

    chartRef.current.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData.size || !areaSeriesRef.current) {
        legend.style.display = 'none'; // Hide legend if there's no data
        return;
      }

      const data = param.seriesData.get(areaSeriesRef.current);

      if (!data) {
        legend.style.display = 'none'; // Hide if data is not found
        return;
      }

      const lineData = data as LineData;
      const priceFormatted = valueFormatter
        ? valueFormatter(lineData.value)
        : lineData.value.toFixed(2);

      legend.style.display = 'block'; // Show legend when data is present
      legend.innerHTML = `<strong>${priceFormatted}</strong>`;
    });

    chartRef.current.timeScale().fitContent();

    return () => {
      chartRef.current?.remove();
    };
  }, [height, lineColor, dataPoints, valueFormatter]);

  useEffect(() => {
    if (areaSeriesRef.current && dataPoints.length > 0) {
      areaSeriesRef.current.setData(dataPoints);
    }
  }, [dataPoints]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height
      }}>
      <div ref={legendRef} />
    </div>
  );
};

export default CustomChart;
