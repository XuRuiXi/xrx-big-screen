import * as echarts from 'echarts/core';
import { LineChart as EChartLineChart } from 'echarts/charts';
import React, { useState, useEffect } from 'react';
import type { EChartsOption, GridComponentOption } from 'echarts';
import { usePersistFn } from 'ahooks';
import { graphic } from 'echarts';
import Charts from '../Charts';

echarts.use([EChartLineChart]);

// areaColor 面积渐变色，传0%和100%两处颜色
type labelItem = {
  label: string;
  color: string;
  areaColors?: Array<{ offset: number; color: string }>;
};

interface Props {
  data: DataConfig[];
  labels: labelItem[];
  yMin?: number;
  splitNumber?: number;
  isSmooth?: boolean;
  rotate?: number;
  showLegend?: boolean;
  showSymbol?: boolean;
  yUnit?: string;
  titlePadding?: Array<number>;
  xRight?: string;
  xLabelStyle?: {
    color?: string;
    fontSize?: number;
  };
  legendPadding?: Array<number>;
  grid?: GridComponentOption | GridComponentOption[];
}
interface DataConfig {
  xLabel: string;
}

const LineChart = (props: Props) => {
  const getLineChartOptions = usePersistFn((): EChartsOption => {
    const {
      data = [],
      yMin = 0,
      labels = [],
      splitNumber = 0,
      isSmooth,
      rotate,
      showLegend,
      showSymbol,
      yUnit,
      titlePadding,
      xRight,
      xLabelStyle,
      legendPadding,
      grid,
    } = props;
    const labelData: string[] = [];
    const labelStrings: Array<string> = labels.map((i: labelItem) => i.label);
    const dataItem: Record<string, Array<number>> = {};
    labelStrings.forEach((value) => {
      dataItem[`${value}`] = [];
    });
    data.forEach((item) => {
      labelData.push(item.xLabel);
      labelStrings.forEach((value) => {
        dataItem[`${value}`].push(item[`${value}`] || 0);
      });
    });
    const legends = labels.map((i: labelItem) => ({ name: i.label }));
    const series = labels.map((i: labelItem) => {
      const { areaColors } = i;
      return {
        name: i.label,
        type: 'line',
        smooth: isSmooth,
        areaStyle:
          areaColors && areaColors.length > 0
            ? {
              color: new graphic.LinearGradient(0, 0, 0, 1, areaColors),
            }
            : undefined,
        label: {
          show: false,
          position: 'top',
          color: i.color,
          fontSize: 14,
        },
        itemStyle: {
          color: i.color,
        },
        emphasis: {
          focus: 'series',
        },
        data: dataItem[`${i.label}`],
        showSymbol: showSymbol ?? false,
        symbol: 'circle',
        symbolSize: 8,
      };
    });
    const hasTop = yUnit || showLegend ? {} : { top: '4%' };
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        showContent: false,
      },
      title: {
        show: !!yUnit,
        text: yUnit,
        textStyle: {
          fontSize: 20,
          color: '#00E5FF',
          fontWeight: 600,
        },
        padding: titlePadding,
      },
      legend: {
        data: legends,
        show: showLegend,
        // @ts-expect-error
        icon: 'circle',
        orient: 'horizontal',
        right: 0,
        top: 10,
        itemWidth: 8,
        textStyle: {
          color: '#FFF',
          fontSize: 16,
        },
        padding: legendPadding ?? [0, 0, 0, 0],
      },
      grid: grid ?? {
        ...hasTop,
        left: '3%',
        right: xRight ?? '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: labelData,
          axisLabel: {
            color: xLabelStyle?.color,
            fontSize: xLabelStyle?.fontSize,
            fontFamily: 'DIN-Regular',
            rotate,
          },
          axisLine: { show: false },
          axisPointer: {
            label: {
              show: false,
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitNumber,
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 14,
            fontFamily: 'DIN-Regular',
          },
          splitLine: {
            show: false,
            // lineStyle: {
            //   type: 'dashed',
            //   color: '#555',
            // },
          },
          min: yMin,
        },
      ],
      // @ts-expect-error
      series,
    };
    return option;
  });

  const [opt, setOpt] = useState<EChartsOption>();
  useEffect(() => {
    setOpt(getLineChartOptions());
  }, [props]);

  return opt ? <Charts className="b100x100" options={opt} /> : <div />;
};

export default LineChart;

LineChart.defaultProps = {
  yMin: 0,
  splitNumber: 0,
  isSmooth: false,
  rotate: 0,
  showLegend: true,
  showSymbol: false,
  yUnit: '',
  titlePadding: [12, 0, 0, 10],
  xRight: '4%',
  legendPadding: [0, 0, 0, 0],
  grid: null,
  xLabelStyle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
};
