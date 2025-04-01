<<<<<<< HEAD
=======

>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
<<<<<<< HEAD
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';
=======
import { Send, Loader2, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { toast } from 'sonner';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
=======
import { motion } from 'framer-motion';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

interface MiaChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  foodSuggestions?: FoodSuggestion[];
<<<<<<< HEAD
  hasAudio?: boolean;
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
}

interface FoodSuggestion {
  name: string;
  calories: number;
  protein: string;
  image: string;
}

const MiaChatDialog: React.FC<MiaChatDialogProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
<<<<<<< HEAD
      text: 'Hi there! I\'m Mia, your health and wellness expert. You can type or tap the microphone button to talk with me about nutrition, fitness, or any health concerns.',
=======
      text: 'Hi there! I\'m Mia, your health and wellness assistant. How can I help you today?',
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
<<<<<<< HEAD
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
<<<<<<< HEAD
  const timerRef = useRef<NodeJS.Timeout | null>(null);
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  const { userMetadata, isAuthenticated, user } = useFirebaseContext();
  
  useEffect(() => {
    scrollToBottom();
    // Initialize audio element for speech
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsSpeaking(false);
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopRecording();
<<<<<<< HEAD
      if (timerRef.current) clearInterval(timerRef.current);
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    };
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
<<<<<<< HEAD
  useEffect(() => {
    if (isRecording) {
      // Start a timer to track recording duration
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto stop after 30 seconds
      const autoStopTimer = setTimeout(() => {
        if (isRecording) {
          stopRecording();
          toast.info("Maximum recording time reached");
        }
      }, 30000);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        clearTimeout(autoStopTimer);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording]);
  
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
<<<<<<< HEAD
      toast.success('Listening...', { 
        duration: 2000,
        icon: <Mic className="h-4 w-4 text-green-500" />
      });
=======
      toast.success('Listening...', { duration: 2000 });
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Unable to access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
<<<<<<< HEAD
    setRecordingTime(0);
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const audioBase64 = base64data.split(',')[1];
        
        // Send to speech-to-text function
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('chat-with-mia', {
          body: { 
            audioData: audioBase64, 
            mode: 'transcribe',
            isAuthenticated, 
            userProfile: userMetadata 
          },
        });
        
        if (transcriptionError) throw transcriptionError;
        
        if (transcriptionData && transcriptionData.text) {
          const transcribedText = transcriptionData.text;
<<<<<<< HEAD
          
          // Add user message with transcribed text
=======
          setInputValue(transcribedText);
          
          // Automatically send the transcribed message
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          const userMessage = {
            id: generateUniqueId(),
            sender: 'user' as const,
            text: transcribedText,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, userMessage]);
          await handleAIChatResponse(transcribedText);
<<<<<<< HEAD
          setInputValue(''); // Clear input field
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        } else {
          toast.error('Could not understand audio. Please try again.');
        }
      };
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Error processing voice input. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAIChatResponse = async (messageText: string) => {
    setIsLoading(true);
    setInputValue('');
    
    try {
      // Get user profile data if authenticated
      let userProfile = null;
      if (isAuthenticated && (userMetadata?.id || user?.uid)) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userMetadata?.id || user?.uid)
          .single();
          
        if (!error) {
          userProfile = data;
        }
      }
      
      const { data, error } = await supabase.functions.invoke('chat-with-mia', {
        body: { 
          message: messageText, 
          isAuthenticated, 
          userProfile,
<<<<<<< HEAD
          enableVoice: audioEnabled
=======
          enableVoice: true
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        },
      });
      
      if (error) throw error;
      
      // Example response with food suggestions based on protein query
      let foodSuggestions = null;
      if (messageText.toLowerCase().includes('protein') || 
          messageText.toLowerCase().includes('meal') ||
          messageText.toLowerCase().includes('diet') ||
          messageText.toLowerCase().includes('food')) {
        foodSuggestions = [
          {
            name: 'Chicken Curry',
            calories: 320,
            protein: '28g',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3'
          },
          {
            name: 'Tofu Bowl',
            calories: 280,
            protein: '22g',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3'
          }
        ];
      }
      
      if (data && data.reply) {
<<<<<<< HEAD
        const hasAudio = !!(data.audioContent && audioEnabled);
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        const aiResponse = {
          id: generateUniqueId(),
          sender: 'ai' as const,
          text: data.reply,
          timestamp: new Date(),
<<<<<<< HEAD
          foodSuggestions: foodSuggestions,
          hasAudio
=======
          foodSuggestions: foodSuggestions
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
<<<<<<< HEAD
        // Play audio response if available and audio is enabled
        if (hasAudio && audioRef.current) {
          try {
            setIsSpeaking(true);
            const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
            audioRef.current.src = audioSrc;
            
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.catch(err => {
                console.error('Error playing audio:', err);
                setIsSpeaking(false);
                
                // Alert user about autoplay issues in a friendly way
                if (err.name === 'NotAllowedError') {
                  toast.info("Browser blocked autoplay. Click anywhere to enable audio.", {
                    duration: 5000,
                    action: {
                      label: "Enable",
                      onClick: () => {
                        if (audioRef.current) audioRef.current.play().catch(() => {});
                      }
                    }
                  });
                }
              });
            }
          } catch (err) {
            console.error('Audio play error:', err);
            setIsSpeaking(false);
          }
=======
        // Play audio response if available
        if (data.audioContent && audioRef.current) {
          setIsSpeaking(true);
          const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
          audioRef.current.src = audioSrc;
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
            setIsSpeaking(false);
          });
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        }
      }
    } catch (error: any) {
      console.error('Error communicating with AI assistant:', error);
      
      const errorMessage = {
        id: generateUniqueId(),
        sender: 'ai' as const,
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response from assistant');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: generateUniqueId(),
      sender: 'user' as const,
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    handleAIChatResponse(inputValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
<<<<<<< HEAD
  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      // Try to replay the last audio message
      const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai' && m.hasAudio);
      if (lastAiMessage && audioRef.current && audioRef.current.src) {
        setIsSpeaking(true);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.error('Error replaying audio:', err);
          setIsSpeaking(false);
        });
      }
    }
  };

