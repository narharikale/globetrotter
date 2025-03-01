"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GlobeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StartPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call to create user
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      
      const data = await response.json();
      
      // Store user ID in localStorage for session management
      localStorage.setItem("globetrotter_user", JSON.stringify({
        id: data.id,
        username: username,
        score: 0
      }));
      
      // Redirect to game
      router.push("/game");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <GlobeIcon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Join the Adventure</h1>
          <p className="text-muted-foreground mt-2">Enter a username to start your journey</p>
        </div>
        
        <Card className="border-2 border-primary/20">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create Your Explorer Profile</CardTitle>
              <CardDescription>
                Your username will appear on the leaderboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="username"
                    placeholder="Enter your explorer name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12"
                    autoComplete="off"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Profile..." : "Begin Adventure"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}