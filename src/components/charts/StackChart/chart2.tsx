import React from 'react';
import type { EChartsOption, BarSeriesOption, LegendComponentOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

interface ChartData {
  keys: string[];
  list: {
    label: string;
    value?: string | number;
    data: Record<string, number>;
  }[];
}

export interface CapStackChartProps extends ChartsProps {
  data: ChartData;
  config?: ChartConfig;
}

export interface ChartConfig {

  /** 自定义颜色 */
  colors?: string[];

  /** 图表上边距 */
  gridTop?: number | string;

  /** 图表左边距 */
  gridLeft?: number | string;

  /** 图表右边距 */
  gridRight?: number | string;

  /** 图表下边距 */
  gridBottom?: number | string;

  /** bar的大小 */
  barWidth?: number;

  /** 是否显示图例 */
  showLegend?: boolean;

  /** 图例图标大小 */
  legendShapeSize?: number;

  /** 胶囊的内边距 */
  capPadding?: number;

  /** 是否显示 tooltip */
  showTooltip?: boolean;
}

function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const { keys, list = [] } = data;
  const {
    colors = ['#3138BF', '#00E5FF', '#10D39E', '#F1B805'],
    gridTop = 40,
    gridLeft = 10,
    gridRight = 0,
    gridBottom = 10,
    barWidth = 10,
    capPadding = 2,
    showLegend = true,
    showTooltip = true,
    legendShapeSize = 10,
  } = config;
  const labels: string[] = [];
  const series: BarSeriesOption[] = [];
  const dataMap: Record<string, number[]> = {};
  let maxValue: number = 0;
  const maxValueMap: Record<string, number> = {};
  const mapList: Record<string, { lab: string; val: unknown }[]> = {};
  list.forEach((it, i) => {
    labels.push(it.label);
    maxValueMap[it.label] ??= 0;
    mapList[it.label] = [];
    keys.forEach((k) => {
      maxValueMap[it.label] += it.data[k];
      dataMap[k] ??= [];
      dataMap[k].push(maxValueMap[it.label]);
      mapList[it.label].push({
        lab: k,
        val: it.data[k],
      });
    });
    maxValue = Math.max(maxValue, maxValueMap[it.label]);
  });

  keys.forEach((key, i) => {
    series.push({
      z: 10 - i,
      name: key,
      type: 'bar',
      roundCap: true,
      barGap: '-100%',
      xAxisIndex: 0,
      barWidth,
      itemStyle: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: barWidth,
      },
      label: {},
      labelLayout: {},
      data: dataMap[key],
    });
  });

  const legend: LegendComponentOption | undefined = showLegend
    ? {
      z: 4,
      show: true,
      top: 0,
      right: 0,
      data: keys,
      // @ts-expect-error
      icon: 'circle',
      textStyle: {
        color: '#FFF',
        fontSize: 18,
      },
      itemHeight: legendShapeSize,
      selectedMode: false,
    }
    : undefined;

  const option: EChartsOption = {
    color: colors,
    grid: {
      top: gridTop,
      left: gridLeft,
      right: gridRight,
      bottom: gridBottom,
      containLabel: true,
    },
    xAxis: [
      {
        data: labels,
        type: 'category',
        boundaryGap: true,
        axisTick: { show: false },
        axisLabel: {
          color: '#fff',
          fontSize: 18,
          opacity: 0.5,
          align: 'center',
        },
      },
      {
        data: labels,
        type: 'category',
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#979797',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#979797',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16,
          opacity: 0.5,
        },
      },
    ],
    legend,
    tooltip: showTooltip
      ? {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderWidth: 0,
        formatter: (conf) => {
          const { name } = conf as { name: string };
          let html = `<div><h4 style="color:#fff">${name}</h4>`;
          mapList[name].forEach((it, i) => {
            const c = colors[i];
            html += `
          <div style="display:flex;flex-direction:row;align-items:center;">
            <div style="width:${legendShapeSize}px;height:${legendShapeSize}px;border-radius:50%;background:${c};margin-right:8px;"></div>
            <div style="margin-right:8px;color:#fff">${it.lab}</div>
            <div style="color:#fff;">${it.val as string}</div>
          </div>`;
          });

          html += '</div>';
          return html;
        },
      }
      : undefined,
    series: [
      ...series,
      {
        type: 'bar',
        xAxisIndex: 1,
        data: list.map(() => maxValue + capPadding),
        barWidth: barWidth + capPadding * 2,
        barGap: '-100%',
        color: 'transparent',
        itemStyle: {
          borderRadius: barWidth * 2,
          borderColor: '#FFFFFF4D',
        },
      },
    ],
  };

  return option;
}

export function CapStackChart(props: CapStackChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
