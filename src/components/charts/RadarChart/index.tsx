/*
 * @Descripttion:
 * @version:
 * @Author: zlz
 * @Date: 2021-04-13 16:37:19
 */
import React, { useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';
import Charts from '../Charts';
import styles from './index.less';

export interface ChartData {
  name: string;
  value: number[];
}

export interface Props {
  title?: string;
  data: ChartData[];
  indicator: string[];
  chartWidth?: number;
  chartHeight?: number;
  radius?: number;
  radarPosition?: string[];
  startAngle?: number;
  colorConfigs?: RadarChartColorConfigType;
}

type RadarChartColorConfigType = {
  name?: string;
  axisLine?: string;
  splitLine?: string;
  splitArea?: string[];
};

function getChartOptionsByData(params: {
  data: ChartData[];
  title: string;
  indicator: string[];
  radius: number;
  startAngle: number;
  position: string[];
  colorConfigs: RadarChartColorConfigType;
}): EChartsOption {
  const { data, title, indicator = [], radius, startAngle, position, colorConfigs } = params;
  const {
    name: nameTextStyle = 'rgba(255,255,255,0.35)',
    axisLine: axisLineColor = 'rgba(255,255,255,0.35)',
    splitLine: splitLineColor = 'rgba(255,255,255,0.35)',
    splitArea: splitAreaColor = ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
  } = colorConfigs;
  const legendData = data.map(item => item.name);
  let max: number = 0;
  let arr: number[] = [];
  data
    .map(item => item.value)
    .forEach((item) => {
      arr = [...arr, ...item];
    });
  max = Math.max(...arr);

  const buildSeries = (dataSource: number[]) => {
    const helper = dataSource.map((item, index) => {
      const _arr = new Array(dataSource.length);
      _arr.splice(index, 1, item);
      return _arr;
    });
    return [dataSource, ...helper].map((item, index) => ({
      type: 'radar',
      symbol: 'none',
      lineStyle: {
        color: index === 0 ? splitLineColor : 'transparent',
      },
      areaStyle: {
        opacity: 0.4,
      },
      tooltip: {
        show: index !== 0,
        backgroundColor: 'transparent',
        textStyle: {
          color: '#FFF',
        },
        formatter() {
          return `${indicator[index - 1]}：${dataSource[index - 1]}`;
        },
      },
      z: index === 0 ? 1 : 2,
      data: [item],
    }));
  };

  const option: EChartsOption = {
    title: {
      text: title,
      bottom: 0,
      show: !!title,
      left: 'center',
      textStyle: {
        color: '#00e5ff',
      },
    },
    tooltip: {
      show: true,
      backgroundColor: 'transparent',
      textStyle: {
        color: '#FFF',
      },
    },
    color: ['rgb(7,218,242)', 'rgb(229,186,21)'],
    legend: {
      show: false,
      // @ts-expect-error
      icon: 'circle',
      data: legendData,
      right: 0,
      textStyle: {
        color: '#fff',
      },
    },
    axisLine: {
      // 坐标轴线
      show: false, // 默认显示，属性show控制显示与否
    },
    axisLabel: {
      show: false,
    },
    splitArea: {
      areaStyle: {
        opactity: '0',
      },
    },
    radar: [
      {
        shape: 'circle',
        radius,
        // @ts-expect-error
        name: {
          show: true,
          textStyle: {
            color: nameTextStyle,
          },
        },
        nameGap: 6,
        startAngle,
        center: position,
        indicator: indicator.map(item => ({ text: item, max })),
        axisLine: {
          lineStyle: {
            color: axisLineColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        splitArea: {
          areaStyle: {
            color: splitAreaColor,
          },
        },
      },
    ],
    // @ts-expect-error
    series:
      data.length === 1
        ? buildSeries(data[0].value)
        : [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item',
            },
            symbol: 'none',
            areaStyle: {
              opacity: 0.4,
            },
            data,
          },
        ],
  };

  return option;
}

const RadarChart = (props: Props) => {
  const {
    data,
    indicator = [],
    title = '',
    chartHeight = 250,
    chartWidth = 540,
    radius = 47,
    startAngle = 90,
    radarPosition = ['50%', '40%'],
    colorConfigs = {},
  } = props;
  const [opt, setOpt] = useState<EChartsOption>();

  useEffect(() => {
    setOpt(
      getChartOptionsByData({
        data,
        title,
        indicator,
        radius,
        startAngle,
        position: radarPosition,
        colorConfigs,
      }),
    );
  }, [title, data]);
  const chartStyle: React.CSSProperties = {
    width: chartWidth,
    height: chartHeight,
  };
  return <Charts className={`${styles.chart}`} options={opt} style={chartStyle} />;
};

export default RadarChart;
