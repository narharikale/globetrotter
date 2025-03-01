import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <GlobeIcon className="h-16 w-16 text-primary animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-t-2 border-primary animate-spin"></div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Globetrotter</h1>
          <p className="text-muted-foreground">Test your knowledge of cities around the world</p>
        </div>
        
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Ready to explore?</CardTitle>
            <CardDescription className="text-center">
              Guess cities from clues and learn fascinating facts about destinations worldwide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=200&auto=format",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=200&auto=format",
                "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=200&auto=format"
              ].map((src, i) => (
                <div key={i} className="overflow-hidden rounded-md">
                  <img 
                    src={src} 
                    alt="City preview" 
                    className="h-24 w-full object-cover transition-all hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/start" className="w-full">
              <Button size="lg" className="w-full">
                Start Adventure
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Challenge your friends and see who knows more about the world!</p>
        </div>
      </div>
    </div>
  );
}