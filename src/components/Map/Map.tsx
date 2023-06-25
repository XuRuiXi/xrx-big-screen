/* eslint-disable no-case-declarations */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'umi';
import styles from './Map.less';

interface Props {
  onInit: (bridge: unknown) => void; // 地图初始化完成后返回地图实例；
}

const Map = (props: Props) => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { onInit } = props;
  useEffect(() => {
    // const mapURL = 'http://10.203.0.37/citygis/citymap/WidgetPages/WidgetGIS.html?code=420606007&mapthemeid=yaogantheme&devicetype=lg&isFlyScene=false';
    const mapURL =
      'http://10.203.0.37/citygis/citymap/WidgetPages/WidgetGIS.html?isFlyScene=false&maptype=3d&code=420606&devicetype=lg&themeid=Gis';
    try {
      // eslint-disable-next-line
      const bridge = new window.CityGis.Bridge({
        id: 'map',
        url: mapURL,
        onReady: () => {
          if (!mapRef.current) {
            mapRef.current = bridge;
            onInit(bridge);
            bridge.Invoke([
              {
                ActionName: 'padding',
                Parameters: {
                  isUI: true,
                  // left: 3000,
                  bottom: 60,
                },
              },
            ]);
          }
        },
      });
      bridge.addEventListener((arg) => {
        const { action, data } = arg;
        switch (action) {
          case 'mapclick':
            // console.log("点击触发:", data);
            // 地图点选消息
            const { giscamera, ...rowData } = data ?? {};
            const [[type, vals] = []] = Object.entries(rowData);
            const [{ x, y, is_important: isImportant }] = vals;
            if (type?.includes('案件')) {
              if (+global.curCasePoint?.x === +x && +global.curCasePoint?.y === +y) {
                // 取消案件定位，恢复案件撒点
                dispatch({
                  type: 'map/sprinkleCases',
                });
                global.curCasePoint = {};
                document.dispatchEvent(
                  new CustomEvent('clickCancel', { detail: { type, data: vals?.[0] }}),
                );
              } else {
                dispatch({
                  type: 'map/goToCasePoint',
                  point: { x, y },
                  isImportant: isImportant === '1',
                });
                document.dispatchEvent(
                  new CustomEvent('mapClick', { detail: { type, data: vals?.[0] }}),
                );
              }
            }
            break;
          case 'ResetMap':
            // 地图重置完成消息
            break;
          case 'changeTheme':
            // 地图主题切换消息
            break;
          case 'Clear':
            // 地图清空消息
            break;
          case 'DrawGraphic':
            // 空间分析
            break;
          case 'userSketch':
            // 标绘
            break;
          default:
            break;
        }
      }, this);
    } catch (error) {
      // console.log(error);
    }
  }, []);

  return <div className={styles.root} id="map" />;
};

export default Map;
