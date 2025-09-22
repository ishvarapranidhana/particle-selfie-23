import { useState, useRef, Suspense } from 'react';
import CameraView from '@/components/CameraView';
import ParticleCanvas from '@/components/ParticleCanvas';
import ColorControls from '@/components/ColorControls';
import { motion } from 'framer-motion';

const Index = () => {
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement> | null>(null);
  const [motionParticlesColor, setMotionParticlesColor] = useState('#60A5FA');
  const [nonMovingParticlesColor, setNonMovingParticlesColor] = useState('#374151');
  const [backgroundParticlesColor, setBackgroundParticlesColor] = useState('#A855F7');
  const [staticParticlesColor, setStaticParticlesColor] = useState('#EC4899');
  const [backgroundColor, setBackgroundColor] = useState('#0A0E1A');
  const [showMotionParticles, setShowMotionParticles] = useState(true);
  const [showBackgroundParticles, setShowBackgroundParticles] = useState(true);
  const [showStaticParticles, setShowStaticParticles] = useState(true);
  const [hideNonMovingParticles, setHideNonMovingParticles] = useState(false);
  const [blendMode, setBlendMode] = useState('normal');
  const [enableBlendMode, setEnableBlendMode] = useState(false);
  
  const handleVideoReady = (ref: React.RefObject<HTMLVideoElement>) => {
    setVideoRef(ref);
  };
  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Loading Screen */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground">Loading particle system...</p>
            </motion.div>
          </div>
        }
      >
        {/* Particle Canvas */}
        <ParticleCanvas
          videoRef={videoRef}
          motionParticlesColor={motionParticlesColor}
          nonMovingParticlesColor={nonMovingParticlesColor}
          backgroundParticlesColor={backgroundParticlesColor}
          staticParticlesColor={staticParticlesColor}
          backgroundColor={backgroundColor}
          showMotionParticles={showMotionParticles}
          showBackgroundParticles={showBackgroundParticles}
          showStaticParticles={showStaticParticles}
          hideNonMovingParticles={hideNonMovingParticles}
          blendMode={blendMode}
          enableBlendMode={enableBlendMode}
        />
        
        {/* Camera View */}
        <CameraView onVideoReady={handleVideoReady} />
        
        {/* Color Controls */}
        <ColorControls
          motionParticlesColor={motionParticlesColor}
          nonMovingParticlesColor={nonMovingParticlesColor}
          backgroundParticlesColor={backgroundParticlesColor}
          staticParticlesColor={staticParticlesColor}
          backgroundColor={backgroundColor}
          showMotionParticles={showMotionParticles}
          showBackgroundParticles={showBackgroundParticles}
          showStaticParticles={showStaticParticles}
          hideNonMovingParticles={hideNonMovingParticles}
          blendMode={blendMode}
          enableBlendMode={enableBlendMode}
          onMotionParticlesColorChange={setMotionParticlesColor}
          onNonMovingParticlesColorChange={setNonMovingParticlesColor}
          onBackgroundParticlesColorChange={setBackgroundParticlesColor}
          onStaticParticlesColorChange={setStaticParticlesColor}
          onBackgroundColorChange={setBackgroundColor}
          onToggleMotionParticles={setShowMotionParticles}
          onToggleBackgroundParticles={setShowBackgroundParticles}
          onToggleStaticParticles={setShowStaticParticles}
          onToggleHideNonMovingParticles={setHideNonMovingParticles}
          onBlendModeChange={setBlendMode}
          onToggleBlendMode={setEnableBlendMode}
        />
      </Suspense>
      
      {/* Attribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4 text-xs text-muted-foreground"
      >
        Particle Vision • Transform yourself into art
      </motion.div>
    </div>
  );
};

export default Index;