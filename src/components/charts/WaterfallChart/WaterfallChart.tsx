import * as echarts from 'echarts/core';
import { BarChart as EchartBarChart } from 'echarts/charts';
import React, { useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';
import Charts from '../Charts';

echarts.use([EchartBarChart]);

interface DataConfig {
  label: string;
  value: number;
}

interface titleStyle {
  fontSize?: number | string;
  fontWeight?: number;
  color?: string;
}

interface WaterfallChartProps {
  // 标题
  title?: string;

  // 标题样式
  textStyle?: titleStyle;

  // 数据主题名称
  name?: string;

  // 数据
  dataSource: DataConfig[];
}

interface Props {
  data: WaterfallChartProps;

  // 组件宽度
  chartWidth?: number | string;

  // 组件高度
  chartHeight?: number | string;
}

const getChartOptions = (props: WaterfallChartProps): EChartsOption => {
  const { name, dataSource, title, textStyle } = props;

  const labelData: string[] = [];
  const valueData: number[] = [];
  dataSource.forEach(({ label, value }) => {
    labelData.push(label);
    valueData.push(value);
  });

  const dataArr1: (string | number)[] = [];
  const dataArr2: (string | number)[] = [];
  const totalArr: (string | number)[] = [];
  dataArr1.push(valueData[0]);
  dataArr2.push('-');
  valueData.forEach((val, index, arr) => {
    if (index > 0) {
      if (val >= arr[0]) {
        dataArr1.push(val - arr[0]);
        dataArr2.push('-');
        totalArr.push(valueData[0]);
      } else {
        dataArr2.push(val);
        dataArr1.push('-');
        totalArr.push(val);
      }
    }
  });
  totalArr.unshift(0);

  const options: EChartsOption = {
    title: {
      text: title ?? '',
      textStyle: textStyle ?? {},
    },
    color: ['#FF5757', '#51EB02'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params) => {
        const {
          value,
          name: _name1,
          seriesName,
          dataIndex,
        } = params[1] as {
          value: string | number;
          name: string;
          seriesName: string;
          dataIndex: number;
        };
        if (value !== '-') {
          if (dataIndex === 0) {
            return `${_name1}<br/>${seriesName} : ${value}`;
          }
          const values = Number(value) + valueData[0];
          return `${_name1}<br/>${seriesName} : ${values}`;
        }
        const {
          value: _value,
          name: _name2,
          seriesName: _seriesName,
        } = params[0] as {
          value: string | number;
          name: string;
          seriesName: string;
        };
        return `${_name2}<br/>${_seriesName} : ${_value}`;
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
        data: labelData,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: name ?? '数据',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          borderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: totalArr,
      },
      {
        name: name ?? '数据',
        type: 'bar',
        stack: '总量',
        // label: {
        //   show: true,
        //   position: 'top'
        // },
        data: dataArr1,
      },
      {
        name: '',
        type: 'bar',
        stack: '总量',
        // label: {
        //   show: true,
        //   position: 'bottom'
        // },
        data: dataArr2,
      },
    ],
  };

  return options;
};

const WaterfallChart = (props: Props) => {
  const { chartWidth, chartHeight, data, ...otherProps } = props;
  const chartStyle: React.CSSProperties = {
    width: chartWidth,
    height: chartHeight,
  };
  const [options, setOptions] = useState<echarts.EChartsCoreOption>({});

  useEffect(() => {
    setOptions(getChartOptions(data));
  }, [data]);

  return <Charts style={chartStyle} options={options} {...otherProps} />;
};

export default WaterfallChart;

WaterfallChart.defaultProps = {
  data: [],
  chartWidth: 550,
  chartHeight: 210,
};
