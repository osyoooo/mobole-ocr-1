'use client';

export function ImageUploader({ onSelect }: { onSelect: (file: File) => void }) {
  return (
    <label className="button secondary">
      画像を選択
      <input className="hidden" type="file" accept="image/*" onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) onSelect(file);
      }} />
    </label>
  );
}
