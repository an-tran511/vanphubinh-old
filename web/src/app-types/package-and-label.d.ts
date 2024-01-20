export type TPackageAndLabel = {
  id: number;
  name: string;
  uomId: number;
  secondaryUomId: number;
  purchaseUomId: number;
  partnerId: number;
  categoryId: number;
  itemCode: string;
  note: string;
  specs: {
    dimension: string;
    spreadDimension: string;
    thickness: number;
    numberOfColors: number;
  };
};

export type TPackageAndLabelMutation = {
  name: string;
  uomId: number;
  partnerId: number;
  categoryId: number;
  itemCode: string;
  note: string;
  specs: {
    dimension: string;
    spreadDimension: string;
    thickness: number;
    numberOfColors: number;
  };
};
