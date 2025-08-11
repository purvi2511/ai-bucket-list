'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Wand2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedBucketList } from '@/ai/flows/generate-bucket-list';
import type { BucketListItemType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  interests: z.string().min(10, {
    message: 'Please tell us a bit more about your interests.',
  }).max(500, {
    message: 'Please keep your interests under 500 characters.'
  }),
  limitations: z.string().max(500, {
    message: 'Please keep your limitations under 500 characters.'
  }).optional(),
});

type GenerateFormProps = {
  setBucketList: (list: Omit<BucketListItemType, 'status'>[]) => void;
  setIsLoading: (loading: boolean) => void;
};

export function GenerateForm({ setBucketList, setIsLoading }: GenerateFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: 'hiking in mountains, trying exotic foods, learning new languages',
      limitations: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setBucketList([]);
    try {
      const result = await generatePersonalizedBucketList(values);
      const newBucketList = result.bucketListItems.map(item => ({
        ...item,
        id: crypto.randomUUID(),
      }));
      setBucketList(newBucketList);
    } catch (error) {
      console.error('Failed to generate bucket list:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Bucket List',
        description: 'There was a problem with the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Create Your Bucket List
        </CardTitle>
        <CardDescription>
          Tell us about your passions, and let AI craft an adventure for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">What are your interests?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., hiking, exotic foods, photography..."
                        className="resize-none h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate My Bucket List
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
