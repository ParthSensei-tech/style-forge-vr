import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { RotateCcw, Save, User, UserCheck } from 'lucide-react';

// A-Frame scene component
export function VRScene() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [avatarType, setAvatarType] = useState<'male' | 'female'>('female');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user's items
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

  const handleItemSelect = (item: any) => {
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
          avatar_type: avatarType,
          items_used: selectedItems.map(item => ({
            id: item.id,
            item_name: item.item_name,
            image_url: item.image_url,
            category: item.metadata?.category
          })),
          metadata: {
            created_at: new Date().toISOString(),
            item_count: selectedItems.length
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Sign in to try on clothes</h3>
        <p className="text-muted-foreground">
          Create an account to upload items and create virtual outfits
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Avatar Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={avatarType === 'female' ? 'default' : 'outline'}
              onClick={() => setAvatarType('female')}
              className="flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Female</span>
            </Button>
            <Button
              variant={avatarType === 'male' ? 'default' : 'outline'}
              onClick={() => setAvatarType('male')}
              className="flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Male</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3D Scene Container */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Try-On</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Placeholder for A-Frame scene */}
            <div className="text-center space-y-4">
              <div className="w-32 h-48 mx-auto bg-gradient-to-b from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-lg flex items-center justify-center">
                <User className="w-16 h-16 text-purple-600 dark:text-purple-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                {avatarType === 'female' ? 'Female' : 'Male'} Avatar
              </p>
              {selectedItems.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Wearing {selectedItems.length} item(s)
                </div>
              )}
            </div>

            {/* Floating selected items preview */}
            {selectedItems.length > 0 && (
              <div className="absolute top-4 right-4 space-y-2">
                {selectedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg"
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

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
              {isSaving ? 'Saving...' : 'Save Outfit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clothing Items Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Your Clothing Items</CardTitle>
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
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate">
                        {item.item_name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.metadata?.category || 'Uncategorized'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}