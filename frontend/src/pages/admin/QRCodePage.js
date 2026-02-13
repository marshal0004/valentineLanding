import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function QRCodePage() {
  const qrRef = useRef(null);
  const publicUrl = window.location.origin + '/';

  const downloadQR = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, {
        quality: 1.0,
        pixelRatio: 4,
        backgroundColor: '#0a0a0a',
      });
      const link = document.createElement('a');
      link.download = 'valentine-qr-code.png';
      link.href = dataUrl;
      link.click();
      toast.success('QR Code downloaded!');
    } catch (err) {
      toast.error('Failed to download QR: ' + err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="font-great-vibes text-4xl text-[#f4e0e0] mb-2">QR Code</h1>
      <p className="text-sm text-[#c9a0a0] mb-8 font-cormorant">
        Print this and include it in your Valentine's card
      </p>

      {/* QR Card */}
      <div
        ref={qrRef}
        className="inline-block p-8 rounded-2xl mx-auto"
        style={{ background: '#0a0a0a' }}
      >
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4">
          <Heart className="w-8 h-8 text-[#ff2d55]" fill="#ff2d55" />
          <p className="font-great-vibes text-2xl text-[#f4e0e0]">Scan Me ❤️</p>
          <div className="p-4 bg-white rounded-xl">
            <QRCodeSVG
              value={publicUrl}
              size={256}
              level="H"
              fgColor="#1a0a10"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-xs text-[#c9a0a0] font-cormorant">{publicUrl}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={downloadQR} className="admin-btn flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </div>

      <p className="text-xs text-[rgba(201,160,160,0.4)] mt-6 font-cormorant">
        Make sure both devices are on the same network if using localhost.
        <br />
        For remote access, replace with your public IP or deploy the project.
      </p>
    </div>
  );
}
