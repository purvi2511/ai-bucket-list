'use client';

import { useState } from 'react';
import type { BucketListItemType } from '@/lib/types';
import { GenerateForm } from '@/components/generate-form';
import { BucketList } from '@/components/bucket-list';
import { Welcome } from '@/components/welcome';
import { LogoIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [bucketList, setBucketList] = useState<BucketListItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = (id: string, status: BucketListItemType['status']) => {
    setBucketList(prevList =>
      prevList.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center">
            <LogoIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Bucketlist.ai</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <GenerateForm setBucketList={setBucketList} setIsLoading={setIsLoading} />
            </div>

            {isLoading && (
              <div className="mt-12 space-y-8">
                <Skeleton className="h-10 w-1/3 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[180px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && bucketList.length > 0 && (
              <BucketList items={bucketList} onStatusChange={handleStatusChange} />
            )}

            {!isLoading && bucketList.length === 0 && <Welcome />}
        </div>
      </main>
    </div>
  );
}
