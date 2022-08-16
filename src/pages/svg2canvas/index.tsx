import { useState, useEffect } from 'react';
import { Canvas, View } from '@tarojs/components';
import { useReady } from '@tarojs/taro';
import classNames from "classnames";

import { ScratchInfosCase, ScratchInfosItems, scratchInfosCaseEnum, PaintInspectionScratch } from './types';
import { getContainer } from './canvasClass/helpers';
import {
  EventNames, Stage, Path, Circle, Polygon,
} from './canvasClass/index';
import selectDPath from './config/carSelectAreaConfig';
import baseDPath from './config/carBackgroundConfig';
import './index.less';

let stage;

const Svg2Canvas = () => {

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupDamagePlace, setPopupDamagePlace] = useState(0);
  const [scratch, setScratch] = useState<PaintInspectionScratch>({
    damage: [],
    image_urls: [],
  });
  const touchstart = (event) => {
    stage.touchStartHandler(event);
  };
  const touchend = (event) => {
    stage.touchEndHandler(event);
  };

  const updateScratch = (damage: {place: number, case: ScratchInfosCase}) => {
    const damageList = scratch.damage.map(el => {
      if (el.place === damage.place) {
        return {
          place: el.place,
          case: damage.case,
        };
      }
      return el;
    });
    setScratch({
      ...scratch,
      damage: [...damageList],
    });
  };

  const pushScratch = (damage: {place: number, case: ScratchInfosCase}) => {
    setScratch({
      ...scratch,
      damage: [...scratch.damage, damage],
    });
  };

  const setDamage = (damage: ScratchInfosItems) => {
    if (scratch.damage.find(el => el.place === damage.place)) {
      updateScratch(damage);
    } else {
      pushScratch(damage);
    }
  };

  const handleShowDamagePopup = (place) => {
    if (popupVisible) return;
    setPopupVisible(true);
    setPopupDamagePlace(place);
  };

  const handleCloseDamagePopup = () => {
    setPopupVisible(false);
    setPopupDamagePlace(0);
  };

  const handleSelectDamage = (damageType) => {
    const damage = { place: popupDamagePlace, case: damageType.key };
    setDamage(damage);
    handleCloseDamagePopup();
  };

  // eslint-disable-next-line max-len
  const checkPlaceInDamage = (place): boolean => place && !!scratch.damage.find(el => el.place === place);

  const guideRender = (needRenderList) => {
    needRenderList.forEach(step => {
      step.renderProps.forEach(render => {
        switch (render.type) {
          case 'path':
            // eslint-disable-next-line no-use-before-define
            renderPath({ ...render, place: step.place });
            break;
          case 'circle':
            // eslint-disable-next-line no-use-before-define
            renderCircle({ ...render, place: step.place });
            break;
          case 'polygon':
            // eslint-disable-next-line no-use-before-define
            renderPolygon({ ...render, place: step.place });
            break;
          default:
            break;
        }
      });
    });
  };

  const renderPath = (renderProp) => {
    const {
      d, translate, place = 0, fill, id = '',
    } = renderProp;
    let fillColor: string;
    const isPlaceInDamage = checkPlaceInDamage(place);
    if (place && id === 'clickArea') {
      fillColor = isPlaceInDamage || popupDamagePlace === place ? fill : '#F4F5F6';
    } else {
      fillColor = fill;
    }
    const path = new Path({ fillColor, d, translate });

    // 添加事件，此时隐藏的canvas会生成一个同等大小的区域
    if (place && id === 'clickArea') {
      path.on(EventNames.click, () => { handleShowDamagePopup(place); });
    }
    // 判断是否是点击区域
    if (id !== 'clickArea' && id !== 'show' && !isPlaceInDamage && place && place !== popupDamagePlace) {
      return;
    }
    stage.add(path);
  };

  const renderCircle = (step) => {
    const {
      fill, translate, cx, cy, radius, place,
    } = step;
    const circle = new Circle({
      fillColor: fill, x: cx, y: cy, radius, translate,
    });
    const isPlaceInDamage = checkPlaceInDamage(place);
    if (!isPlaceInDamage && place && place !== popupDamagePlace) {
      return;
    }
    stage.add(circle);
  };

  const renderPolygon = (step) => {
    const {
      fill, translate, points, place,
    } = step;
    const polygon = new Polygon({
      fillColor: fill, points, translate,
    });
    const isPlaceInDamage = checkPlaceInDamage(place);
    if (!isPlaceInDamage && place && place !== popupDamagePlace) {
      return;
    }
    stage.add(polygon);
  };

  const stageAddGroup = () => {
    guideRender(selectDPath);
  };

  const stageAddBackground = () => {
    guideRender(baseDPath);
  };

  const initCanvas = async () => {
    const canvas = await getContainer('#canvas');
    const osCanvas = await getContainer('#hitCanvas');
    stage = new Stage(canvas, osCanvas);
    stageAddBackground();
    stageAddGroup();
    stage.render();
  };

  const updateCanvas = () => {
    if (!stage) {
      setTimeout(updateCanvas, 100);
      return;
    }
    stage.clear();
    stageAddBackground();
    stageAddGroup();
    stage.render();
  };

  const cleanUp = () => {
    // 清除声明实例，避免再次进入时因为stage 的变量提升导致不走renderCanvas
    stage = undefined;
  };

  const getSelectedPlaceCase = (key) => {
    const popupScratch = scratch.damage.find(el => el.place === popupDamagePlace);
    return popupScratch && popupScratch.case === key;
  };

  useReady(async () => {
    await initCanvas();
  });

  useEffect(() => {
    updateCanvas();
  }, [scratch.damage, popupDamagePlace]);

  useEffect(cleanUp, []);

  // @ts-ignore
  // @ts-ignore
  return (
    <View className='paint-inspection-car'>
      <Canvas
        onTouchEnd={touchend}
        onTouchStart={touchstart}
        className='canvas'
        id='canvas'
        type='2d'
        style={{ width: '320px' }}
      />
      {/* 隐藏的点击canvas */}
      <Canvas
        className='hit-canvas'
        id='hitCanvas'
        type='2d'
        style={{ width: '320px' }}
      />
      {popupVisible && (
        <View className='damage-popup__mask' onClick={handleCloseDamagePopup}>
          <View className='damage-popup__content' catchMove>
            <View className='damage-popup__title'>
              请选择受损情况
              <View className='damage-popup__close' onClick={handleCloseDamagePopup} />
            </View>
            {
              scratchInfosCaseEnum.map(item => (
                <View className={classNames('damage-popup__item', { 'damage-popup__item-selected': getSelectedPlaceCase(item.key) })} onClick={() => { handleSelectDamage(item); }}>
                  {item.popupValue}
                </View>
              ))
            }
          </View>
        </View>
      )}
    </View>
  );
};

export default Svg2Canvas
