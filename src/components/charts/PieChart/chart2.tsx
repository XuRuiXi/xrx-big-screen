import React, { useRef, useEffect, useState } from 'react';
import type { ECharts, EChartsOption, GraphicComponentOption } from 'echarts';
import Charts from '../Charts';
import ss from './styles.less';

export interface DataConfig {
  label: string;
  value: number;
  tooltip?: string;
}

interface ItemConfig {
  name: string;
  value: number;
  percent: string;
  tooltip?: string;
  itemStyle?: Record<string, any>; // eslint-disable-line
}

const _colors = ['#00E5FF', '#6236FF', '#FCC004', '#FF5757', '#3336C7', '#28EB51'];

type TextConfig = {

  /** 文本 */
  text: string;

  /** 颜色 */
  color?: string;

  /** 字体大小 */
  fontSize?: number;

  /** 字粗 */
  fontWeight?: number;

  /** 字体 */
  fontFamily?: string;

  maxLength?: number;

  /** 水平位置，可为具体大小，百分比，center，left，right */
  x?: number | 'center' | 'left' | 'right' | string;

  /** 垂直位置，可为具体大小，百分比，center，top，bottom*/
  y?: number | 'center' | 'top' | 'bottom' | string;
};

export interface SimplePieChartProps {
  data: DataConfig[];
  config?: SimplePieChartConfig;
  children?: React.ReactNode;
}

interface SimplePieChartConfig {
  title?: string | TextConfig;
  texts?: TextConfig[];
  colors?: string[];
  radius?: [string | number, string | number];
  hoverTip?: boolean;
  fontSize?: number; // 中间hover文案中的数值字体大小
  nameFontSize?: number; // 中间hover文案中的文案描述字体大小
  firstHover?: 'value' | 'description'; // 中间hover文案中的数值和描述哪个位于上面

  /** 切换title与label 的显示 */
  toggleTitleAndLabel?: boolean;

  /** 最大文案长度 */
  maxTextLength?: number;

  onHover?: (item?: unknown) => void;
}

function getMaxText(text: string, max?: number): string {
  if (max && text.length > max) {
    const txt = text.substr(0, max);
    return `${txt}...`;
  }

  return text;
}

function getSimplePieChart(data: DataConfig[], config: SimplePieChartConfig): EChartsOption {
  const {
    title,
    texts,
    colors = _colors,
    radius = ['80%', '90%'],
    fontSize = 26,
    nameFontSize = 20,
    hoverTip = true,
    firstHover = 'value',
    maxTextLength = 6,
  } = config;
  const total = data.reduce((t, i) => t + i.value, 0);
  const list: ItemConfig[] = [];

  data.forEach((it) => {
    list.push({
      name: it.label,
      value: it.value,
      tooltip: it.tooltip,
      percent: ((it.value / total) * 100).toFixed(2),
    });
    list.push({
      name: '',
      value: total / 128,
      percent: '0',
      itemStyle: {
        label: { show: false },
        labelLine: { show: false },
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
      },
    });
  });

  const graphic: GraphicComponentOption[] = [];
  if (title) {
    let titleConfig: TextConfig;
    if (typeof title === 'string') {
      titleConfig = {
        text: title,
        x: 'center',
        y: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: 600,
        fontFamily: 'DIN-Regular',
      };
    } else {
      titleConfig = title;
    }
    graphic.push({
      z: 10,
      type: 'text',
      top: titleConfig.y ?? 'center',
      left: titleConfig.x ?? 'center',
      style: {
        textAlign: 'center',
        text: getMaxText(titleConfig.text, titleConfig.maxLength ?? maxTextLength),
        fontSize: titleConfig.fontSize ?? 20,
        fontWeight: titleConfig.fontWeight ?? 500,
        fontFamily: titleConfig.fontFamily,
        fill: titleConfig.color,
      },
    });
  }

  if (texts) {
    texts.forEach((txt) => {
      graphic.push({
        z: 10,
        type: 'text',
        top: txt.y ?? 'center',
        left: txt.x ?? 'center',
        style: {
          textAlign: 'center',
          text: getMaxText(txt.text, txt.maxLength ?? maxTextLength),
          fontSize: txt.fontSize ?? 20,
          fontWeight: txt.fontWeight ?? 500,
          fontFamily: txt.fontFamily,
          fill: txt.color,
        },
      });
    });
  }

  const options: EChartsOption = {
    color: colors,
    legend: { show: false },
    series: [
      {
        name: 'pie_chart',
        type: 'pie',
        radius,
        itemStyle: { borderRadius: 0, borderWidth: 0 },
        data: list,
        label: {
          show: false,
          position: 'center',
          formatter: (dd) => {
            const _d: unknown = dd.data;
            const { tooltip, percent } = _d as ItemConfig;
            if (dd.name === '') return '';
            let _tooltip = tooltip ?? `${percent}%`;
            _tooltip = getMaxText(_tooltip, maxTextLength);
            const name = getMaxText(dd.name, maxTextLength);
            return firstHover === 'description'
              ? `{t1|${name}}\n{n1|${_tooltip}}`
              : `{n1|${_tooltip}}\n{t1|${name}}`;
          },
          color: '#fff',
          rich: {
            n1: {
              fontSize,
              opacity: 0.85,
              lineHeight: 40,
              fontFamily: 'DIN-Regular',
            },
            t1: {
              fontSize: nameFontSize,
              color: '#FFFFFF',
              opacity: 0.45,
              width: 1,
            },
          },
        },
        emphasis: {
          scale: false,
          label: { show: hoverTip },
        },
      },
    ],
    graphic,
  };

  return options;
}

export function SimplePieChart(props: SimplePieChartProps) {
  const { data, config = {}, children } = props;
  const { toggleTitleAndLabel, hoverTip, onHover } = config;
  const chart = useRef<ECharts>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [opt, setOpt] = useState<EChartsOption>();

  useEffect(() => {
    setOpt(getSimplePieChart(data, config));
  }, [data, config]);

  useEffect(() => {
    if (toggleTitleAndLabel) {
      chart.current?.on('mouseover', { seriesName: 'pie_chart' }, ({ data: d }) => {
        const _opt = { ...opt };
        if (Array.isArray(_opt.graphic)) {
          _opt.graphic.forEach((g) => {
            Object.assign(g, { $action: 'remove' });
          });
        }
        chart.current?.setOption(_opt);
        onHover?.(d);
        setHover(true);
      });

      chart.current?.on('mouseout', { seriesName: 'pie_chart' }, (...i) => {
        const _opt = { ...opt };
        if (Array.isArray(_opt.graphic)) {
          _opt.graphic.forEach((g) => {
            Object.assign(g, { $action: 'replace' });
          });
        }
        chart.current?.setOption(_opt);
        setHover(false);
        onHover?.();
      });
    }

    return () => {
      chart.current?.off();
    };
  }, [toggleTitleAndLabel, opt, onHover]);

  return (
    <div className={ss.root}>
      <Charts ref={chart} className="b100x100" options={opt} />
      {/* hovertip 关闭时需要通过 children 来自定义 hover 的内容 */}
      {children && (
        <div className={ss.child} style={{ opacity: hover && hoverTip ? 0 : 1 }}>
          {children}
        </div>
      )}
    </div>
  );
}
