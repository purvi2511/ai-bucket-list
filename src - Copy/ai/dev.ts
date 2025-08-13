import { config } from 'dotenv';
config();

import '@/ai/flows/generate-bucket-list.ts';
import '@/ai/flows/suggest-activity-timing.ts';
import '@/ai/flows/estimate-activity-cost.ts';
import '@/ai/flows/generate-activity-image.ts';
