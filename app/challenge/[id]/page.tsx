"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobeIcon, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChallengePageProps {
  params: {
    id: string;
  };
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const [challengeData, setChallengeData] = useState<{
    username: string;
    score: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const response = await fetch(`/api/share?id=${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch challenge data");
        }
        
        const data = await response.json();
        setChallengeData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load challenge data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallengeData();
  }, [params.id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <GlobeIcon className="h-16 w-16 text-primary mx-auto animate-spin" />
          <h2 className="mt-4 text-xl font-semibold">Loading challenge...</h2>
        </div>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Challenge Not Found</CardTitle>
            <CardDescription className="text-center">
              This challenge may have expired or doesn't exist
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => router.push("/")} 
              className="w-full"
            >
              Start Your Own Adventure
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl">You've Been Challenged!</CardTitle>
          <CardDescription className="text-center">
            {challengeData.username} has challenged you to beat their score
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Their Score</h3>
              <p className="text-3xl font-bold">{challengeData.score}</p>
            </div>
            <p className="text-muted-foreground mt-4">
              Think you can do better? Accept the challenge and test your knowledge of cities around the world!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={() => router.push("/start")} 
            className="w-full"
            variant="default"
          >
            Accept Challenge
          </Button>
          <Button 
            onClick={() => router.push("/")} 
            className="w-full"
            variant="outline"
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}