=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  const stopSpeaking = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };
  
<<<<<<< HEAD
  const toggleAudioEnabled = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      toast.success("Voice responses enabled");
    } else {
      stopSpeaking();
      toast.info("Voice responses disabled");
    }
  };

  // Format recording time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0 rounded-xl overflow-hidden">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary to-primary/80">
=======
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0 rounded-xl overflow-hidden">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/90 to-primary">
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          <DialogTitle className="flex items-center text-white">
            <Avatar className="h-8 w-8 mr-2 border border-white/20">
              <AvatarImage src="/mia-avatar.png" alt="Mia" />
              <AvatarFallback className="bg-primary-foreground/20">
<<<<<<< HEAD
                <Brain className="h-4 w-4 text-white" />
=======
                <Sparkles className="h-4 w-4 text-white" />
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
              </AvatarFallback>
            </Avatar>
            <div>
              <span>Chat with Mia</span>
<<<<<<< HEAD
              <p className="text-xs font-normal text-white/80">AI-powered health expert</p>
            </div>
            <div className="flex ml-auto">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 mr-1"
                onClick={toggleAudioEnabled}
                title={audioEnabled ? "Disable voice responses" : "Enable voice responses"}
              >
                {audioEnabled ? (
                  <Volume2 className="h-4 w-4 text-white" />
                ) : (
                  <VolumeX className="h-4 w-4 text-white" />
                )}
              </Button>
              
              {isSpeaking && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
                  onClick={toggleSpeaking}
                >
                  <VolumeX className="h-4 w-4 text-white" />
                </Button>
              )}
            </div>
=======
              <p className="text-xs font-normal text-white/80">AI-powered health assistant</p>
            </div>
            {isSpeaking && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 ml-auto rounded-full bg-white/10 hover:bg-white/20"
                onClick={stopSpeaking}
              >
                <Volume2 className="h-4 w-4 text-white" />
              </Button>
            )}
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/80 to-background">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:flex">
                    <AvatarImage src="/mia-avatar.png" alt="Mia" />
                    <AvatarFallback className="bg-primary text-white">M</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2 max-w-[85%]',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted rounded-tl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  
                  {/* Food suggestion cards */}
                  {message.foodSuggestions && (
                    <div className="mt-3 space-y-2">
                      {message.foodSuggestions.map((food, idx) => (
                        <div key={idx} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
                          <div className="flex items-center">
                            <div className="w-20 h-16 bg-muted overflow-hidden">
                              <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2 flex-1">
                              <p className="font-medium text-sm">{food.name}</p>
                              <div className="flex text-xs text-muted-foreground mt-1">
                                <span className="mr-3">{food.calories} Cal</span>
                                <span>{food.protein} Protein</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
<<<<<<< HEAD
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    
                    {message.sender === 'ai' && message.hasAudio && audioEnabled && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full p-0 ml-1 hover:bg-background/50"
                        onClick={toggleSpeaking}
                        disabled={isSpeaking && audioRef.current?.dataset.messageId !== message.id}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
=======
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:flex">
                  <AvatarImage src="/mia-avatar.png" alt="Mia" />
                  <AvatarFallback className="bg-primary text-white">M</AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-muted flex items-center">
                  <motion.div 
                    className="flex space-x-1"
                    animate={{
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                  </motion.div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-background">
<<<<<<< HEAD
          {isRecording && (
            <div className="mb-2 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-3 w-3 bg-red-500 rounded-full mr-2"
                />
                <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
              </div>
              <Button 
                size="sm" 
                variant="destructive"
                className="h-7 px-2 text-xs"
                onClick={stopRecording}
              >
                Stop
              </Button>
            </div>
          )}
          
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about nutrition, fitness, or wellness..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isRecording}
              className="flex-1 focus-visible:ring-primary/50 border-primary/20"
            />
            <Button 
              size="icon" 
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleRecording}
              disabled={isLoading}
<<<<<<< HEAD
              className={cn(
                isRecording ? "animate-pulse border-red-400 bg-red-100 dark:bg-red-900/30" : "",
                "relative"
              )}
              title={isRecording ? "Stop recording" : "Start voice input"}
=======
              className={isRecording ? "animate-pulse border-red-400 bg-red-100 dark:bg-red-900/30" : ""}
              title={isRecording ? "Stop recording" : "Start recording"}
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
<<<<<<< HEAD
                <>
                  <Mic className="h-4 w-4" />
                  {!isAuthenticated && (
                    <motion.span 
                      className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </>
=======
                <Mic className="h-4 w-4" />
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
              )}
            </Button>
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading || isRecording}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Sign in for personalized health recommendations
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MiaChatDialog;
