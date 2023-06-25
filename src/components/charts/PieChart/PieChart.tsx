import type { EChartsOption } from 'echarts';
import React, { useState } from 'react';
import Charts from '../Charts';
import styles from './PieChart.less';

const pieSvg =
  'path://M5.664377212524414,0.5450992584228516C2.9564919471740723,0.5450992584228516,0.7613176107406616,2.7402734756469727,0.7613176107406616,5.448158264160156C0.7613176107406616,8.15604305267334,2.9564919471740723,10.351218223571777,5.664377212524414,10.351218223571777C8.372262001037598,10.351218223571777,10.567436218261719,8.15604305267334,10.567436218261719,5.448158264160156C10.567436218261719,2.7402734756469727,8.372262001037598,0.5450992584228516,5.664377212524414,0.5450992584228516ZM5.664377212524414,3.0644640922546387C6.9808549880981445,3.0644640922546387,8.048070907592773,4.131680488586426,8.048070907592773,5.448158264160156C8.048070907592773,6.764636993408203,6.9808549880981445,7.831852912902832,5.664377212524414,7.831852912902832C4.347898483276367,7.831852912902832,3.28068208694458,6.764636993408203,3.28068208694458,5.448158264160156C3.28068208694458,4.131680488586426,4.347898483276367,3.0644640922546387,5.664377212524414,3.0644640922546387Z';

const defineOptions: EChartsOption = {
  color: ['#00E5FF', '#6236FF', '#FCC004', '#FF5757', '#3336C7', '#28EB51'],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: 'middle',
    right: '2px',
    // @ts-expect-error
    icon: pieSvg, // 这个属性是有的，typescript声明文件里少了
    align: 'left',
    orient: 'vertical',
    formatter: name => [`{a|${name}}`, '{n|876}', '{r1|样式3}', '{r2|样式4}'].join(''),

    textStyle: {
      rich: {
        a: {
          color: '#fff',
          fontSize: '16px',
          width: 128,
        },
        n: {
          color: '#00E5FF',
          fontSize: '18px',
          width: 60,
        },
        r1: {
          color: '#FF5757',
          fontSize: '18px',
        },
        r2: {
          color: '#51EB02',
          fontSize: '18px',
        },
      },
    },
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['60%', '70%'],
      center: ['20%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 1,
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      emphasis: {},
      labelLine: {
        show: true,
      },
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
    },
  ],
};

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {}

const PieChart = (props: PieChartProps) => {
  const { className = '', ...otherProps } = props;
  const [options] = useState<EChartsOption>(() => defineOptions);

  return <Charts className={`${styles.root} ${className}`} options={options} {...otherProps} />;
};

export default PieChart;
