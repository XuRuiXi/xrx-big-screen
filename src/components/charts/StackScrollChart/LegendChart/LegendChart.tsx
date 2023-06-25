/** @description 借助相同的series生成图例 */
import React from 'react';
import Charts from '../../Charts';
import { getChartOptionsByData } from '../../StackChart/chart';
import type { StackChartProps } from '../../StackChart/chart';

const LegendChart = (props: StackChartProps) => {
  const { className = '', data, config = {}, ...otherProps } = props;
  const legendData = { keys: data.keys, list: [data.list[0]] };
  const opt = getChartOptionsByData(legendData, config);
  return <Charts className={className} options={opt} {...otherProps} />;
};

export default LegendChart;
