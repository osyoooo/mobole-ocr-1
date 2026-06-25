import { createWorker } from 'tesseract.js';
import { normalizeQuantity } from './calc';
import { canvasToDataUrl, cropQuantityCells, imageSourceToCanvas } from './imageProcessing';
import type { OcrResult } from '@/types';

export async function recognizeQuantities(image: Blob | string, onProgress?: (message: string) => void): Promise<OcrResult> {
  onProgress?.('画像を読み込んでいます...');
  const canvas = await imageSourceToCanvas(image);
  const cells = cropQuantityCells(canvas);
  const cellImages = cells.map(canvasToDataUrl);
  onProgress?.('OCRエンジンを初期化しています...');
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status) onProgress?.(`${m.status} ${Math.round((m.progress || 0) * 100)}%`);
    },
  });
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
    tessedit_pageseg_mode: '7',
  });
  const quantities: number[] = [];
  try {
    for (let i = 0; i < cells.length; i += 1) {
      onProgress?.(`No${i + 1}を読み取り中...`);
      const { data } = await worker.recognize(cells[i]);
      quantities.push(normalizeQuantity(data.text));
    }
  } finally {
    await worker.terminate();
  }
  return { quantities, cellImages };
}
