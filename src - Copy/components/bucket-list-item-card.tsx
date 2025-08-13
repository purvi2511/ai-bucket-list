'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CalendarClock, Loader2, DollarSign, CheckCircle2, Circle, Clock } from 'lucide-react';

import type { BucketListItemType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestActivityTiming } from '@/ai/flows/suggest-activity-timing';
import { estimateActivityCost } from '@/ai/flows/estimate-activity-cost';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type BucketListItemCardProps = {
  item: BucketListItemType;
  onStatusChange: (id: string, status: BucketListItemType['status']) => void;
};

type CostInfo = {
  estimatedCost: string;
  costBreakdown: string;
}

const statusConfig = {
  'To Do': { icon: Circle, color: 'bg-gray-400' },
  'In Progress': { icon: Clock, color: 'bg-blue-500' },
  'Completed': { icon: CheckCircle2, color: 'bg-green-500' },
};


export function BucketListItemCard({ item, onStatusChange }: BucketListItemCardProps) {
  const [timing, setTiming] = useState<string | null>(null);
  const [isTimingLoading, setIsLoadingTiming] = useState(false);
  const [cost, setCost] = useState<CostInfo | null>(null);
  const [isCostLoading, setIsLoadingCost] = useState(false);
  const aiHint = item.activity.split(" ").slice(0, 2).join(" ").toLowerCase();

  const handleSuggestTiming = async (retryCount = 1) => {
    if (retryCount === 1) {
      setIsLoadingTiming(true);
      setTiming(null);
    }

    try {
      const result = await suggestActivityTiming({ activity: item.activity });
      setTiming(result.bestTime);
      setIsLoadingTiming(false);
    } catch (error) {
      console.error('Failed to suggest timing:', error);
      if (retryCount > 0) {
        setTimeout(() => handleSuggestTiming(retryCount - 1), 1000);
      } else {
        setTiming('Could not get a suggestion. Please try again.');
        setIsLoadingTiming(false);
      }
    }
  };

  const handleEstimateCost = async (retryCount = 1) => {
    if (retryCount === 1) {
      setIsLoadingCost(true);
      setCost(null);
    }

    try {
      const result = await estimateActivityCost({ activity: item.activity });
      setCost(result);
      setIsLoadingCost(false);
    } catch (error) {
      console.error('Failed to estimate cost:', error);
      if (retryCount > 0) {
        setTimeout(() => handleEstimateCost(retryCount - 1), 1000);
      } else {
        setCost({ estimatedCost: 'Error', costBreakdown: 'Could not get an estimate. Please try again.'});
        setIsLoadingCost(false);
      }
    }
  };

  const StatusIcon = statusConfig[item.status].icon;

  return (
    <Card className={cn(
        "flex flex-col h-full overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group",
        item.status === 'Completed' && 'bg-green-50 border-green-200'
      )}>
      <CardHeader>
        <div className="relative w-full h-40 rounded-t-lg overflow-hidden mb-4">
            <Image
                src={item.imageUrl || `https://placehold.co/600x400.png`}
                alt={item.activity}
                data-ai-hint={aiHint}
                layout="fill"
                objectFit="cover"
                className={cn(
                    "transition-transform duration-300 group-hover:scale-105",
                    item.status === 'Completed' && 'grayscale'
                )}
            />
        </div>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold pr-2">{item.activity}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                   <Badge
                    className={cn(
                      'text-white',
                       statusConfig[item.status].color
                    )}
                   >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {item.status}
                   </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(statusConfig).map(status => (
                  <DropdownMenuItem
                    key={status}
                    onSelect={() => onStatusChange(item.id, status as BucketListItemType['status'])}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <CardDescription>{item.description}</CardDescription>
        {timing && (
            <div className="text-sm bg-accent/20 p-3 rounded-lg border border-accent/30">
                <p className="font-semibold text-primary">Best Time to Go:</p>
                <p className="text-foreground">{timing}</p>
            </div>
        )}
        {cost && (
            <div className="text-sm bg-accent/20 p-3 rounded-lg border border-accent/30">
                <p className="font-semibold text-primary">Estimated Cost:</p>
                <p className="text-foreground font-bold text-lg">{cost.estimatedCost}</p>
                 <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="text-xs p-0 hover:no-underline [&[data-state=open]>svg]:text-primary text-muted-foreground">
                      View cost breakdown
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-foreground">
                      {cost.costBreakdown}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </div>
        )}
      </CardContent>
       <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={() => handleSuggestTiming()} disabled={isTimingLoading || item.status === 'Completed'} variant="outline" size="sm" className="w-full">
          {isTimingLoading ? (
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
        <Button onClick={() => handleEstimateCost()} disabled={isCostLoading || item.status === 'Completed'} variant="outline" size="sm" className="w-full">
          {isCostLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Estimating...
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-4 w-4" />
              Estimate Cost
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
