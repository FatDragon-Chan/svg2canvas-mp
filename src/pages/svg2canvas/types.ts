export interface PaintInspectionBasic {
  plate_number: string;
  plate: string;
  vin: string;
  province: string;
  service_consultant?: number;
  service_consultant_name?: string;
  showKeyboard: boolean;
}

export interface PaintInspectionBasicContext {
  paintBasicForm: PaintInspectionBasic;
  setPaintBasicForm: any;
}

export type ScratchInfosCase = 1 | 2 | 3
export type ScratchInfosCaseSelect = {
  key: ScratchInfosCase,
  value: string;
  popupValue: string;
}[]

export const scratchInfosCaseEnum: ScratchInfosCaseSelect = [
  {
    key: 1,
    value: '划痕',
    popupValue: '有划痕',
  },
  {
    key: 2,
    value: '变形',
    popupValue: '有变形',
  },
  {
    key: 3,
    value: '划痕 变形',
    popupValue: '既有划痕又有变形',
  },
];

export interface ScratchInfosItems {
  place: number;
  case: ScratchInfosCase;
}

export type ScratchInfos = Array<ScratchInfosItems>

export interface PaintInspectionScratch {
  scratch_cnt?: number;
  deform_cnt?: number;
  damage: ScratchInfos;
  image_urls: string[];
}

export interface PaintInspectionScratchContext {
  scratch: PaintInspectionScratch,
  setScratch: any;
}
