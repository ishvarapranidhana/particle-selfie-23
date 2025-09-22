import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Layers, Eye, EyeOff, Blend } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ColorControlsProps {
  motionParticlesColor: string;
  nonMovingParticlesColor: string;
  backgroundParticlesColor: string;
  staticParticlesColor: string;
  backgroundColor: string;
  showMotionParticles: boolean;
  showBackgroundParticles: boolean;
  showStaticParticles: boolean;
  hideNonMovingParticles: boolean;
  motionBlendMode: string;
  backgroundBlendMode: string;
  staticBlendMode: string;
  enableBlendMode: boolean;
  layerOrder: string[];
  onMotionParticlesColorChange: (color: string) => void;
  onNonMovingParticlesColorChange: (color: string) => void;
  onBackgroundParticlesColorChange: (color: string) => void;
  onStaticParticlesColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onToggleMotionParticles: (show: boolean) => void;
  onToggleBackgroundParticles: (show: boolean) => void;
  onToggleStaticParticles: (show: boolean) => void;
  onToggleHideNonMovingParticles: (show: boolean) => void;
  onMotionBlendModeChange: (mode: string) => void;
  onBackgroundBlendModeChange: (mode: string) => void;
  onStaticBlendModeChange: (mode: string) => void;
  onToggleBlendMode: (enabled: boolean) => void;
  onLayerOrderChange: (order: string[]) => void;
}

const presetColors = [
  { name: 'Electric Blue', value: '#60A5FA' },
  { name: 'Neon Purple', value: '#A78BFA' },
  { name: 'Cyber Cyan', value: '#00FFFF' },
  { name: 'Plasma Pink', value: '#F472B6' },
  { name: 'Matrix Green', value: '#4ADE80' },
  { name: 'Solar Yellow', value: '#FDE047' },
  { name: 'Cosmic White', value: '#FFFFFF' },
  { name: 'Fire Orange', value: '#FB923C' },
];

const backgroundColors = [
  { name: 'Deep Space', value: '#0A0E1A' },
  { name: 'Midnight Blue', value: '#0F172A' },
  { name: 'Purple Void', value: '#1E0B2E' },
  { name: 'Dark Ocean', value: '#042F3D' },
  { name: 'Black Hole', value: '#000000' },
  { name: 'Dark Gray', value: '#1F1F1F' },
];

const blendModes = [
  { name: 'Normal', value: 'normal' },
  { name: 'Multiply', value: 'multiply' },
  { name: 'Screen', value: 'screen' },
  { name: 'Overlay', value: 'overlay' },
  { name: 'Darken', value: 'darken' },
  { name: 'Lighten', value: 'lighten' },
  { name: 'Color Dodge', value: 'color-dodge' },
  { name: 'Color Burn', value: 'color-burn' },
  { name: 'Hard Light', value: 'hard-light' },
  { name: 'Soft Light', value: 'soft-light' },
  { name: 'Difference', value: 'difference' },
  { name: 'Exclusion', value: 'exclusion' },
];

