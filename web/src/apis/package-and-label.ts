import { TPackageAndLabel, TPackageAndLabelMutation } from '@app-types/package-and-label';
import { ListResponse } from '@/app-types/response';
import { client } from '@/utils/client';

export const createPackageAndLabel = async (newPackage: TPackageAndLabelMutation) => {
  const response = await client.url('/packages-and-labels').post(newPackage);
  return response as TPackageAndLabel;
};

export const getPackagesAndLabels = async (deps: string | object) => {
  const response = await client.url('/packages-and-labels').query(deps).get();
  return response as ListResponse<TPackageAndLabel>;
};

export const getPackageAndLabelById = async (id: string) => {
  const response = await client.url(`/packages-and-labels/${id}`).get();
  return response as TPackageAndLabel;
};
