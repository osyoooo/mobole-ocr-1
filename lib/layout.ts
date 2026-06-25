export type RelativeRect = { x: number; y: number; width: number; height: number };

// 添付された縦長の申込表画像（約487x1063）を基準にした相対座標です。
// 申込冊数列の右側に印字されている「冊」は、rightPrintedUnitTrimで除外します。
export const LAYOUT = {
  quantityColumnX: 0.823,
  quantityColumnWidth: 0.177,
  firstRowY: 0.031,
  rowHeight: 0.044,
  cellHeight: 0.041,
  rightPrintedUnitTrim: 0.38,
  verticalPadding: 0.12,
  rows: 22,
} as const;

export function getQuantityCellRect(rowIndex: number): RelativeRect {
  const usableWidth = LAYOUT.quantityColumnWidth * (1 - LAYOUT.rightPrintedUnitTrim);
  return {
    x: LAYOUT.quantityColumnX,
    y: LAYOUT.firstRowY + rowIndex * LAYOUT.rowHeight + LAYOUT.cellHeight * LAYOUT.verticalPadding,
    width: usableWidth,
    height: LAYOUT.cellHeight * (1 - LAYOUT.verticalPadding * 2),
  };
}

export function toPixelRect(rect: RelativeRect, imageWidth: number, imageHeight: number) {
  return {
    x: Math.round(rect.x * imageWidth),
    y: Math.round(rect.y * imageHeight),
    width: Math.round(rect.width * imageWidth),
    height: Math.round(rect.height * imageHeight),
  };
}
