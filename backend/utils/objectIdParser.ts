import { ObjectId } from 'mongodb';

export const ObjectID = (id: string): ObjectId | null => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export const objectIdToString = (id: ObjectId): string => {
  return id.toString();
};
