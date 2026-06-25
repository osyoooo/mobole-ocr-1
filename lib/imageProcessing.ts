import { getQuantityCellRect, LAYOUT, toPixelRect } from './layout';

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export async function imageSourceToCanvas(source: Blob | string): Promise<HTMLCanvasElement> {
  const image = new Image();
  image.decoding = 'async';
  image.src = typeof source === 'string' ? source : URL.createObjectURL(source);
  await image.decode();
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  canvas.getContext('2d')?.drawImage(image, 0, 0);
  if (typeof source !== 'string') URL.revokeObjectURL(image.src);
  return canvas;
}

export function preprocessCell(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const scale = 3;
  const canvas = createCanvas(sourceCanvas.width * scale, sourceCanvas.height * scale);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const contrasted = Math.max(0, Math.min(255, (gray - 128) * 1.8 + 128));
    const binary = contrasted < 165 ? 0 : 255;
    data[i] = binary;
    data[i + 1] = binary;
    data[i + 2] = binary;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function cropQuantityCells(imageCanvas: HTMLCanvasElement): HTMLCanvasElement[] {
  return Array.from({ length: LAYOUT.rows }, (_, rowIndex) => {
    const rect = toPixelRect(getQuantityCellRect(rowIndex), imageCanvas.width, imageCanvas.height);
    const cell = createCanvas(rect.width, rect.height);
    cell.getContext('2d')?.drawImage(imageCanvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    return preprocessCell(cell);
  });
}

export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
