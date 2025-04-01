<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { SendHorizontal, Mic, X, Loader2, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MiaChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const { user, isAuthenticated } = useFirebaseContext();
  const [hasShownTip, setHasShownTip] = useState(false);

  useEffect(() => {
    // Show a tip about voice assistant after 5 seconds on first load
    if (!hasShownTip && isAuthenticated) {
      const timer = setTimeout(() => {
        toast.info(
          "Try our new voice assistant! Just click the mic button to speak with Mia.",
          { duration: 5000 }
        );
        setHasShownTip(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasShownTip, isAuthenticated]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    // @ts-ignore - Speech Recognition API is not yet in TypeScript types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      sendMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Your browser does not support speech synthesis');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Female') || 
      voice.name.includes('Natural')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async (text = userInput) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMessage = { text, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI call)
    setTimeout(() => {
      const aiResponses = [
        "I'm here to help you track your health goals!",
        "Have you logged your meals today?",
        "Remember to stay hydrated throughout the day.",
        "Walking 10,000 steps a day can significantly improve your health.",
        "Your progress is looking good, keep it up!",
        "I notice you've been consistent with your exercise routine.",
        "Based on your profile, I recommend focusing on protein intake.",
        "Your diet seems well-balanced, but consider adding more vegetables."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage = { text: randomResponse, sender: 'ai' as const };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Speak the response
      speak(randomResponse);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
=======

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Sparkles, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MiaChatDialog from './MiaChatDialog';
import { useFirebaseContext } from '@/contexts/FirebaseContext';

const MiaChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useFirebaseContext();

  const toggleChat = () => {
    setIsOpen(!isOpen);
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  };

  return (
    <>
<<<<<<< HEAD
      {/* Chat button */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end space-y-4">
        {/* Only show chat button when authenticated */}
        {isAuthenticated && (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex space-x-2"
            >
              {/* Listening / Mic button */}
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                className={cn(
                  "rounded-full bg-gradient-to-tr h-12 w-12 shadow-md",
                  isListening ? "from-red-500 to-red-600 animate-pulse" : "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                )}
                onClick={startListening}
              >
                {isListening ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="absolute h-2 w-2 bg-white rounded-full animate-ping" />
                      <div className="absolute h-3 w-3 bg-white/50 rounded-full animate-pulse" />
                      <Mic className="h-4 w-4 text-white z-10" />
                    </div>
                  </div>
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              
              {/* Chat button */}
              <Button
                size="icon"
                variant={isOpen ? "default" : "outline"}
                className={cn(
                  "rounded-full h-12 w-12 shadow-md bg-gradient-to-tr",
                  isOpen ? "from-primary to-indigo-600" : "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <SendHorizontal className="h-5 w-5" />}
              </Button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Chat interface */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full sm:w-80 md:w-96"
            >
              <Card className="rounded-xl shadow-lg border-0 overflow-hidden bg-white dark:bg-gray-900">
                <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <SendHorizontal className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Mia - Health Assistant</h3>
                      <p className="text-xs text-primary-foreground/80">AI-powered health guidance</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-0">
                  <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
                    {messages.length === 0 ? (
                      <div className="text-center my-auto opacity-70">
                        <SendHorizontal className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Ask me anything about your health goals!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.sender === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-muted rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            {msg.sender === 'ai' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 ml-1 opacity-70 hover:opacity-100 mt-1"
                                onClick={() => speak(msg.text)}
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    
                    <div ref={messageEndRef} />
                  </div>
                  
                  <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={userInput}
                      onChange={handleInputChange}
                      className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button size="icon" type="submit" disabled={!userInput.trim() || isLoading}>
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline" 
                      onClick={startListening}
                      className={isListening ? "bg-red-100 text-red-600 border-red-300" : ""}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
=======
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 md:bottom-24 md:right-6 bg-background/95 backdrop-blur-sm border shadow-xl rounded-2xl overflow-hidden z-40"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{ width: '340px', maxWidth: '90vw', height: '500px', maxHeight: '70vh' }}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Mia - Health Assistant</h3>
                  <p className="text-xs text-white/80">Ask anything about your health</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <MiaChatDialog open={isOpen} onOpenChange={setIsOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 max-w-[200px] mb-2"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm">Ask about health tips!</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center"
          onClick={toggleChat}
        >
          <motion.div
            animate={{ 
              scale: isOpen ? 1 : [1, 1.1, 1],
              rotate: isOpen ? 0 : [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: isOpen ? 0 : Infinity,
              repeatDelay: 3
            }}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </motion.div>
        </Button>
      </motion.div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    </>
  );
};

export default MiaChat;
