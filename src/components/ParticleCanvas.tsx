import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface ParticleCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  motionParticlesColor: string;
  nonMovingParticlesColor: string;
  backgroundParticlesColor: string;
  staticParticlesColor: string;
  backgroundColor: string;
  showMotionParticles: boolean;
  showBackgroundParticles: boolean;
  showStaticParticles: boolean;
  hideNonMovingParticles: boolean;
  motionBlendMode?: string;
  backgroundBlendMode?: string;
  staticBlendMode?: string;
  enableBlendMode: boolean;
}

// Helper function to get THREE.js blend mode
const getBlending = (mode?: string, enableBlendMode?: boolean) => {
  if (!enableBlendMode || !mode) return THREE.AdditiveBlending;
  
  switch (mode) {
    case 'multiply': return THREE.MultiplyBlending;
    case 'screen': return THREE.AdditiveBlending;
    case 'normal': return THREE.NormalBlending;
    default: return THREE.AdditiveBlending;
  }
};

// Background particle plane (farthest back)
function BackgroundParticles({ 
  particleColor, 
  blendMode, 
  enableBlendMode 
}: { 
  particleColor: string; 
  blendMode?: string; 
  enableBlendMode: boolean; 
}) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  const [positions, colors] = useMemo(() => {
    const particleCount = 20000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Create a grid of particles in the background
    const gridSize = Math.sqrt(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Spread particles across X-Y plane with some randomness
      positions[i3] = (col / gridSize - 0.5) * 15 + (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = (row / gridSize - 0.5) * 12 + (Math.random() - 0.5) * 0.5;
      positions[i3 + 2] = -8 + (Math.random() - 0.5) * 0.5; // Farthest back
      
      colors[i3] = 0.3;
      colors[i3 + 1] = 0.3;
      colors[i3 + 2] = 0.5;
    }
    
    return [positions, colors];
  }, []);
  
  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const colors = meshRef.current.geometry.attributes.color.array as Float32Array;
    const color = new THREE.Color(particleColor);
    
    // Update material color
    materialRef.current.color = color;
    
    // Gentle floating animation for background particles
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      const baseY = (Math.floor(i / Math.sqrt(positions.length / 3)) / Math.sqrt(positions.length / 3) - 0.5) * 12;
      
      // Gentle wave motion
      positions[i3 + 1] = baseY + Math.sin(time * 0.5 + i * 0.01) * 0.2;
      
      // Subtle pulsing in brightness
      const pulse = Math.sin(time + i * 0.02) * 0.2 + 0.3;
      colors[i3] = pulse;
      colors[i3 + 1] = pulse * 0.8;
      colors[i3 + 2] = pulse * 1.2;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.015}
        vertexColors
        blending={getBlending(blendMode, enableBlendMode)}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Static particles (middle layer)
function StaticParticles({ 
  particleColor, 
  blendMode, 
  enableBlendMode 
}: { 
  particleColor: string; 
  blendMode?: string; 
  enableBlendMode: boolean; 
}) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  const [positions, colors] = useMemo(() => {
    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const gridSize = Math.sqrt(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Spread particles across X-Y plane
      positions[i3] = (col / gridSize - 0.5) * 12 + (Math.random() - 0.5) * 0.3;
      positions[i3 + 1] = (row / gridSize - 0.5) * 10 + (Math.random() - 0.5) * 0.3;
      positions[i3 + 2] = -2 + (Math.random() - 0.5) * 0.3; // Middle layer
      
      colors[i3] = 0.8;
      colors[i3 + 1] = 0.8;
      colors[i3 + 2] = 0.9;
    }
    
    return [positions, colors];
  }, []);
  
  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const colors = meshRef.current.geometry.attributes.color.array as Float32Array;
    const color = new THREE.Color(particleColor);
    
    // Update material color
    materialRef.current.color = color;
    
    // Subtle static motion
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Gentle rotation and pulsing
      const angle = time * 0.2 + i * 0.01;
      const pulse = Math.sin(time * 0.8 + i * 0.03) * 0.1 + 0.8;
      
      colors[i3] = pulse * 0.9;
      colors[i3 + 1] = pulse * 0.9;
      colors[i3 + 2] = pulse;
    }
    
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.02}
        vertexColors
        blending={getBlending(blendMode, enableBlendMode)}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Motion particles (closest to camera)
