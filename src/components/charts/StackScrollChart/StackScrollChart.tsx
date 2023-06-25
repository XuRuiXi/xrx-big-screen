/**
 * @description 以条状图形式显示，默认显示六组数据，最终会将全量数据组挨个显示（3秒/组），由上向下滚动
 * */
import React, { useEffect, useState, useRef } from 'react';
import { StackChart } from '../StackChart/chart';
import st from './StackScrollChart.less';
import type { StackChartProps } from '../StackChart/chart';
import LegendChart from './LegendChart';

export interface StackScrollChartProps extends StackChartProps {
  ajustTop?: number; // 随着秒数递增的偏移量，以确保 maxDisplayBar 个一组时，该版数据能完全展示出来
  config?: StackChartProps['config'];
  perBarHeightSpace?: number; // 每个 bar 及其标识占据的垂直空间
  maxDisplayBar?: number; // 滚动一次展示的 bar 数量
}

// interface CurrentExtend extends
// interface RefExtend<T> extends MutableRefObject<T> {
//   current: ;
// }
const StackScrollChart = (props: StackScrollChartProps) => {
  const [second, setSecond] = useState(0);
  // const containerRef = useRef<RefExtend<{ current: { timer: undefined } }>>();
  const containerRef = useRef(null);
  const [startScroll, setStartScroll] = useState(true);
  const {
    className = '',
    data,
    ajustTop = 0,
    perBarHeightSpace = 50,
    config = {},
    maxDisplayBar = 6,
    ...otherProps
  } = props;

  const clearIntervalFunc = () => {
    if (containerRef.current) {
      window.clearInterval(containerRef.current.timer);
    }
  };
  const listLen = data.list.length;
  const chartHeight = listLen * perBarHeightSpace;
  const getCurOffset = curSecond => maxDisplayBar * perBarHeightSpace * curSecond;

  const conditionalUpdateSecond = () => {
    setSecond((prev) => {
      // functional-updates
      if (getCurOffset(prev + 1) < chartHeight) {
        return prev + 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    if (startScroll) {
      clearIntervalFunc();
      const timer = window.setInterval(() => {
        conditionalUpdateSecond();
      }, 3 * 1000);
      if (containerRef.current) {
        containerRef.current.timer = timer;
      }
    }
    return () => {
      clearIntervalFunc();
    };
  }, [startScroll]);

  useEffect(() => () => {}, [second]);
  return (
    <div className={`${st.root} ${className}`}>
      <div className={st.legendChartContainer}>
        <LegendChart
          data={data}
          config={{
            barWidth: 6,
            showTotalValue: false,
            gridTop: 80,
            gridBottom: 0,
            extraLegendConfig: {
              right: '10%',
            },
          }}
          className={st.legendArea}
        />
      </div>
      <div
        className={st.chartArea}
        {...otherProps}
        style={{
          height: maxDisplayBar * perBarHeightSpace, // 显示多少个数据
        }}
        ref={containerRef}
        onMouseEnter={() => {
          clearIntervalFunc();
          conditionalUpdateSecond();
          setStartScroll(false);
        }}
        onMouseLeave={() => {
          setStartScroll(true);
        }}
      >
        <div
          style={{
            width: '100%',
            height: `${chartHeight}px`,
            position: 'absolute',
            top: second ? -getCurOffset(second) + (ajustTop ? second * ajustTop : 0) : 0,
            transition:
            /* getCurOffset(second) !== 0 ? */ 'top .6s ease 0s' /* : 'none .6s ease 0s' */,
          }}
        >
          <StackChart
            data={data}
            config={{
              showLegend: false,
              barWidth: 6,
              showTotalValue: false,
              gridTop: 10,
              gridBottom: 0,
              ...config,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StackScrollChart;
