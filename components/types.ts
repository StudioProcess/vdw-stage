export enum MessageTypes {
  setup,

  data,

  newLayout,
  removeCircles,
  makeNonStatic,

  newText,
  newTextWithParams,
  dropText,

  startScreensaver,

  closeBounds,

  makeFullscreen,

  changeBGColor,
  changeFGColor,

  changeGrainDensity,
  changeGrainScale,
  changeGrainAngle,

  changeGravityCircles,
  changeGravityText,

  changeFrictionCircles,
  changeFrictionText,

  changeRestitutionCircles,
  changeRestitutionText,

  updateLayoutConfig,

  setBottomCircles,
  setBottomText,

  updateTextSize,
  updateTextStrokeColor,
  updateTextFillColor,
  updateTextShowFill,

  toggleLogoVisibility,
  toggleLinesVisibility,
  toggleNextUpVisibility,
}

export interface IMessagePackage {
  type: MessageTypes;
  data?: any;
}

export interface ILayoutItem {
  x: number;
  y: number;
  radius: number;
}

export interface ILayoutGeneratorCongfig {
  divisionStep: number;
  cellDivide: number;
  cellFill: number;
  cellTwoDivisions: number;
  showPartial: boolean;
}

export interface IGravityConfig {
  x: number;
  y: number;
  scale: number;
}
