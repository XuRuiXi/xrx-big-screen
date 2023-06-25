/**
 * @author Jiang.Guoyuan
 * @create date 2021-04-08 11:37:37
 * @modify date 2021-04-19 13:21:02
 * @desc 折线柱状图
 */
import * as echarts from 'echarts/core';
import { LineChart as EChartLineChart, BarChart as EchartBarChart } from 'echarts/charts';
import React, { useCallback, useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';
import type { LineAndBarChartDataType } from '@/components/_util/type';
import Charts from '../Charts';

echarts.use([EChartLineChart, EchartBarChart]);

export interface LineAndBarChartProps extends React.HTMLAttributes<HTMLDivElement> {

  /**
   * 左上方标题
   */
  title?: string;

  /**
   * 标题配置
   */
  titleConfigs?: {
    position?: titlePosConfigType;
    color?: '#FFFFFF' | '#00E5FF' | string;
    fontSize?: number;
    fontWeight?: number | string;
  };
  // titlePosConfig?: titlePosConfigType;

  /**
   * 折线图名称
   */
  linelabel: string;

  /**
   * 柱状图名称
   */
  barlabel: string;

  /**
   * 数据源
   */
  dataSource: LineAndBarChartDataType[];

  /**
   * 图表宽度
   */
  width?: number | string;

  /**
   * 图表高度
   */
  height?: number | string;

  /**
   * x 轴配置旋转角度
   */
  xAxisRotate?: number;

  /**
   * 折线图 y 坐标轴配置
   */
  yLineAxisConfigs?: yAxisConfigType;

  /**
   * 柱状图 y 坐标轴配置
   */
  yBarAxisConfigs?: yAxisConfigType;
}

type yAxisConfigType = {
  name?: string;
  format?: (value: number) => string;
};

type titlePosConfigType = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

const LineAndBarChart = (props: LineAndBarChartProps) => {
  const {
    title = '',
    dataSource,
    linelabel,
    barlabel,
    titleConfigs = {},
    xAxisRotate = 0,
    yLineAxisConfigs = {},
    yBarAxisConfigs = {},
    width = '100%',
    height = '100%',
    className = '',
    style,
    ...otherProps
  } = props;
  const [options, setOptions] = useState<echarts.EChartsCoreOption>({});

  const getChartOptions = useCallback(
    (data: LineAndBarChartDataType[]): EChartsOption => {
      const { position = {}, ...restTitleConfigs } = titleConfigs;
      const { top = 5, right = 5, bottom = 5, left = 18 } = position;
      const {
        color: titleColor = '#00E5FF',
        fontSize: titleFontSize = 20,
        fontWeight: titleFontWeight = 600,
      } = restTitleConfigs;
      const titlePadding = [top, right, bottom, left];

      const xAxisData: string[] = [];
      const lineData: number[] = [];
      const barData: number[] = [];
      data.forEach(({ xAxis, lineVal, barVal }) => {
        xAxisData.push(xAxis);
        lineData.push(lineVal);
        barData.push(barVal);
      });

      const opt: EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'transparent',
              color: '#FF5757',
              precision: 0,
            },
            crossStyle: {
              color: '#FF5757',
            },
          },
        },
        legend: {
          data: [barlabel, linelabel],
          // @ts-expect-error
          icon: 'circle',
          orient: 'horizontal',
          right: 0,
          textStyle: {
            color: '#FFF',
            fontSize: 16,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: xAxisData,
            axisPointer: {
              show: false,
            },
            axisLabel: {
              color: '#FFF',
              fontSize: 16,
              interval: 0,
              rotate: xAxisRotate,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            name: yBarAxisConfigs.name ?? '',
            type: 'value',
            splitNumber: 2,
            axisLabel: {
              formatter: yBarAxisConfigs.format,
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#555',
              },
            },
          },
          {
            name: yLineAxisConfigs.name ?? '',
            type: 'value',
            splitNumber: 2,
            axisLabel: {
              formatter: yLineAxisConfigs.format,
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#555',
              },
            },
          },
        ],
        title: [
          {
            show: true,
            text: title,
            textStyle: {
              fontSize: titleFontSize,
              // @ts-expect-error
              fontWeight: titleFontWeight,
              color: titleColor,
            },
            padding: titlePadding,
          },
        ],
        series: [
          {
            name: barlabel,
            type: 'bar',
            barWidth: 12,
            data: barData,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              // @ts-expect-error
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#00E5FF', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#3336C7', // 100% 处的颜色
                  },
                ],
                global: false,
              },
            },
          },
          {
            name: linelabel,
            type: 'line',
            smooth: false,
            data: lineData,
            color: '#FCC004',
            yAxisIndex: 1,
            label: {
              show: true,
              position: [8, -15],
              color: '#FCC004',
            },
            lineStyle: {
              color: '#FCC004',
              width: 3,
            },
            emphasis: {
              focus: 'series',
            },
          },
        ],
      };
      return opt;
    },
    [dataSource],
  );

  useEffect(() => {
    setOptions(getChartOptions(dataSource));
  }, [dataSource, getChartOptions]);

  return (
    <Charts
      className={className}
      options={options}
      {...otherProps}
      style={{ width, height, ...style }}
    />
  );
};

export default LineAndBarChart;
