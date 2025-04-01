
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FoodScannerProps {
  onFoodRecognized: (foodData: any) => void;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ onFoodRecognized }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleScanFood = async () => {
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload or take a photo of your food',
        variant: 'destructive',
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Call our food recognition edge function
      const { data, error } = await supabase.functions.invoke('ai-food-recognition', {
        body: { image: selectedImage },
      });
      
      if (error) throw error;
      
      if (data) {
        onFoodRecognized(data);
        toast({
          title: 'Food Recognized',
          description: `Recognized as ${data.food_name}`,
        });
      }
    } catch (error: any) {
      console.error('Error scanning food:', error);
      toast({
        title: 'Scan failed',
        description: error.message || 'Failed to recognize food',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
  };
  
  const handleCapture = () => {
    // In a real implementation, this would activate the device camera
    // For now, we'll use the file upload as a fallback
    document.getElementById('image-upload')?.click();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">AI Food Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {selectedImage ? (
            <div className="relative w-full">
              <img 
                src={selectedImage} 
                alt="Food preview" 
                className="w-full h-64 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md w-full h-64 flex flex-col items-center justify-center p-4">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Upload a photo of your food</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Browse
                </Button>
                <Button variant="outline" onClick={handleCapture}>
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleScanFood} 
          disabled={!selectedImage || isScanning}
        >
          {isScanning ? 'Scanning...' : 'Scan Food'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodScanner;
