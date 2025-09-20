import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { VrIcon, RotateCcw, Save, Upload } from 'lucide-react';

// A-Frame import
import 'aframe';

// Declare AFRAME globally for TypeScript
declare global {
  interface Window {
    AFRAME: any;
  }
}

interface ClothingItem {
  id: string;
  item_name: string;
  image_url: string;
  asset_path?: string;
  metadata?: any;
}

interface Avatar {
  id: string;
  name: string;
  model_url: string;
  gender: 'male' | 'female';
}

// Available avatars
const AVATARS: Avatar[] = [
  {
    id: 'avatar1',
    name: 'Default Female',
    model_url: '/avatars/avatar1.glb',
    gender: 'female'
  },
  {
    id: 'avatar2', 
    name: 'Default Male',
    model_url: '/avatars/avatar2.glb',
    gender: 'male'
  }
];

export default function VrTryOn() {
  const { user } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(AVATARS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Load user's items from Supabase
  useEffect(() => {
    if (user) {
      loadUserItems();
    }
  }, [user]);

  // Initialize A-Frame scene
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AFRAME && sceneRef.current) {
      initializeAFrameScene();
    }
  }, [selectedAvatar, selectedItems]);

  const loadUserItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error loading items:', error);
      toast({
        variant: "destructive",
        title: "Error loading items",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAFrameScene = () => {
    if (!sceneRef.current) return;

    // Clear existing content
    sceneRef.current.innerHTML = '';

    // Create A-Frame scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', 'true');
    scene.setAttribute('vr-mode-ui', 'enabled: true');
    scene.setAttribute('webxr', 'requiredFeatures: local-floor; optionalFeatures: bounded-floor');
    scene.setAttribute('background', 'color: #87CEEB');
    
    // Assets
    const assets = document.createElement('a-assets');
    
    // Avatar asset
    const avatarAsset = document.createElement('a-asset-item');
    avatarAsset.setAttribute('id', 'avatar-model');
    avatarAsset.setAttribute('src', selectedAvatar.model_url);
    assets.appendChild(avatarAsset);

    // Clothing texture assets
    selectedItems.forEach((item, index) => {
      if (item.image_url) {
        const textureAsset = document.createElement('a-asset-item');
        textureAsset.setAttribute('id', `texture-${index}`);
        textureAsset.setAttribute('src', item.image_url);
        textureAsset.setAttribute('crossorigin', 'anonymous');
        assets.appendChild(textureAsset);
      }
    });
    
    scene.appendChild(assets);

    // Lighting
    const ambientLight = document.createElement('a-light');
    ambientLight.setAttribute('type', 'ambient');
    ambientLight.setAttribute('color', '#404040');
    scene.appendChild(ambientLight);
    
    const directionalLight = document.createElement('a-light');
    directionalLight.setAttribute('type', 'directional');
    directionalLight.setAttribute('position', '2 4 5');
    directionalLight.setAttribute('color', '#FFFFFF');
    scene.appendChild(directionalLight);

    // Avatar model
    const avatarEntity = document.createElement('a-entity');
    avatarEntity.setAttribute('id', 'avatar');
    avatarEntity.setAttribute('gltf-model', '#avatar-model');
    avatarEntity.setAttribute('position', '0 0 0');
    avatarEntity.setAttribute('rotation', '0 0 0');
    avatarEntity.setAttribute('scale', '1 1 1');
    avatarEntity.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    scene.appendChild(avatarEntity);

    // Clothing items as floating textures (placeholder implementation)
    selectedItems.forEach((item, index) => {
      if (item.image_url) {
        const clothingPreview = document.createElement('a-plane');
        clothingPreview.setAttribute('src', `#texture-${index}`);
        clothingPreview.setAttribute('width', '0.5');
        clothingPreview.setAttribute('height', '0.5');
        clothingPreview.setAttribute('position', `${2 + index * 0.6} 1.5 -1`);
        clothingPreview.setAttribute('look-at', '[camera]');
        scene.appendChild(clothingPreview);
      }
    });

    // Camera
    const cameraRig = document.createElement('a-entity');
    cameraRig.setAttribute('id', 'cameraRig');
    
    const camera = document.createElement('a-camera');
    camera.setAttribute('id', 'camera');
    camera.setAttribute('position', '0 1.6 3');
    camera.setAttribute('look-controls', 'enabled: true');
    camera.setAttribute('wasd-controls', 'enabled: true');
    cameraRig.appendChild(camera);
    
    // VR controllers
    const leftController = document.createElement('a-entity');
    leftController.setAttribute('id', 'leftController');
    leftController.setAttribute('oculus-touch-controls', 'hand: left');
    leftController.setAttribute('vive-controls', 'hand: left');
    cameraRig.appendChild(leftController);
    
    const rightController = document.createElement('a-entity');
    rightController.setAttribute('id', 'rightController');
    rightController.setAttribute('oculus-touch-controls', 'hand: right');
    rightController.setAttribute('vive-controls', 'hand: right');
    cameraRig.appendChild(rightController);
    
    scene.appendChild(cameraRig);

    // Ground plane
    const ground = document.createElement('a-plane');
    ground.setAttribute('position', '0 0 -4');
    ground.setAttribute('rotation', '-90 0 0');
    ground.setAttribute('width', '10');
    ground.setAttribute('height', '10');
    ground.setAttribute('color', '#7BC8A4');
    scene.appendChild(ground);

    sceneRef.current.appendChild(scene);
  };

  const handleItemSelect = (item: ClothingItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(i => i.id === item.id);
      if (isSelected) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const saveOutfit = async () => {
    if (!user || selectedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "No items selected",
        description: "Please select some items to save your outfit"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          avatar_type: selectedAvatar.gender,
          items_used: selectedItems.map(item => ({
            id: item.id,
            item_name: item.item_name,
            image_url: item.image_url,
            category: item.metadata?.category
          })),
          metadata: {
            avatar_id: selectedAvatar.id,
            created_at: new Date().toISOString(),
            item_count: selectedItems.length
          }
        });

      if (error) throw error;

      toast({
        title: "Outfit saved!",
        description: "Your VR outfit has been saved successfully"
      });
    } catch (error: any) {
      console.error('Error saving outfit:', error);
      toast({
        variant: "destructive",
        title: "Error saving outfit",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const enterVRMode = () => {
    if (sceneRef.current) {
      const scene = sceneRef.current.querySelector('a-scene');
      if (scene && scene.enterVR) {
        scene.enterVR();
        setIsVRMode(true);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <VrIcon className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold">VR Try-On Experience</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sign in to access the immersive WebXR virtual try-on experience with A-Frame
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In to Continue
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <VrIcon className="w-10 h-10 text-primary" />
              WebXR VR Try-On
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience virtual fashion in immersive VR using A-Frame and WebXR
            </p>
          </div>

          {/* Avatar Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedAvatar.id} 
                onValueChange={(value) => {
                  const avatar = AVATARS.find(a => a.id === value);
                  if (avatar) setSelectedAvatar(avatar);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an avatar" />
                </SelectTrigger>
                <SelectContent>
                  {AVATARS.map(avatar => (
                    <SelectItem key={avatar.id} value={avatar.id}>
                      {avatar.name} ({avatar.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* VR Scene */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                WebXR Virtual Try-On Scene
                <Button onClick={enterVRMode} className="flex items-center gap-2">
                  <VrIcon className="w-4 h-4" />
                  Enter VR
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={sceneRef}
                className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg overflow-hidden"
              />
              
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItems([])}
                  disabled={selectedItems.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  onClick={saveOutfit}
                  disabled={selectedItems.length === 0 || isSaving}
                  className="gradient-primary text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save VR Outfit'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clothing Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Clothing Items ({selectedItems.length} selected)
                <Button variant="outline" onClick={() => window.location.href = '/upload'}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Items
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading items...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No clothing items found. Upload some items to get started!
                  </p>
                  <Button onClick={() => window.location.href = '/upload'}>
                    Upload Your First Item
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const isSelected = selectedItems.find(i => i.id === item.id);
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected 
                            ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleItemSelect(item)}
                      >
                        <div className="aspect-square">
                          <img 
                            src={item.image_url} 
                            alt={item.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm truncate">
                            {item.item_name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.metadata?.category || 'Uncategorized'}
                          </p>
                          {isSelected && (
                            <p className="text-xs text-primary font-medium mt-1">
                              ✓ Selected
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
