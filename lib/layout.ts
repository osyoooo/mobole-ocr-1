export type RelativeRect = { x: number; y: number; width: number; height: number };

export const LAYOUT = {
  quantityColumnX: 0.77,
  quantityColumnWidth: 0.145,
  firstRowY: 0.188,
  rowHeight: 0.0348,
  cellHeight: 0.0305,
  rightPrintedUnitTrim: 0.25,
  verticalPadding: 0.08,
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
