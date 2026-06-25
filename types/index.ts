export type Book = { no: number; name: string; price: number };
export type QuantityMap = Record<number, number>;
export type OcrResult = { quantities: number[]; cellImages: string[] };
export type AppStep = 'home' | 'camera' | 'ocr' | 'confirm';
