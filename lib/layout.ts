export type RelativeRect = { x: number; y: number; width: number; height: number };

// カメラガイドで切り出したOCR用の縦長列（No/申込冊数付近）を基準にした相対座標です。
// 右側に「冊」が写る場合は、rightPrintedUnitTrimで除外します。
export const LAYOUT = {
  quantityColumnX: 0.06,
  quantityColumnWidth: 0.88,
  firstRowY: 0.036,
  rowHeight: 0.0442,
  cellHeight: 0.038,
  rightPrintedUnitTrim: 0.24,
  verticalPadding: 0.1,
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
