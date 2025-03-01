"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobeIcon, MapPinIcon, FrownIcon, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/confetti";
import { ShareDialog } from "@/components/share-dialog";

type User = {
  id: string;
  username: string;
  score: number;
  completedCities?: string[];
};

type GameState = {
  loading: boolean;
  currentCity: string | null;
  clues: string[];
  options: { city: string; country: string }[];
  selectedOption: string | null;
  result: {
    isCorrect: boolean;
    city: string;
    country: string;
    factType: string;
    fact: string;
  } | null;
  completedCities: string[];
  gameComplete: boolean;
  score: number;
  totalQuestions: number;
};

export default function GamePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    loading: true,
    currentCity: null,
    clues: [],
    options: [],
    selectedOption: null,
    result: null,
    completedCities: [],
    gameComplete: false,
    score: 0,
    totalQuestions: 0
  });
  
  const router = useRouter();
  const { toast } = useToast();

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("globetrotter_user");
    if (!storedUser) {
      router.push("/start");
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Initialize game state with user data
      setGameState(prev => ({
        ...prev,
        completedCities: userData.completedCities || [],
        score: userData.score || 0
      }));
      
      // Load first question
      fetchNextQuestion(userData.id, userData.completedCities || []);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/start");
    }
  }, [router]);

  // Fetch next question
  const fetchNextQuestion = async (userId: string, completedCities: string[]) => {
    setGameState(prev => ({ ...prev, loading: true, result: null, selectedOption: null }));
    
    try {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, completedCities }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
      
      const data = await response.json();
      
      if (data.gameComplete) {
        setGameState(prev => ({
          ...prev,
          loading: false,
          gameComplete: true
        }));
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        loading: false,
        currentCity: data.id,
        clues: data.clues,
        options: data.options,
        totalQuestions: prev.totalQuestions + 1
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load the next question. Please try again.",
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle option selection
  const handleSelectOption = async (city: string) => {
    if (gameState.selectedOption || !gameState.currentCity || !user) return;
    
    setGameState(prev => ({ ...prev, selectedOption: city, loading: true }));
    
    try {
      const response = await fetch("/api/game", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cityId: gameState.currentCity,
          isCorrect: city === gameState.currentCity
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }
      
      const result = await response.json();
      
      // Update game state
      const isCorrect = city === gameState.currentCity;
      const newScore = isCorrect ? gameState.score + 1 : gameState.score;
      const newCompletedCities = isCorrect 
        ? [...gameState.completedCities, gameState.currentCity]
        : gameState.completedCities;
      
      // Show confetti for correct answers
      if (isCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // Update user data in localStorage
      const updatedUser = {
        ...user,
        score: newScore,
        completedCities: newCompletedCities
      };
      localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setGameState(prev => ({
        ...prev,
        loading: false,
        result,
        score: newScore,
        completedCities: newCompletedCities
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive",
      });
      setGameState(prev => ({ ...prev, loading: false, selectedOption: null }));
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (!user) return;
    fetchNextQuestion(user.id, gameState.completedCities);
  };

  // Handle retry current question
  const handleRetryQuestion = () => {
    setGameState(prev => ({ ...prev, selectedOption: null, result: null }));
  };

  // Handle share game
  const handleShareGame = async () => {
    if (!user) return;
    
    try {
      setShowShareDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Render loading state
  if (gameState.loading && !gameState.result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <GlobeIcon className="h-16 w-16 text-primary mx-auto animate-spin" />
          <h2 className="mt-4 text-xl font-semibold">Loading your adventure...</h2>
        </div>
      </div>
    );
  }

  // Render game complete state
  if (gameState.gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Adventure Complete!</CardTitle>
            <CardDescription className="text-center">
              You've explored all destinations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold">Final Score</h3>
              <p className="text-3xl font-bold mt-2">{gameState.score} / {gameState.totalQuestions}</p>
              <p className="text-muted-foreground mt-2">
                {gameState.score === gameState.totalQuestions 
                  ? "Perfect score! You're a true globetrotter!" 
                  : "Great job exploring the world!"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleShareGame} 
              className="w-full"
              variant="default"
            >
              Challenge a Friend
            </Button>
            <Button 
              onClick={() => router.push("/")} 
              className="w-full"
              variant="outline"
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
        
        {showShareDialog && user && (
          <ShareDialog 
            username={user.username}
            score={gameState.score}
            totalQuestions={gameState.totalQuestions}
            onClose={() => setShowShareDialog(false)}
          />
        )}
      </div>
    );
  }

  // Render result state
  if (gameState.result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
        {showConfetti && <Confetti />}
        
        <Card className="max-w-md w-full border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">
              {gameState.result.isCorrect ? "Correct!" : "Not quite right"}
            </CardTitle>
            <CardDescription className="text-center">
              {gameState.result.city}, {gameState.result.country}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              {gameState.result.isCorrect ? (
                <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
              ) : (
                <FrownIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              )}
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">
                  {gameState.result.factType === 'fun_fact' ? 'Fun Fact' : 'Trivia'}
                </h3>
                <p>{gameState.result.fact}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-muted-foreground">
                  Score: {gameState.score} / {gameState.totalQuestions}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleNextQuestion} 
              className="w-full"
              variant="default"
            >
              Next Destination
            </Button>
            
            {!gameState.result.isCorrect && (
              <Button 
                onClick={handleRetryQuestion} 
                className="w-full"
                variant="outline"
              >
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render question state
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Where in the World?</h1>
          <p className="text-muted-foreground">Guess the city based on the clues</p>
        </div>
        
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-xl">Clues</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {gameState.clues.map((clue, index) => (
                <li key={index} className="flex items-start gap-2">
                  <MapPinIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>{clue}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {gameState.options.map((option, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all hover:border-primary ${
                gameState.selectedOption === option.city ? 'border-2 border-primary' : ''
              }`}
              onClick={() => handleSelectOption(option.city)}
            >
              <CardContent className="p-4 text-center">
                <p className="font-semibold">{option.city}</p>
                <p className="text-sm text-muted-foreground">{option.country}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Select the city that matches the clues</p>
        </div>
      </div>
    </div>
  );
}