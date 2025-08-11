'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CalendarClock, Loader2 } from 'lucide-react';

import type { BucketListItemType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestActivityTiming } from '@/ai/flows/suggest-activity-timing';
import { Button } from '@/components/ui/button';


type BucketListItemCardProps = {
  item: Omit<BucketListItemType, 'status'>;
};


export function BucketListItemCard({ item }: BucketListItemCardProps) {
  const [timing, setTiming] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const aiHint = item.activity.split(" ").slice(0, 2).join(" ").toLowerCase();

  const handleSuggestTiming = async (retryCount = 1) => {
    if (retryCount === 1) {
      setIsLoading(true);
      setTiming(null);
    }

    try {
      const result = await suggestActivityTiming({ activity: item.activity });
      setTiming(result.bestTime);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to suggest timing:', error);
      if (retryCount > 0) {
        // Wait for a second before retrying
        setTimeout(() => handleSuggestTiming(retryCount - 1), 1000);
      } else {
        setTiming('Could not get a suggestion. Please try again.');
        setIsLoading(false);
      }
    }
  };


  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader>
        <div className="relative w-full h-40 rounded-t-lg overflow-hidden mb-4">
            <Image
                src={`https://placehold.co/600x400.png`}
                alt={item.activity}
                data-ai-hint={aiHint}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
            />
        </div>
        <CardTitle className="text-lg font-semibold">{item.activity}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{item.description}</CardDescription>
        {timing && (
            <div className="mt-4 text-sm bg-accent/20 p-3 rounded-lg border border-accent/30">
                <p className="font-semibold text-primary">Best Time to Go:</p>
                <p className="text-foreground">{timing}</p>
            </div>
        )}
      </CardContent>
       <CardFooter>
        <Button onClick={() => handleSuggestTiming()} disabled={isLoading} variant="outline" size="sm" className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting suggestion...
            </>
          ) : (
            <>
              <CalendarClock className="mr-2 h-4 w-4" />
              Suggest Best Time
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