function MotionParticles({ 
  videoRef, 
  particleColor, 
  nonMovingParticleColor, 
  hideNonMovingParticles,
  blendMode,
  enableBlendMode
}: { 
  videoRef: React.RefObject<HTMLVideoElement>; 
  particleColor: string; 
  nonMovingParticleColor: string;
  hideNonMovingParticles: boolean;
  blendMode?: string;
  enableBlendMode: boolean;
}) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  // Dynamic particle grid that adapts to video aspect ratio
  const [positions, colors, basePositions, videoAspectRatio] = useMemo(() => {
    const particleCount = 45000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    
    // Default aspect ratio, will be updated when video loads
    let aspectRatio = 16 / 9;
    
    const gridSize = Math.sqrt(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Create a flat grid in X-Y plane that respects aspect ratio
      const x = (col / gridSize - 0.5) * 10 * aspectRatio;
      const y = -(row / gridSize - 0.5) * 8;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = 3; // Closest to camera
      
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = 3;
      
      colors[i3] = 1;
      colors[i3 + 1] = 1;
      colors[i3 + 2] = 1;
    }
    
    return [positions, colors, basePositions, aspectRatio];
  }, []);
  
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const motionMapRef = useRef<Float32Array | null>(null);
  
  useEffect(() => {
    canvasRef.current.width = 128; // Higher resolution for better motion detection
    canvasRef.current.height = 128;
    ctxRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
    motionMapRef.current = new Float32Array(128 * 128);
  }, []);
  
  // Advanced contour detection using Canny edge detection
  const cannyEdgeDetection = (imageData: ImageData): Float32Array => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Convert to grayscale
    const gray = new Float32Array(width * height);
    for (let i = 0; i < gray.length; i++) {
      const idx = i * 4;
      gray[i] = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
    }
    
    // Gaussian blur to reduce noise
    const blurred = new Float32Array(width * height);
    const kernel = [1, 4, 6, 4, 1];
    const kernelSum = 16;
    
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        let sum = 0;
        for (let ky = -2; ky <= 2; ky++) {
          for (let kx = -2; kx <= 2; kx++) {
            sum += gray[(y + ky) * width + (x + kx)] * kernel[ky + 2] * kernel[kx + 2];
          }
        }
        blurred[y * width + x] = sum / (kernelSum * kernelSum);
      }
    }
    
    // Sobel gradients
    const magnitude = new Float32Array(width * height);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const gx = 
          -blurred[(y-1) * width + (x-1)] + blurred[(y-1) * width + (x+1)] +
          -2 * blurred[y * width + (x-1)] + 2 * blurred[y * width + (x+1)] +
          -blurred[(y+1) * width + (x-1)] + blurred[(y+1) * width + (x+1)];
        
        const gy = 
          -blurred[(y-1) * width + (x-1)] - 2 * blurred[(y-1) * width + x] - blurred[(y-1) * width + (x+1)] +
          blurred[(y+1) * width + (x-1)] + 2 * blurred[(y+1) * width + x] + blurred[(y+1) * width + (x+1)];
        
        magnitude[y * width + x] = Math.sqrt(gx * gx + gy * gy);
      }
    }
    
    return magnitude;
  };

  useFrame(({ mouse }) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const color = new THREE.Color(particleColor);
    materialRef.current.color = color;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const colors = meshRef.current.geometry.attributes.color.array as Float32Array;
    
    if (videoRef.current && ctxRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      
      // Update canvas size to match video aspect ratio
      const videoAspect = video.videoWidth / video.videoHeight;
      if (videoAspect !== canvas.width / canvas.height) {
        canvas.width = 128;
        canvas.height = Math.round(128 / videoAspect);
        motionMapRef.current = new Float32Array(canvas.width * canvas.height);
      }
      
      // Draw current frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const currentPixels = currentFrame.data;
      
      // Advanced contour detection
      const contours = cannyEdgeDetection(currentFrame);
      
      // Enhanced motion detection with temporal stability
      let totalMotion = 0;
      let motionPixels = 0;
      const motionThreshold = 0.08;
      const staticThreshold = 0.03;
      
      if (prevFrameRef.current && motionMapRef.current) {
        for (let i = 0; i < canvas.width * canvas.height; i++) {
          const pixelIndex = i * 4;
          
          // Calculate motion with weighted color differences
          const diffR = Math.abs(currentPixels[pixelIndex] - prevFrameRef.current[pixelIndex]);
          const diffG = Math.abs(currentPixels[pixelIndex + 1] - prevFrameRef.current[pixelIndex + 1]);
          const diffB = Math.abs(currentPixels[pixelIndex + 2] - prevFrameRef.current[pixelIndex + 2]);
          
          // Weight green channel more heavily (human eye sensitivity)
          const motion = (diffR * 0.299 + diffG * 0.587 + diffB * 0.114) / 255;
          
          // Apply temporal smoothing to reduce noise
          const prevMotion = motionMapRef.current[i] || 0;
          const smoothedMotion = motion * 0.7 + prevMotion * 0.3;
          
          motionMapRef.current[i] = smoothedMotion;
          
          // Only count significant motion
          if (smoothedMotion > motionThreshold) {
            totalMotion += smoothedMotion;
            motionPixels++;
          }
        }
      }
      
      const particlesPerRow = Math.sqrt(positions.length / 3);
      const stepX = canvas.width / particlesPerRow;
      const stepY = canvas.height / particlesPerRow;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        const row = Math.floor(i / particlesPerRow);
        const col = i % particlesPerRow;
        
        const x = Math.floor(col * stepX);
        const y = Math.floor(row * stepY);
        const pixelIndex = (y * canvas.width + x) * 4;
        const mapIndex = y * canvas.width + x;
        
        // Get motion, contour, and color values
        const motion = motionMapRef.current ? motionMapRef.current[mapIndex] : 0;
        const contourStrength = contours[mapIndex];
        const brightness = (currentPixels[pixelIndex] + currentPixels[pixelIndex + 1] + currentPixels[pixelIndex + 2]) / 765;
        
        // Enhanced motion detection: only affect particles where there's actual movement
        const isMoving = motion > motionThreshold;
        const isStaticPixel = motion < staticThreshold;
        
        if (isMoving && contourStrength > 0.1) {
          // Strong motion with contour detection - create dynamic particle movement
          const motionIntensity = Math.min(motion * 2, 1);
          const contourBoost = 1 + contourStrength * 3;
          
          // Directional movement based on contour orientation
          const offsetX = (Math.random() - 0.5) * motionIntensity * contourBoost * 4;
          const offsetY = (Math.random() - 0.5) * motionIntensity * contourBoost * 4;
          
          positions[i3] += (basePositions[i3] + offsetX - positions[i3]) * 0.4;
          positions[i3 + 1] += (basePositions[i3 + 1] + offsetY - positions[i3 + 1]) * 0.4;
          
          // Z-axis movement based on motion intensity
          const zOffset = 1 - motionIntensity * contourBoost * 0.5;
          positions[i3 + 2] += (zOffset - positions[i3 + 2]) * 0.3;
          
          // Enhanced colors for moving contours
          const movingColor = new THREE.Color(particleColor);
          const colorBoost = 1 + contourStrength * 0.8;
          colors[i3] = Math.min(1, movingColor.r * (currentPixels[pixelIndex] / 255) * colorBoost);
          colors[i3 + 1] = Math.min(1, movingColor.g * (currentPixels[pixelIndex + 1] / 255) * colorBoost);
          colors[i3 + 2] = Math.min(1, movingColor.b * (currentPixels[pixelIndex + 2] / 255) * colorBoost);
          
        } else if (isStaticPixel) {
          // Static pixels - return to neutral state faster
          positions[i3] += (basePositions[i3] - positions[i3]) * 0.15;
          positions[i3 + 1] += (basePositions[i3 + 1] - positions[i3 + 1]) * 0.15;
          positions[i3 + 2] += (4 - positions[i3 + 2]) * 0.15;
          
          if (hideNonMovingParticles) {
            // Make non-moving particles transparent
            colors[i3] = 0;
            colors[i3 + 1] = 0;
            colors[i3 + 2] = 0;
          } else {
            // Use non-moving particle color
            const nonMovingColor = new THREE.Color(nonMovingParticleColor);
            colors[i3] = Math.max(0.1, nonMovingColor.r * (currentPixels[pixelIndex] / 255) * 0.6);
            colors[i3 + 1] = Math.max(0.1, nonMovingColor.g * (currentPixels[pixelIndex + 1] / 255) * 0.6);
            colors[i3 + 2] = Math.max(0.1, nonMovingColor.b * (currentPixels[pixelIndex + 2] / 255) * 0.6);
          }
          
        } else {
          // Intermediate motion - gentle movement
          const gentleMotion = motion * 0.5;
          positions[i3] += (basePositions[i3] - positions[i3]) * 0.08;
          positions[i3 + 1] += (basePositions[i3 + 1] - positions[i3 + 1]) * 0.08;
          positions[i3 + 2] += (2 + brightness * 0.2 - positions[i3 + 2]) * 0.08;
          
          // Normal colors - blend between motion and non-motion colors based on motion intensity
          const motionBlend = motion / motionThreshold;
          const movingColor = new THREE.Color(particleColor);
          const nonMovingColor = new THREE.Color(nonMovingParticleColor);
          
          colors[i3] = motionBlend * movingColor.r * (currentPixels[pixelIndex] / 255) + 
                      (1 - motionBlend) * nonMovingColor.r * (currentPixels[pixelIndex] / 255);
          colors[i3 + 1] = motionBlend * movingColor.g * (currentPixels[pixelIndex + 1] / 255) + 
                          (1 - motionBlend) * nonMovingColor.g * (currentPixels[pixelIndex + 1] / 255);
          colors[i3 + 2] = motionBlend * movingColor.b * (currentPixels[pixelIndex + 2] / 255) + 
                          (1 - motionBlend) * nonMovingColor.b * (currentPixels[pixelIndex + 2] / 255);
        }
      }
      
      // Store current frame for next comparison
      prevFrameRef.current = new Uint8ClampedArray(currentPixels);
    } else {
      // Return to base positions when no video
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        positions[i3] += (basePositions[i3] - positions[i3]) * 0.1;
        positions[i3 + 1] += (basePositions[i3 + 1] - positions[i3 + 1]) * 0.1;
        positions[i3 + 2] += (2 - positions[i3 + 2]) * 0.1;
        
        colors[i3] = 0.5;
        colors[i3 + 1] = 0.5;
        colors[i3 + 2] = 0.5;
      }
    }
    
    // Enhanced mouse interaction with distance-based falloff
    const mouseX = mouse.x * 5;
    const mouseY = mouse.y * 5;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      const dx = positions[i3] - mouseX;
      const dy = positions[i3 + 1] - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2.0) {
        const force = Math.pow((2.0 - distance) / 2.0, 2) * 0.05;
        positions[i3] += dx * force;
        positions[i3 + 1] += dy * force;
        
        // Also affect Z position for more 3D interaction
        positions[i3 + 2] += force * 2;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.025}
        vertexColors
        blending={getBlending(blendMode, enableBlendMode)}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleCanvas({ 
  videoRef, 
  motionParticlesColor, 
  nonMovingParticlesColor,
  backgroundParticlesColor, 
  staticParticlesColor,
  backgroundColor,
  showMotionParticles,
  showBackgroundParticles,
  showStaticParticles,
  hideNonMovingParticles,
  motionBlendMode = 'normal',
  backgroundBlendMode = 'normal',
  staticBlendMode = 'normal',
  enableBlendMode
}: ParticleCanvasProps) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
      style={{ 
        background: backgroundColor
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Background particles (farthest) */}
        {showBackgroundParticles && (
          <BackgroundParticles 
            particleColor={backgroundParticlesColor} 
            blendMode={backgroundBlendMode}
            enableBlendMode={enableBlendMode}
          />
        )}
        
        {/* Static particles (middle layer) */}
        {showStaticParticles && (
          <StaticParticles 
            particleColor={staticParticlesColor}
            blendMode={staticBlendMode}
            enableBlendMode={enableBlendMode}
          />
        )}
        
        {/* Motion particles (closest to camera) */}
        {showMotionParticles && (
          <MotionParticles 
            videoRef={videoRef} 
            particleColor={motionParticlesColor}
            nonMovingParticleColor={nonMovingParticlesColor}
            hideNonMovingParticles={hideNonMovingParticles}
            blendMode={motionBlendMode}
            enableBlendMode={enableBlendMode}
          />
        )}
        
        {/* Enhanced Orbit controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={25}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          zoomSpeed={0.8}
          panSpeed={0.8}
          rotateSpeed={0.5}
          makeDefault
        />
      </Canvas>
    </motion.div>
  );
}