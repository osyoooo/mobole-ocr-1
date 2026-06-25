'use client';

import { useMemo, useState } from 'react';
import { BOOKS } from '../lib/books';
import { calculateTotal, normalizeQuantity } from '../lib/calc';
import { TotalAmount } from './TotalAmount';

export function QuantityConfirm({ initialQuantities, cellImages, onRetry }: { initialQuantities: number[]; cellImages: string[]; onRetry: () => void }) {
  const [quantities, setQuantities] = useState<number[]>(() => BOOKS.map((_, index) => initialQuantities[index] ?? 0));
  const total = useMemo(() => calculateTotal(quantities), [quantities]);

  const update = (index: number, value: string) => {
    setQuantities((current) => current.map((quantity, i) => (i === index ? normalizeQuantity(value) : quantity)));
  };

  return (
    <section className="card">
      <h1>確認・修正</h1>
      <p className="notice">OCR結果を確認し、誤読があれば冊数を修正してください。小計は表示せず、総合計のみ更新します。</p>
      <div>
        {BOOKS.map((book, index) => (
          <div className="grid row" key={book.no}>
            <strong>No{book.no}</strong>
            <div className="book-name">{book.name}</div>
            <input inputMode="numeric" pattern="[0-9]*" value={quantities[index] || ''} aria-label={`No${book.no} 申込冊数`} onChange={(event) => update(index, event.target.value)} placeholder="0" />
          </div>
        ))}
      </div>
      <TotalAmount total={total} />
      <details>
        <summary>切り出したセル画像を確認</summary>
        <div className="debug-cells">{cellImages.map((src, index) => <img key={src} src={src} alt={`No${index + 1}の切り出し画像`} />)}</div>
      </details>
      <div className="actions"><button className="button ghost" onClick={onRetry}>もう一度撮影</button></div>
    </section>
  );
}
