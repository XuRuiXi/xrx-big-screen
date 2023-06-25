import React, { useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';
import Charts from '../Charts';

const _colors = ['#00E5FF', '#6236FF', '#FCC004', '#FF5757', '#3336C7', '#28EB51'];

const pieSvg =
  'path://M5.664377212524414,0.5450992584228516C2.9564919471740723,0.5450992584228516,0.7613176107406616,2.7402734756469727,0.7613176107406616,5.448158264160156C0.7613176107406616,8.15604305267334,2.9564919471740723,10.351218223571777,5.664377212524414,10.351218223571777C8.372262001037598,10.351218223571777,10.567436218261719,8.15604305267334,10.567436218261719,5.448158264160156C10.567436218261719,2.7402734756469727,8.372262001037598,0.5450992584228516,5.664377212524414,0.5450992584228516ZM5.664377212524414,3.0644640922546387C6.9808549880981445,3.0644640922546387,8.048070907592773,4.131680488586426,8.048070907592773,5.448158264160156C8.048070907592773,6.764636993408203,6.9808549880981445,7.831852912902832,5.664377212524414,7.831852912902832C4.347898483276367,7.831852912902832,3.28068208694458,6.764636993408203,3.28068208694458,5.448158264160156C3.28068208694458,4.131680488586426,4.347898483276367,3.0644640922546387,5.664377212524414,3.0644640922546387Z';

export interface DataConfig {
  label: string;
  value: number;
  extra: number;
}

interface ItemConfig {
  name: string;
  value: number;
  percent: string;
  itemStyle?: Record<string, any>; // eslint-disable-line
}

interface PieChartWithLegendProps {
  data: DataConfig[];
  config?: PieChartWithLegendConfig;
}

interface PieChartWithLegendConfig {
  colors?: string[];
  radius?: [string | number, string | number];
}

function getPieChartWithLegend(
  data: DataConfig[],
  config: PieChartWithLegendConfig,
): EChartsOption {
  const { colors = _colors, radius = ['80%', '90%'] } = config;
  const list: ItemConfig[] = [];
  const mapper = new Map<string, DataConfig>();
  data.forEach((it) => {
    mapper.set(it.label, it);
    list.push({
      name: it.label,
      value: it.value,
      percent: `${it.extra ?? 0}`,
    });
  });

  const options: EChartsOption = {
    color: colors,
    legend: {
      top: '52%',
      // right: '2px',
      // @ts-expect-error
      icon: pieSvg,
      align: 'left',
      selectedMode: false,
      formatter: (label) => {
        let res: string = '';
        const item = mapper.get(label);
        res = `{a|${label}}{b|${item?.extra ?? 0}%}`;
        return res;
      },
      itemGap: 12,
      textStyle: {
        rich: {
          a: {
            color: '#fff',
            fontSize: '18px',
            width: 72,
          },
          b: {
            color: '#00E5FF',
            fontSize: '20px',
            // width: 60,
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        radius,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        top: '-50%',
        data: list,
        label: {
          show: false,
          position: 'center',
          formatter: (dd) => {
            if (dd.name === '') return '';
            // @ts-expect-error
            return `{n1|${Number(dd.data.percent || 0).toFixed(0)}%}\n{t1|${dd.name}}`;
          },
          color: '#fff',
          rich: {
            n1: {
              fontSize: 26,
              opacity: 0.85,
              lineHeight: 40,
            },
            t1: {
              fontSize: 18,
              color: '#FFFFFF',
              opacity: 0.45,
            },
          },
        },
        emphasis: {
          scale: false,
          label: { show: true },
        },
      },
    ],
  };

  return options;
}

function PieChartWithLegend(props: PieChartWithLegendProps) {
  const { data, config = {}} = props;
  const [opt, setOpt] = useState<EChartsOption>();
  useEffect(() => {
    setOpt(getPieChartWithLegend(data, config));
  }, [data, config]);
  return opt ? <Charts className="b100x100" options={opt} /> : <div />;
}
PieChartWithLegend.defaultProps = { config: {}};

export default PieChartWithLegend;
