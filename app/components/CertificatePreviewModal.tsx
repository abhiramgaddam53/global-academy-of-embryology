"use client";

import { X, QrCode } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateUrl: string;
  // Coordinates passed from parent
  layout: {
    nameX: number;
    nameY: number;
    dateX: number;
    dateY: number;
    // New QR Coordinates (Optional)
    qrX?: number; 
    qrY?: number;
  };
}

export default function CertificatePreviewModal({ 
  isOpen, 
  onClose, 
  certificateUrl, 
  layout 
}: CertificatePreviewModalProps) {
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure the displayed image size whenever window resizes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (containerRef.current) {
        setDisplaySize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial measure
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate the Scaling Ratio (Displayed Width / Actual Original Width)
  const scale = imageNaturalSize.width > 0 ? displaySize.width / imageNaturalSize.width : 1;

  // Default QR positions if not provided (top-left corner)
  const qrX = layout.qrX ?? 100;
  const qrY = layout.qrY ?? 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl w-full max-w-5xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Certificate Layout Preview</h3>
            <p className="text-xs text-slate-500">Verify text and QR positioning before saving.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-100 flex justify-center items-start">
           {certificateUrl ? (
             <div className="relative shadow-xl border border-white/50 inline-block">
                
                {/* The Template Image */}
                <img 
                  ref={containerRef as any}
                  src={certificateUrl} 
                  alt="Certificate Template"
                  className="max-w-full h-auto block"
                  style={{ maxHeight: '70vh' }} 
                  onLoad={(e) => {
                    setImageNaturalSize({ 
                      width: e.currentTarget.naturalWidth, 
                      height: e.currentTarget.naturalHeight 
                    });
                    setDisplaySize({
                      width: e.currentTarget.offsetWidth,
                      height: e.currentTarget.offsetHeight
                    });
                  }}
                />

                {/* --- LIVE OVERLAYS --- */}
                
                {/* 1. Student Name */}
                <div 
                  className="absolute text-blue-600 font-bold whitespace-nowrap pointer-events-none origin-left"
                  style={{
                    left: layout.nameX * scale,
                    top: layout.nameY * scale,
                    fontSize: `${Math.max(10, 24 * scale)}px`, 
                    transform: 'translateY(-50%)', 
                    border: '1px dashed rgba(0, 0, 0, 0.5)',
                    backgroundColor: 'rgba(2, 7, 19, 0.1)',
                    padding: '0 4px'
                  }}
                >
                  [Dr. Student Name]
                </div>

                {/* 2. Issue Date */}
                <div 
                  className="absolute text-black font-bold  whitespace-nowrap pointer-events-none origin-left"
                  style={{
                    left: layout.dateX * scale,
                    top: layout.dateY * scale,
                    fontSize: `${Math.max(8, 14 * scale)}px`,
                    transform: 'translateY(-50%)',
                    border: '1px dashed rgba(71, 85, 105, 0.5)',
                    backgroundColor: 'rgba(126, 128, 131, 0.1)',
                    padding: '0 4px'
                  }}
                >
                  {new Date().toLocaleDateString()}
                </div>

                {/* 3. Verification QR Code */}
                <div 
                  className="absolute pointer-events-none origin-center flex items-center justify-center bg-white"
                  style={{
                    left: qrX * scale,
                    top: qrY * scale,
                    width: `${Math.max(30, 80 * scale)}px`, // Base size 80px
                    height: `${Math.max(30, 80 * scale)}px`,
                    transform: 'translate(-50%, -50%)', // Centered on coordinate
                    border: '1px dashed rgba(0, 0, 0, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <QrCode 
                    size={Math.max(20, 60 * scale)} 
                    className="text-slate-900"
                    strokeWidth={1.5}
                  />
                </div>

             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <p>No template uploaded yet.</p>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center bg-white">
           * Text and QR size are simulated. Final PDF output uses high-resolution coordinates.
        </div>
      </div>
    </div>
  );
}