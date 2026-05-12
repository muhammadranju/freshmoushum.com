import { Schema, model, models } from 'mongoose';
import { ICMS, CMSModel } from './cms.interface';

const cmsSchema = new Schema<ICMS>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const CMS = (models.CMS as CMSModel) || model<ICMS, CMSModel>('CMS', cmsSchema);
