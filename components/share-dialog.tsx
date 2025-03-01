"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  username: string;
  score: number;
  totalQuestions: number;
  onClose: () => void;
}

export function ShareDialog({ username, score, totalQuestions, onClose }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [shareData, setShareData] = useState<{ shareUrl: string; previewImage: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const createShareLink = async () => {
      try {
        const response = await fetch("/api/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, score }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to create share link");
        }
        
        const data = await response.json();
        setShareData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create share link",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    createShareLink();
  }, [username, score, toast]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleCopyLink = () => {
    if (!shareData) return;
    
    navigator.clipboard.writeText(shareData.shareUrl);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleShare = (platform: string) => {
    if (!shareData) return;
    
    const text = `I scored ${score}/${totalQuestions} in Globetrotter! Can you beat my score?`;
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.shareUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.shareUrl)}`;
        break;
    }
    
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Score</DialogTitle>
          <DialogDescription>
            Challenge your friends to beat your score of {score}/{totalQuestions}!
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : shareData ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={shareData.previewImage} 
                alt="Globetrotter challenge" 
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="font-bold text-xl">{username}'s Challenge</h3>
                  <p className="text-lg">Score: {score}/{totalQuestions}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                value={shareData.shareUrl} 
                readOnly 
                className="flex-1"
              />
              <Button size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('twitter')}
                className="rounded-full"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('facebook')}
                className="rounded-full"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('linkedin')}
                className="rounded-full"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Failed to create share link. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}