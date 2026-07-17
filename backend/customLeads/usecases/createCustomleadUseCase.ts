import propertyLeadModel from '../models/PropertyLeadModel';
import contactLeadModel from '../models/contactLeadModel';
import consultationLeadModel from '../models/consultationLeadModel';
import { IBaseLeadModel } from '../../types/leadsTypes';
import communityLeadModel from '../models/communityLeadModel';

export const createCustomLead = async (type: string, data: IBaseLeadModel) => {
  let Model;

  switch (type) {
  case 'property':
    Model = propertyLeadModel;
    break;
  case 'contact':
    Model = contactLeadModel;
    break;
  case 'consultation':
    Model = consultationLeadModel;
    break;
  case 'community':
    Model = communityLeadModel;
    break;
  default:
    throw new Error('Invalid lead type');
  }

  const lead = new Model(data);
  await lead.save();
  return lead;
};

// GET all leads (optionally by type)
export const getAllCustomLeads = async (type: string, page: number = 1, limit: number = 10) => {
  if (!type) {
    throw new Error('Lead type is required');
  }

  try {
    const skip = (page - 1) * limit;
    let leads;
    let total = 0;

    switch (type) {
    case 'property':
      total = await propertyLeadModel.countDocuments();
      leads = await propertyLeadModel
        .find()
        .sort({ createdAt: -1 }) // 👈 Sort by latest first
        .skip(skip)
        .limit(limit);
      break;

    case 'contact':
      total = await contactLeadModel.countDocuments();
      leads = await contactLeadModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      break;

    case 'consultation':
      total = await consultationLeadModel.countDocuments();
      leads = await consultationLeadModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      break;

    case 'community':
      total = await communityLeadModel.countDocuments();
      leads = await communityLeadModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      break;

    default:
      throw new Error('Invalid lead type');
    }

    return { total, data: leads };
  } catch (error: any) {
    console.error(error);
    throw new Error('Can\'t get lead');
  }
};

// GET COUNT

export const getCustomLeadCount = async (
  type?: string,
): Promise<number | Record<string, number>> => {
  // ✅ If a specific type is provided, count only that model
  if (type) {
    let Model;
    switch (type) {
    case 'property':
      Model = propertyLeadModel;
      break;
    case 'contact':
      Model = contactLeadModel;
      break;
    case 'consultation':
      Model = consultationLeadModel;
      break;

    default:
      throw new Error('Invalid lead type');
    }

    const count = await Model.countDocuments();
    return count;
  }

  // ✅ If no type is provided, return counts for all types
  const [propertyCount, contactCount, consultationCount] = await Promise.all([
    propertyLeadModel.countDocuments(),
    contactLeadModel.countDocuments(),
    consultationLeadModel.countDocuments(),
  ]);

  const total = propertyCount + contactCount + consultationCount;
  return total;
};
