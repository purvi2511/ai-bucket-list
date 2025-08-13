export type BucketListItemType = {
  id: string;
  activity: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  imageUrl?: string;
};

export type GenerateBucketListOutput = {
  bucketListItems: Omit<BucketListItemType, 'id' | 'status'>[];
};