export default function ColorControls({
  motionParticlesColor,
  nonMovingParticlesColor,
  backgroundParticlesColor,
  staticParticlesColor,
  backgroundColor,
  showMotionParticles,
  showBackgroundParticles,
  showStaticParticles,
  hideNonMovingParticles,
  motionBlendMode,
  backgroundBlendMode,
  staticBlendMode,
  enableBlendMode,
  layerOrder,
  onMotionParticlesColorChange,
  onNonMovingParticlesColorChange,
  onBackgroundParticlesColorChange,
  onStaticParticlesColorChange,
  onBackgroundColorChange,
  onToggleMotionParticles,
  onToggleBackgroundParticles,
  onToggleStaticParticles,
  onToggleHideNonMovingParticles,
  onMotionBlendModeChange,
  onBackgroundBlendModeChange,
  onStaticBlendModeChange,
  onToggleBlendMode,
  onLayerOrderChange,
}: ColorControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const renderParticleLayer = (
    title: string,
    description: string,
    currentColor: string,
    isEnabled: boolean,
    onColorChange: (color: string) => void,
    onToggle: (enabled: boolean) => void,
    icon: React.ReactNode,
    blendMode: string,
    onBlendModeChange: (mode: string) => void,
    layerId: string
  ) => (
    <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <Label className="text-sm font-medium">{title}</Label>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEnabled ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
          />
        </div>
      </div>
      
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <div className="flex gap-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-12 h-8 rounded border border-border cursor-pointer"
            />
            <div className="flex-1 text-xs text-muted-foreground flex items-center">
              {currentColor}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5">
            {presetColors.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onColorChange(preset.value)}
                className={cn(
                  "h-8 rounded border-2 transition-all",
                  currentColor === preset.value ? "border-primary" : "border-border/30"
                )}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
          </div>
          
          {enableBlendMode && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blend Mode</Label>
              <Select value={blendMode} onValueChange={onBlendModeChange}>
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select blend mode" />
                </SelectTrigger>
                <SelectContent>
                  {blendModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Layer Order</Label>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = layerOrder.indexOf(layerId);
                  if (currentIndex > 0) {
                    const newOrder = [...layerOrder];
                    [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
                    onLayerOrderChange(newOrder);
                  }
                }}
                className="h-6 w-6 p-0"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = layerOrder.indexOf(layerId);
                  if (currentIndex < layerOrder.length - 1) {
                    const newOrder = [...layerOrder];
                    [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
                    onLayerOrderChange(newOrder);
                  }
                }}
                className="h-6 w-6 p-0"
              >
                ↓
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-4 right-4 z-30"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="group relative overflow-hidden bg-gradient-aurora text-primary-foreground hover:shadow-glow transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            {isOpen ? 'Close' : 'Layers'}
          </span>
        </Button>
      </motion.div>
      
      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-20 right-4 z-30 w-96 max-h-[80vh] overflow-y-auto rounded-2xl bg-gradient-panel backdrop-blur-xl border border-border shadow-panel"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" />
                  Particle Layers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Control each layer independently
                </p>
              </div>
              
              {/* Motion Particles Layer */}
              {renderParticleLayer(
                'Motion Particles',
                'Interactive particles that respond to camera movement',
                motionParticlesColor,
                showMotionParticles,
                onMotionParticlesColorChange,
                onToggleMotionParticles,
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />,
                motionBlendMode,
                onMotionBlendModeChange,
                'motion'
              )}
              
              {/* Non-Moving Particles Color */}
              {showMotionParticles && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Non-Moving Particles</Label>
                      <p className="text-xs text-muted-foreground">Color for static areas</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hideNonMovingParticles ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-green-500" />}
                      <Switch
                        checked={!hideNonMovingParticles}
                        onCheckedChange={(checked) => onToggleHideNonMovingParticles(!checked)}
                      />
                    </div>
                  </div>
                  
                  {!hideNonMovingParticles && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={nonMovingParticlesColor}
                          onChange={(e) => onNonMovingParticlesColorChange(e.target.value)}
                          className="w-12 h-8 rounded border border-border cursor-pointer"
                        />
                        <div className="flex-1 text-xs text-muted-foreground flex items-center">
                          {nonMovingParticlesColor}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1.5">
                        {presetColors.map((preset) => (
                          <motion.button
                            key={preset.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNonMovingParticlesColorChange(preset.value)}
                            className={cn(
                              "h-8 rounded border-2 transition-all",
                              nonMovingParticlesColor === preset.value ? "border-primary" : "border-border/30"
                            )}
                            style={{ backgroundColor: preset.value }}
                            title={preset.name}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              <Separator />

              {/* Static Particles Layer */}
              {renderParticleLayer(
                'Static Particles',
                'Ambient particles in the middle layer',
                staticParticlesColor,
                showStaticParticles,
                onStaticParticlesColorChange,
                onToggleStaticParticles,
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />,
                staticBlendMode,
                onStaticBlendModeChange,
                'static'
              )}

              <Separator />

              {/* Background Particles Layer */}
              {renderParticleLayer(
                'Background Particles',
                'Atmospheric particles in the back layer',
                backgroundParticlesColor,
                showBackgroundParticles,
                onBackgroundParticlesColorChange,
                onToggleBackgroundParticles,
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-600" />,
                backgroundBlendMode,
                onBackgroundBlendModeChange,
                'background'
              )}

              <Separator />

              {/* Scene Background */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Scene Background
                </Label>
                
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => onBackgroundColorChange(e.target.value)}
                    className="w-12 h-8 rounded border border-border cursor-pointer"
                  />
                  <div className="flex-1 text-xs text-muted-foreground flex items-center">
                    {backgroundColor}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {backgroundColors.map((preset) => (
                    <motion.button
                      key={preset.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onBackgroundColorChange(preset.value)}
                      className={cn(
                        "h-8 rounded border-2 transition-all",
                        backgroundColor === preset.value ? "border-primary" : "border-border/30"
                      )}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Global Blend Mode Controls */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Blend className="w-4 h-4 text-accent" />
                    <div>
                      <Label className="text-sm font-medium">Per-Layer Blending</Label>
                      <p className="text-xs text-muted-foreground">Enable individual blend modes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {enableBlendMode ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    <Switch
                      checked={enableBlendMode}
                      onCheckedChange={onToggleBlendMode}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Actions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onMotionParticlesColorChange('#60A5FA');
                      onNonMovingParticlesColorChange('#374151');
                      onStaticParticlesColorChange('#EC4899');
                      onBackgroundParticlesColorChange('#A855F7');
                      onBackgroundColorChange('#0A0E1A');
                    }}
                    className="text-xs"
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const colors = presetColors;
                      onMotionParticlesColorChange(colors[Math.floor(Math.random() * colors.length)].value);
                      onNonMovingParticlesColorChange(colors[Math.floor(Math.random() * colors.length)].value);
                      onStaticParticlesColorChange(colors[Math.floor(Math.random() * colors.length)].value);
                      onBackgroundParticlesColorChange(colors[Math.floor(Math.random() * colors.length)].value);
                    }}
                    className="text-xs"
                  >
                    Random Colors
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onToggleMotionParticles(true);
                      onToggleStaticParticles(true);
                      onToggleBackgroundParticles(true);
                    }}
                    className="text-xs"
                  >
                    Show All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onToggleMotionParticles(false);
                      onToggleStaticParticles(false);
                      onToggleBackgroundParticles(false);
                    }}
                    className="text-xs"
                  >
                    Hide All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}