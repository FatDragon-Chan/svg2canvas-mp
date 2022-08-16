import { createContext } from 'react';
import { PaintInspectionBasicContext, PaintInspectionScratchContext } from './types';

export const PaintBasicContext = createContext<PaintInspectionBasicContext>({
  paintBasicForm: {
    plate_number: '',
    vin: '',
    plate: '',
    province: '',
    showKeyboard: false,
  },
  setPaintBasicForm: () => {},
}); // PaintInspectionBasicForm 初始值

export const PaintScratchContext = createContext<PaintInspectionScratchContext>({
  scratch: {
    damage: [],
    image_urls: [],
  },
  setScratch: () => {},
});
