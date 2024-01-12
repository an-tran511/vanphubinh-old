import { client } from '@utils/client';
import { Uom } from '@/app-types/uom';
import { ListResponse } from '@/app-types/response';

export const getUoms = async (deps: string | object) => {
  const response = await client.url('/uoms').query(deps).get();
  return response as ListResponse<Uom>;
};

// export const createPartner = async (newPartner: NewPartner) => {
//   const response = await client.url('/uoms').post(newPartner);
//   return response as Partner;
// };
