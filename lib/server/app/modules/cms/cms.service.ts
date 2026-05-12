import { ICMS } from './cms.interface';
import { CMS } from './cms.model';

const upsertCMS = async (payload: ICMS): Promise<ICMS | null> => {
  const result = await CMS.findOneAndUpdate({ key: payload.key }, payload, {
    upsert: true,
    new: true,
  });
  return result;
};

const getCMSByKey = async (key: string): Promise<ICMS | null> => {
  const result = await CMS.findOne({ key });
  return result;
};

const getAllCMS = async (): Promise<ICMS[]> => {
  const result = await CMS.find();
  return result;
};

export const CMSService = {
  upsertCMS,
  getCMSByKey,
  getAllCMS,
};
