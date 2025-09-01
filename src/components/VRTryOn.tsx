import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Save, RotateCcw, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import 'aframe';
import 'super-hands';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-camera': any;
      'a-light': any;
      'a-plane': any;
      'a-sky': any;
      'a-assets': any;
      'a-asset-item': any;
    }
  }
}

interface ClothingItem {
  id: string;
  item_name: string | null;
  image_url: string | null;
  asset_path?: string | null;
  metadata?: any;
  description?: string | null;
  user_id?: string | null;
  created_at?: string | null;
}

interface PlacedItem {
  item: ClothingItem;
  position: string;
  rotation: string;
  scale: string;
}

export function VRTryOn() {
  const { user } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<PlacedItem[]>([]);
  const [avatarType, setAvatarType] = useState<'male' | 'female'>('female');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      loadUserItems();
    }
  }, [user]);

  const loadUserItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get public URLs for items
        const itemsWithUrls = await Promise.all(
          (data || []).map(async (item): Promise<ClothingItem> => {
            let publicUrl = item.image_url;
            
            if (item.image_url && !item.image_url.startsWith('http')) {
              const { data: urlData } = supabase.storage
                .from('garments')
                .getPublicUrl(item.image_url);
              publicUrl = urlData.publicUrl;
            }

            let assetUrl = item.asset_path;
            if (item.asset_path && !item.asset_path.startsWith('http')) {
              const { data: assetUrlData } = supabase.storage
                .from('garments')
                .getPublicUrl(item.asset_path);
              assetUrl = assetUrlData.publicUrl;
            }

            return {
              id: item.id,
              item_name: item.item_name,
              image_url: publicUrl,
              asset_path: assetUrl,
              metadata: item.metadata,
              description: item.description,
              user_id: item.user_id,
              created_at: item.created_at
            };
          })
        );

      setItems(itemsWithUrls);
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

  const handleItemSelect = (item: ClothingItem) => {
    const defaultPosition = "0 1.5 -1";
    const defaultRotation = "0 0 0";
    const defaultScale = "1 1 1";

    const placedItem: PlacedItem = {
      item,
      position: defaultPosition,
      rotation: defaultRotation,
      scale: defaultScale
    };

    setSelectedItems(prev => {
      const existingIndex = prev.findIndex(p => p.item.id === item.id);
      if (existingIndex >= 0) {
        return prev.filter(p => p.item.id !== item.id);
      } else {
        return [...prev, placedItem];
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
          avatar_type: avatarType,
          items_used: selectedItems.map(placedItem => ({
            id: placedItem.item.id,
            item_name: placedItem.item.item_name,
            image_url: placedItem.item.image_url,
            asset_path: placedItem.item.asset_path,
            position: placedItem.position,
            rotation: placedItem.rotation,
            scale: placedItem.scale,
            category: placedItem.item.metadata?.category
          })),
          metadata: {
            created_at: new Date().toISOString(),
            item_count: selectedItems.length,
            avatar_type: avatarType
          }
        });

      if (error) throw error;

      toast({
        title: "Outfit saved!",
        description: "Your virtual outfit has been saved successfully"
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

  const clearItems = () => {
    setSelectedItems([]);
  };

  const enterVR = () => {
    if (sceneRef.current && sceneRef.current.enterVR) {
      sceneRef.current.enterVR();
      setIsVRMode(true);
    }
  };

  const nextCarouselItems = () => {
    setCarouselIndex(prev => Math.min(prev + 4, items.length - 4));
  };

  const prevCarouselItems = () => {
    setCarouselIndex(prev => Math.max(prev - 4, 0));
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Sign in to use VR Try-On</h3>
        <p className="text-muted-foreground">
          Create an account to upload items and create virtual outfits
        </p>
      </div>
    );
  }

  const visibleItems = items.slice(carouselIndex, carouselIndex + 4);

  return (
    <div className="space-y-6">
      {/* VR Scene */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>VR Try-On Studio</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAvatarType(avatarType === 'male' ? 'female' : 'male')}
              >
                {avatarType === 'male' ? 'Switch to Female' : 'Switch to Male'}
              </Button>
              <Button onClick={enterVR} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Eye className="w-4 h-4 mr-2" />
                Enter VR
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 relative">
            <a-scene
              ref={sceneRef}
              embedded
              style={{ width: '100%', height: '100%' }}
              background="color: #0a0a0a"
              vr-mode-ui="enabled: true"
              super-hands
            >
              <a-assets>
                <a-asset-item
                  id="avatarModel"
                  src="/assets/avatar.glb"
                />
                {selectedItems.map((placedItem, index) => {
                  if (placedItem.item.asset_path?.endsWith('.glb')) {
                    return (
                      <a-asset-item
                        key={`asset-${placedItem.item.id}`}
                        id={`model-${placedItem.item.id}`}
                        src={placedItem.item.asset_path}
                      />
                    );
                  }
                  return null;
                })}
              </a-assets>

              {/* Lighting */}
              <a-light type="ambient" color="#404040" intensity="0.5" />
              <a-light type="directional" position="0 5 5" color="#ffffff" intensity="0.8" />

              {/* Avatar */}
              <a-entity
                gltf-model="#avatarModel"
                position="0 0 -3"
                rotation="0 0 0"
                scale="1 1 1"
              />

              {/* Placed clothing items */}
              {selectedItems.map((placedItem, index) => {
                const { item, position, rotation, scale } = placedItem;
                
                if (item.asset_path?.endsWith('.glb')) {
                  // Render as 3D model
                  return (
                    <a-entity
                      key={`placed-${item.id}`}
                      gltf-model={`#model-${item.id}`}
                      position={position}
                      rotation={rotation}
                      scale={scale}
                      hoverable
                      grabbable
                    />
                  );
                } else {
                  // Render as textured plane
                  return (
                    <a-plane
                      key={`placed-${item.id}`}
                      position={position}
                      rotation={rotation}
                      scale={scale}
                      material={`src: ${item.image_url}; transparent: true; opacity: 0.9`}
                      hoverable
                      grabbable
                    />
                  );
                }
              })}

              {/* Camera */}
              <a-camera
                look-controls
                wasd-controls
                position="0 1.6 1"
                super-hands
              />

              {/* Environment */}
              <a-sky color="#1a1a2e" />
            </a-scene>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={clearItems}
              disabled={selectedItems.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={saveOutfit}
              disabled={selectedItems.length === 0 || isSaving}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Outfit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Item Carousel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Clothing Items</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevCarouselItems}
                disabled={carouselIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextCarouselItems}
                disabled={carouselIndex + 4 >= items.length}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
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
                No clothing items uploaded yet
              </p>
              <Button onClick={() => window.location.href = '/upload'}>
                Upload Your First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {visibleItems.map((item) => {
                const isSelected = selectedItems.find(p => p.item.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected 
                        ? 'border-primary shadow-lg shadow-primary/20' 
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
                    <div className="p-2">
                      <h4 className="font-medium text-xs truncate">
                        {item.item_name || 'Unnamed Item'}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.metadata?.category || 'Item'}
                      </p>
                      {item.asset_path?.endsWith('.glb') && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                          3D
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Items Preview */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Wearing ({selectedItems.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {selectedItems.map((placedItem) => (
                <div
                  key={placedItem.item.id}
                  className="rounded-lg overflow-hidden border border-primary/20"
                >
                  <div className="aspect-square">
                    <img 
                      src={placedItem.item.image_url} 
                      alt={placedItem.item.item_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-xs truncate">
                      {placedItem.item.item_name || 'Unnamed Item'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {placedItem.item.asset_path?.endsWith('.glb') ? '3D Model' : 'Texture'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}