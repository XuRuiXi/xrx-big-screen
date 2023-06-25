import { useThis } from '@ali-whale/hooks';
import { useDebounceFn, useSize } from 'ahooks';
import * as echarts from 'echarts/core';
import { ScatterChart, PieChart, BarChart, FunnelChart, RadarChart } from 'echarts/charts';
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent,
  CanvasRenderer,
  BarChart,
  PieChart,
  ScatterChart,
  FunnelChart,
  RadarChart,
]);

export interface ChartsProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: echarts.EChartsCoreOption;
  event2Arguments?: [string, (params: unknown) => void][];
  // event3Arguments?: Array<[
  //   string,
  //   (string|Record<string, unknown>),
  //  (params: unknown) => void,
  // ]>;
}

const Charts = (props: ChartsProps, ref) => {
  const { className = '', options, event2Arguments, /* event3Arguments, */ ...otherProps } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const _this = useThis<{ charts?: echarts.ECharts }>({});

  useImperativeHandle(ref, () => _this.charts);

  const { width, height } = useSize(rootRef);

  useEffect(() => {
    if (rootRef.current) {
      _this.charts = echarts.init(rootRef.current);

      if (event2Arguments) {
        event2Arguments.forEach((item) => {
          _this.charts?.on(...item);
        });
      }
      // if (event3Arguments) {
      //   event3Arguments.forEach((item) => {
      //     _this.charts?.on(...item);
      //   });
      // }
    }
    return () => {
      _this.charts?.dispose();
      _this.charts = undefined;
    };
  }, []);

  useEffect(() => {
    if (_this.charts && options) {
      _this.charts.setOption(options);
    }
  }, [_this.charts, options]);

  const debounceResize = useDebounceFn(
    () => {
      if (_this.charts) {
        _this.charts.resize();
      }
    },
    { wait: 500 },
  );

  useEffect(() => {
    debounceResize.run();
  }, [width, height, debounceResize]);

  return <div ref={rootRef} className={`${className}`} {...otherProps} />;
};

export default forwardRef(Charts);
