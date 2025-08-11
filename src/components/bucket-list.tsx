'use client';

import type { BucketListItemType } from '@/lib/types';
import { BucketListItemCard } from './bucket-list-item-card';

type BucketListProps = {
  items: Omit<BucketListItemType, 'status'>[];
};

export function BucketList({ items }: BucketListProps) {
  return (
    <div className="mt-12">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Your Custom Bucket List</h2>
        {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
                <BucketListItemCard key={item.id} item={item} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 px-4 bg-card rounded-lg">
                <h3 className="text-xl font-semibold">No Activities Found</h3>
                <p className="text-muted-foreground mt-2">Try generating a new list with different interests.</p>
            </div>
      )}
    </div>
  );
}
