import { Model } from 'mongoose';

export type ICMS = {
  key: string;
  value: any;
  description?: string;
};

export type CMSModel = Model<ICMS, Record<string, unknown>>;
