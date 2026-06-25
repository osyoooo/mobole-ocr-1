'use client';

import { useState } from 'react';
import { CameraCapture } from '../components/CameraCapture';
import { ImageUploader } from '../components/ImageUploader';
import { OcrProgress } from '../components/OcrProgress';
import { QuantityConfirm } from '../components/QuantityConfirm';
import { recognizeQuantities } from '../lib/ocr';
import type { AppStep, OcrResult } from '../types';

export default function Home() {
  const [step, setStep] = useState<AppStep>('home');
  const [progress, setProgress] = useState('準備中...');
  const [result, setResult] = useState<OcrResult>({ quantities: [], cellImages: [] });

  const runOcr = async (image: Blob | string) => {
    setStep('ocr');
    try {
      const ocrResult = await recognizeQuantities(image, setProgress);
      setResult(ocrResult);
      setStep('confirm');
    } catch (error) {
      console.error(error);
      setResult({ quantities: Array(22).fill(0), cellImages: [] });
      setProgress('読み取りに失敗しました。冊数を手入力してください。');
      setStep('confirm');
    }
  };

  return (
    <main className="page">
      {step === 'home' && (
        <section className="card hero">
          <h1 className="title">書籍申込 合計計算</h1>
          <p className="lead">固定レイアウトの申込表からNo1〜No22の申込冊数だけをブラウザ内OCRで読み取り、総合計を計算します。</p>
          <div className="actions">
            <button className="button" onClick={() => setStep('camera')}>カメラを起動</button>
            <ImageUploader onSelect={runOcr} />
          </div>
        </section>
      )}
      {step === 'camera' && <CameraCapture onCapture={runOcr} onCancel={() => setStep('home')} />}
      {step === 'ocr' && <OcrProgress message={progress} />}
      {step === 'confirm' && <QuantityConfirm initialQuantities={result.quantities} cellImages={result.cellImages} onRetry={() => setStep('camera')} />}
    </main>
  );
}
