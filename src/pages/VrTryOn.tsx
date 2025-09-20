import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Monitor, Smartphone, Headset } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import 'aframe';

// Declare A-Frame components for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-sky': any;
      'a-plane': any;
      'a-light': any;
      'a-camera': any;
      'a-text': any;
      'a-box': any;
    }
  }
}

type Item = Tables<'items'>;

interface ClothingTexture {
  id: string;
  url: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export default function VrTryOn() {
  // State management
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<'avatar1' | 'avatar2'>('avatar1');
  const [appliedTextures, setAppliedTextures] = useState<ClothingTexture[]>([]);
  const [vrSupported, setVrSupported] = useState(false);
  const [isVrMode, setIsVrMode] = useState(false);
  
  const sceneRef = useRef<any>(null);
  const { toast } = useToast();

  // Check VR support on component mount
  useEffect(() => {
    const checkVrSupport = async () => {
      if ('navigator' in window && 'xr' in navigator) {
        try {
          const supported = await (navigator as any).xr?.isSessionSupported('immersive-vr');
          setVrSupported(!!supported);
        } catch (error) {
          console.log('VR not supported:', error);
          setVrSupported(false);
        }
      } else {
        setVrSupported(false);
      }
    };
    
    checkVrSupport();
  }, []);

  // Fetch clothing items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .not('image_url', 'is', null)
          .limit(10);

        if (error) {
          throw error;
        }

        // Get public URLs for storage assets
        const itemsWithPublicUrls = await Promise.all(
          (data || []).map(async (item) => {
            if (item.asset_path) {
              try {
                const { data: publicUrlData } = supabase.storage
                  .from('garments')
                  .getPublicUrl(item.asset_path);
                
                return {
                  ...item,
                  public_asset_url: publicUrlData.publicUrl
                };
              } catch (error) {
                console.warn('Failed to get public URL for:', item.asset_path);
                return item;
              }
            }
            return item;
          })
        );

        setItems(itemsWithPublicUrls);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load clothing items. Please check your Supabase connection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [toast]);

  // Handle clothing item selection
  const handleItemSelect = (item: Item & { public_asset_url?: string }) => {
    const newTexture: ClothingTexture = {
      id: item.id,
      url: item.public_asset_url || item.image_url || '',
      name: item.item_name || 'Unknown Item',
      position: { x: 0, y: 1.5, z: 0.1 }, // Slightly in front of avatar
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };

    // Add or replace texture
    setAppliedTextures(prev => {
      const filtered = prev.filter(texture => texture.id !== item.id);
      return [...filtered, newTexture];
    });

    toast({
      title: "Item Applied",
      description: `${item.item_name || 'Item'} has been applied to the avatar.`,
    });
  };

  // Remove clothing texture
  const removeTexture = (textureId: string) => {
    setAppliedTextures(prev => prev.filter(texture => texture.id !== textureId));
  };

  // Clear all textures
  const clearAllTextures = () => {
    setAppliedTextures([]);
    toast({
      title: "Cleared",
      description: "All clothing items have been removed.",
    });
  };

  // Enter VR mode
  const enterVrMode = () => {
    if (sceneRef.current) {
      try {
        sceneRef.current.enterVR();
        setIsVrMode(true);
      } catch (error) {
        console.error('Failed to enter VR:', error);
        toast({
          title: "VR Error",
          description: "Failed to enter VR mode. Please check your VR device connection.",
          variant: "destructive",
        });
      }
    }
  };

