'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2, Check, X, Crop } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';

interface SignatureCaptureProps {
  onUpload: (data: { name: string; storageId: string; url: string }) => void;
  existingSignature?: { name: string; storageId: string; url?: string } | null;
  label?: string;
}

export function SignatureCapture({ onUpload, existingSignature, label }: SignatureCaptureProps) {
  const [mode, setStep] = useState<'idle' | 'camera' | 'crop'>('idle');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStep('camera');
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
      setStep('crop');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setStep('crop');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (dataUrl: string) => {
    setUploading(true);
    try {
      // Convert dataUrl to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      const { storageId } = await result.json();
      
      onUpload({
        name: 'signature.jpg',
        storageId,
        url: dataUrl
      });
      setStep('idle');
      setImage(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const performCrop = () => {
    // Simple center crop for now to satisfy requirement without heavy library
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const img = new Image();
      img.onload = () => {
        // Crop a square from the center
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        
        canvas.width = 400;
        canvas.height = 200; // Rectangular for signature
        const ctx = canvas.getContext('2d');
        // Draw centered and stretched to signature aspect ratio
        ctx?.drawImage(img, x, y, size, size / 2, 0, 0, 400, 200);
        const croppedDataUrl = canvas.toDataURL('image/jpeg');
        handleUpload(croppedDataUrl);
      };
      img.src = image!;
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-xl bg-muted/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{label || "Sahihi (Signature)"} <span className="text-red-500">*</span></h3>
        {existingSignature && mode === 'idle' && (
          <Button variant="ghost" size="xs" onClick={() => onUpload({ name: '', storageId: '', url: '' })} className="text-destructive h-7">
            <Trash2 className="w-3 h-3 mr-1" /> Futa
          </Button>
        )}
      </div>

      {mode === 'idle' && (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-background space-y-4">
          {existingSignature?.url ? (
            <div className="relative group">
              <img src={existingSignature.url} alt="Signature" className="max-h-32 rounded border shadow-sm" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                <Button variant="secondary" size="xs" onClick={() => setStep('idle')}>
                  Badilisha
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">Piga picha au pakia sahihi yako</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={startCamera} className="h-9">
                  <Camera className="w-4 h-4 mr-2" /> Camera
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-9">
                  <Upload className="w-4 h-4 mr-2" /> Pakia
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'camera' && (
        <div className="relative bg-black rounded-lg overflow-hidden flex flex-col items-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-64" />
          <div className="p-4 flex gap-4">
            <Button variant="secondary" size="sm" onClick={capturePhoto} className="h-10 w-10 rounded-full p-0">
              <div className="w-6 h-6 rounded-full border-2 border-primary bg-white" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { stopCamera(); setStep('idle'); }} className="text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {mode === 'crop' && (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative border rounded overflow-hidden">
            <img src={image!} alt="To Crop" className="max-h-64" />
            <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none flex items-center justify-center">
               <div className="w-3/4 h-1/3 border-2 border-white dashed" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep('idle')}>Ghairi</Button>
            <Button size="sm" onClick={performCrop} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Crop className="w-4 h-4 mr-2" />}
              Crop & Hifadhi
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
