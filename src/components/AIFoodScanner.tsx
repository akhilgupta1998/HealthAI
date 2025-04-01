<<<<<<< HEAD
import React, { useState, useRef, memo, useCallback } from 'react';
import { Camera, X, UploadCloud, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export interface FoodScanResult {
  name: string;
=======

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X, Scan, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClerkContext } from '@/contexts/ClerkContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodData {
  foodName: string;
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
<<<<<<< HEAD
  fiber: number;
  sugar: number;
  servingSize: string;
  [key: string]: any;
}

export interface AIFoodScannerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onScan?: (result: FoodScanResult) => void;
  standalone?: boolean;
}

const AIFoodScanner = memo(({ isOpen, onClose, onScan, standalone = false }: AIFoodScannerProps) => {
  const [activeTab, setActiveTab] = useState('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<FoodScanResult | null>(null);
  const [openDialog, setOpenDialog] = useState(standalone ? false : !!isOpen);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Control dialog open state from props if not standalone
  React.useEffect(() => {
    if (!standalone && typeof isOpen !== 'undefined') {
      setOpenDialog(isOpen);
    }
  }, [isOpen, standalone]);

  // Handle dialog close
  const handleDialogChange = useCallback((open: boolean) => {
    setOpenDialog(open);
    if (!open && onClose) {
      onClose();
    }
  }, [onClose]);

  // Start camera when tab changes to camera
  const initializeCamera = useCallback(async () => {
    if (activeTab !== 'camera' || !openDialog) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, [activeTab, openDialog]);

  // Initialize camera when tab changes or dialog opens
  React.useEffect(() => {
    initializeCamera();
    
    // Cleanup function to stop camera stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [initializeCamera]);

  // Handle taking a photo
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Retry camera capture
  const handleRetry = useCallback(() => {
    setCapturedImage(null);
    setScanResult(null);
    setIsAnalyzing(false);
  }, []);

  // Analyze the image
  const analyzeImage = useCallback(() => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock result - replace with actual API call in production
      const result: FoodScanResult = {
        name: 'Grilled Chicken Salad',
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 18,
        fiber: 4,
        sugar: 3,
        servingSize: '1 bowl (250g)'
      };
      
      setScanResult(result);
      setIsAnalyzing(false);
      
      // Call onScan callback if provided
      if (onScan) {
        onScan(result);
      }
      
      // Auto close after scan if not standalone
      if (!standalone && onClose) {
        setTimeout(() => {
          handleDialogChange(false);
        }, 2000);
      }
    }, 2000);
  }, [capturedImage, onScan, onClose, standalone, handleDialogChange]);

  // Render the dialog content
  const renderContent = () => (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="camera">Camera</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="mt-0">
          {!capturedImage ? (
            <div className="relative overflow-hidden rounded-lg aspect-video bg-black mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button 
                  onClick={captureImage} 
                  size="lg" 
                  className="rounded-full h-14 w-14 bg-white hover:bg-white/90 text-black"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img 
                src={capturedImage} 
                alt="Captured food" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="mt-0">
          {!capturedImage ? (
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors mb-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <UploadCloud className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-1">Drag and drop an image or click to browse</p>
              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP</p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img 
                src={capturedImage} 
                alt="Uploaded food" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {capturedImage && !scanResult && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleRetry}
          >
            <X className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            className="flex-1"
            onClick={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Analyze Image
              </>
            )}
          </Button>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      )}
      
      {scanResult && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-green-100 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{scanResult.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {scanResult.servingSize}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{scanResult.calories}</p>
                  <p className="text-xs text-muted-foreground">calories</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-background/50 rounded-md">
                  <p className="text-lg font-semibold">{scanResult.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-md">
                  <p className="text-lg font-semibold">{scanResult.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-md">
                  <p className="text-lg font-semibold">{scanResult.fat}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>
              
              <Button className="w-full" onClick={handleRetry}>
                Scan Another Item
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  // Use Dialog for modal version, or render directly for standalone
  return standalone ? (
    <div className="w-full">
      {renderContent()}
    </div>
  ) : (
    <Dialog open={openDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {!isOpen && !onClose && (
          <Button className="w-full" variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Scan Food with AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Your Food</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
});

AIFoodScanner.displayName = 'AIFoodScanner';
=======
  healthScore?: number;
  healthTips?: string;
  isFoodDetected?: boolean;
}

interface AIFoodScannerProps {
  onFoodRecognized?: (foodData: FoodData) => void;
}

const AIFoodScanner: React.FC<AIFoodScannerProps> = ({ onFoodRecognized }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FoodData | null>(null);
  const { userId } = useClerkContext();
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Reset previous scan result
    setScanResult(null);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleScanFood = async () => {
    if (!selectedImage) {
      toast.error('No image selected. Please upload or take a photo of your food.');
      return;
    }
    
    setIsScanning(true);
    
    try {
      // Call the AI food recognition edge function
      const { data, error } = await supabase.functions.invoke('ai-food-recognition', {
        body: { 
          image: selectedImage,
          portionType: 'standard',
          portionAmount: '1'
        },
      });
      
      if (error) throw error;
      
      if (data && data.result) {
        const foodData: FoodData = {
          foodName: data.result.foodName || 'Unknown food',
          calories: data.result.calories || 0,
          protein: data.result.protein || 0,
          carbs: data.result.carbs || 0,
          fat: data.result.fat || 0,
          healthScore: data.result.healthScore || 0,
          healthTips: data.result.healthTips || '',
          isFoodDetected: true
        };
        
        setScanResult(foodData);
        
        // Notify parent component if callback provided
        if (onFoodRecognized) {
          onFoodRecognized(foodData);
        }
        
        toast.success(`Food recognized: ${foodData.foodName}`);
      } else {
        throw new Error('Invalid response from AI recognition service');
      }
    } catch (error: any) {
      console.error('Error scanning food:', error);
      toast.error(error.message || 'Failed to recognize food. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleLogMeal = async () => {
    if (!scanResult || !userId) return;
    
    try {
      const { error } = await supabase
        .from('meal_logs')
        .insert([
          {
            user_id: userId,
            food_name: scanResult.foodName,
            calories: scanResult.calories,
            protein: scanResult.protein,
            carbs: scanResult.carbs,
            fat: scanResult.fat,
            meal_type: 'snack', // Default, user can change later
            meal_time: new Date().toISOString(),
            image_url: selectedImage,
            portion_type: 'standard',
            portion_amount: '1',
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Meal logged successfully!');
      
      // Reset the component
      setSelectedImage(null);
      setScanResult(null);
    } catch (error: any) {
      console.error('Error logging meal:', error);
      toast.error('Failed to log meal. Please try again.');
    }
  };
  
  const handleClearImage = () => {
    setSelectedImage(null);
    setScanResult(null);
  };
  
  const handleCapture = () => {
    // In a real implementation, this would activate the device camera
    // For now, we'll use the file upload as a fallback
    document.getElementById('image-upload')?.click();
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="mr-2 h-5 w-5" />
          AI Food Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {selectedImage ? (
              <motion.div 
                className="relative w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="image"
              >
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
              </motion.div>
            ) : (
              <motion.div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-md w-full h-64 flex flex-col items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="upload"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {scanResult && (
              <motion.div 
                className="w-full mt-4 bg-muted/50 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="font-medium text-lg mb-2">{scanResult.foodName}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-background rounded-md p-2 text-center">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-bold">{scanResult.calories} kcal</p>
                  </div>
                  <div className="bg-background rounded-md p-2 text-center">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-bold">{scanResult.protein}g</p>
                  </div>
                  <div className="bg-background rounded-md p-2 text-center">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="font-bold">{scanResult.carbs}g</p>
                  </div>
                  <div className="bg-background rounded-md p-2 text-center">
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="font-bold">{scanResult.fat}g</p>
                  </div>
                </div>
                
                {scanResult.healthScore && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          scanResult.healthScore > 7 ? 'bg-green-500' : 
                          scanResult.healthScore > 4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(scanResult.healthScore / 10) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1">{scanResult.healthScore}/10</p>
                  </div>
                )}
                
                {scanResult.healthTips && (
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground mb-1">Health Tips</p>
                    <p>{scanResult.healthTips}</p>
                  </div>
                )}
                
                <Button onClick={handleLogMeal} className="w-full mt-3">
                  <Check className="mr-2 h-4 w-4" /> Log This Meal
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleScanFood} 
          disabled={!selectedImage || isScanning || !!scanResult}
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : scanResult ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Food Recognized
            </>
          ) : (
            <>
              <Scan className="mr-2 h-4 w-4" />
              Scan Food
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

export default AIFoodScanner;
