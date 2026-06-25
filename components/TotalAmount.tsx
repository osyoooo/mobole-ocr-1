import { formatYen } from '../lib/calc';

export function TotalAmount({ total, totalQuantity }: { total: number; totalQuantity: number }) {
  return (
    <div className="total" aria-live="polite">
      <div className="total-grid">
        <div>
          <div className="label">合計冊数</div>
          <div className="quantity-total">{totalQuantity}冊</div>
        </div>
        <div>
          <div className="label">合計金額</div>
          <div className="amount">{formatYen(total)}</div>
        </div>
      </div>
    </div>
  );
}
