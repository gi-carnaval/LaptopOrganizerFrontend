import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

interface UseQrScannerProps {
  onScanSuccess: (result: QrScanner.ScanResult) => void;
  onScanFail?: (err: string | Error) => void;
}

export const useQrScanner = ({ onScanSuccess, onScanFail }: UseQrScannerProps) => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  useEffect(() => {
    if (videoEl.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });
      scanner.current.setInversionMode('both');
      scanner.current.start().then(() => setQrOn(true)).catch(() => setQrOn(false));
    }

    return () => {
      scanner.current?.stop();
    };
  }, [onScanSuccess, onScanFail]);

  useEffect(() => {
    if (!qrOn) {
      alert('Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.');
    }
  }, [qrOn]);

  return { videoEl, qrBoxEl, qrOn };
};
