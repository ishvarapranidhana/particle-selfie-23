import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraViewProps {
  onVideoReady: (videoRef: React.RefObject<HTMLVideoElement>) => void;
}

export default function CameraView({ onVideoReady }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        setHasPermission(true);
        onVideoReady(videoRef);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please check your permissions.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };
  
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      {/* Hidden video element for processing */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />
      
      {/* Camera controls */}
      <AnimatePresence mode="wait">
        {!isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-panel backdrop-blur-lg border border-border shadow-panel">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-aurora bg-clip-text text-transparent">
                  Particle Vision
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Transform yourself into thousands of interactive particles through your camera
                </p>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}
              
              <Button
                onClick={startCamera}
                size="lg"
                className="group relative overflow-hidden bg-gradient-aurora text-primary-foreground hover:shadow-glow transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Enable Camera
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-glow"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Your camera feed is processed locally and never leaves your device
              </p>
            </div>
          </motion.div>
        )}
        
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-4 left-4 z-20"
          >
            <Button
              onClick={stopCamera}
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 hover:shadow-button"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}