  // Save outfit to Supabase
  const saveOutfit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your outfit.",
          variant: "destructive",
        });
        return;
      }

      const outfitData = {
        user_id: user.id,
        avatar_type: selectedAvatar,
        items_used: appliedTextures.map(texture => ({
          id: texture.id,
          name: texture.name,
          position: texture.position,
          rotation: texture.rotation,
          scale: texture.scale
        })),
        metadata: {
          created_with: 'vr-try-on',
          textures_count: appliedTextures.length
        }
      };

      const { error } = await supabase
        .from('outfits')
        .insert(outfitData);

      if (error) throw error;

      toast({
        title: "Outfit Saved",
        description: "Your VR outfit has been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast({
        title: "Save Error",
        description: "Failed to save outfit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">VR Try-On Experience</h1>
              <p className="text-muted-foreground mt-2">
                Experience virtual clothing fitting with immersive VR technology
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={vrSupported ? "default" : "secondary"}>
                <Headset className="w-4 h-4 mr-1" />
                {vrSupported ? "VR Ready" : "VR Not Available"}
              </Badge>
              {vrSupported && (
                <Button onClick={enterVrMode} className="gap-2">
                  <Headset className="w-4 h-4" />
                  Enter VR
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* VR Scene */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  3D Virtual Scene
                </CardTitle>
                <CardDescription>
                  Use mouse to look around, WASD keys to move, or enter VR mode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {/* A-Frame VR Scene */}
                  <a-scene
                    ref={sceneRef}
                    embedded
                    style={{ width: '100%', height: '100%' }}
                    vr-mode-ui="enabled: true"
                    device-orientation-permission-ui="enabled: true"
                    background="color: #0a0a0a"
                  >
                    {/* Environment Setup */}
                    <a-sky color="#1a1a2e" />
                    
                    {/* Lighting */}
                    <a-light type="ambient" color="#404040" />
                    <a-light 
                      type="directional" 
                      position="2 4 2" 
                      color="#ffffff" 
                      intensity="0.8"
                      shadow
                    />
                    
                    {/* Camera with controls */}
                    <a-camera
                      id="camera"
                      position="0 1.6 3"
                      look-controls="enabled: true"
                      wasd-controls="enabled: true"
                      cursor="rayOrigin: mouse"
                    >
                      <a-entity
                        cursor="fuse: false; rayOrigin: mouse"
                        raycaster="objects: .clickable"
                      />
                    </a-camera>

                    {/* Floor */}
                    <a-plane
                      position="0 0 0"
                      rotation="-90 0 0"
                      width="10"
                      height="10"
                      color="#2a2a2a"
                      shadow="receive: true"
                    />

                    {/* Avatar Model */}
                    <a-entity
                      id="avatar"
                      gltf-model={`url(/avatars/${selectedAvatar}.glb)`}
                      position="0 0 0"
                      rotation="0 0 0"
                      scale="1 1 1"
                      shadow="cast: true"
                    />

                    {/* Applied Clothing Textures */}
                    {appliedTextures.map((texture, index) => (
                      <a-plane
                        key={texture.id}
                        id={`clothing-${texture.id}`}
                        material={`src: url(${texture.url}); transparent: true; alphaTest: 0.5`}
                        position={`${texture.position.x} ${texture.position.y} ${texture.position.z}`}
                        rotation={`${texture.rotation.x} ${texture.rotation.y} ${texture.rotation.z}`}
                        scale={`${texture.scale.x} ${texture.scale.y} ${texture.scale.z}`}
                        width="1.5"
                        height="2"
                        className="clickable"
                        shadow="cast: true"
                      />
                    ))}

                    {/* Instructions Text */}
                    <a-text
                      value="Select clothing items below to apply to avatar"
                      position="0 3 0"
                      align="center"
                      color="#ffffff"
                      width="8"
                    />
                  </a-scene>

                  {/* VR Mode Overlay */}
                  {isVrMode && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Headset className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-semibold">VR Mode Active</p>
                      <p className="text-sm opacity-75">Put on your VR headset</p>
                    </div>
                    </div>
                  )}
                </div>

                {/* Avatar Selection */}
                <div className="mt-4 flex gap-4">
                  <Button
                    variant={selectedAvatar === 'avatar1' ? 'default' : 'outline'}
                    onClick={() => setSelectedAvatar('avatar1')}
                    className="flex-1"
                  >
                    Avatar 1
                  </Button>
                  <Button
                    variant={selectedAvatar === 'avatar2' ? 'default' : 'outline'}
                    onClick={() => setSelectedAvatar('avatar2')}
                    className="flex-1"
                  >
                    Avatar 2
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-4">
                  <Button onClick={clearAllTextures} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                  <Button 
                    onClick={saveOutfit} 
                    className="flex-1"
                    disabled={appliedTextures.length === 0}
                  >
                    Save Outfit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clothing Items Selector */}
          <div className="space-y-6">
            {/* Applied Items */}
            {appliedTextures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Applied Items ({appliedTextures.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {appliedTextures.map((texture) => (
                      <div
                        key={texture.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <span className="text-sm font-medium">{texture.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTexture(texture.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clothing Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Clothing Items
                </CardTitle>
                <CardDescription>
                  Click on items to apply them to your avatar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading items...</span>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>No clothing items found.</p>
                    <p className="text-sm mt-2">
                      Upload some items to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                        onClick={() => handleItemSelect(item as Item & { public_asset_url?: string })}
                      >
                        <div className="aspect-square bg-muted relative">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.item_name || 'Clothing item'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-muted-foreground">No Image</span>
                            </div>
                          )}
                          {appliedTextures.some(t => t.id === item.id) && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="text-xs">
                                Applied
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">
                            {item.item_name || 'Unnamed Item'}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p className="text-sm">Choose your preferred avatar model</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p className="text-sm">Click on clothing items to apply them</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p className="text-sm">Use mouse/WASD to navigate or enter VR mode</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <p className="text-sm">Save your outfit when satisfied</p>
                </div>
              </CardContent>
            </Card>

            {/* VR Requirements */}
            {!vrSupported && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">VR Requirements</CardTitle>
                </CardHeader>
                <CardContent className="text-orange-700 text-sm space-y-2">
                  <p>For full VR experience, you need:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>WebXR compatible browser (Chrome, Edge)</li>
                    <li>VR headset (Oculus Quest, HTC Vive, etc.)</li>
                    <li>HTTPS connection (required for WebXR)</li>
                  </ul>
                  <p className="mt-3">
                    You can still use the 3D scene with mouse and keyboard controls.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}