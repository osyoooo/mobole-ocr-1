'use client';

import { useEffect, useRef, useState } from 'react';

const OCR_STRIP_ASPECT_RATIO = 64 / 930;

export function CameraCapture({ onCapture, onCancel }: { onCapture: (dataUrl: string) => void; onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1080 }, height: { ideal: 1920 } }, audio: false })
      .then((stream) => {
        if (!mounted) return;
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError('カメラを起動できませんでした。画像選択を利用してください。'));
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    const sourceAspectRatio = video.videoWidth / video.videoHeight;
    const cropWidth = sourceAspectRatio > OCR_STRIP_ASPECT_RATIO ? Math.round(video.videoHeight * OCR_STRIP_ASPECT_RATIO) : video.videoWidth;
    const cropHeight = sourceAspectRatio > OCR_STRIP_ASPECT_RATIO ? video.videoHeight : Math.round(video.videoWidth / OCR_STRIP_ASPECT_RATIO);
    const sx = Math.max(0, Math.round((video.videoWidth - cropWidth) / 2));
    const sy = Math.max(0, Math.round((video.videoHeight - cropHeight) / 2));

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    canvas.getContext('2d')?.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    onCapture(canvas.toDataURL('image/jpeg', 0.92));
  };

  return (
    <section className="card camera-card">
      {error ? (
        <p className="notice">{error}</p>
      ) : (
        <div className="camera-frame" aria-label="OCR対象列を合わせる撮影ガイド">
          <video ref={videoRef} className="video" autoPlay playsInline muted />
          <div className="form-guide" aria-hidden="true">
            <span className="guide-corner top-left" />
            <span className="guide-corner top-right" />
            <span className="guide-corner bottom-left" />
            <span className="guide-corner bottom-right" />
            <span className="guide-label">OCR列を合わせる</span>
          </div>
        </div>
      )}
      <div className="actions">
        <button className="button" onClick={capture} disabled={Boolean(error)}>撮影する</button>
        <button className="button ghost" onClick={onCancel}>戻る</button>
      </div>
    </section>
  );
}
