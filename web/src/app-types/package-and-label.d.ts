export type TPackageAndLabel = {
  id: number;
  name: string;
  uomId: number;
  partnerId: number;
  categoryId: number;
  itemCode: string;
  note: string;
  specifications: {
    dimension: string;
    seamingDimension: string;
    thickness: number;
    colorCount: number;
  };
};

export type TPackageAndLabelMutation = {
  name: string;
  uomId: number;
  partnerId: number;
  categoryId: number;
  itemCode: string;
  note: string;
  specifications: {
    dimension: string;
    seamingDimension: string;
    thickness: number;
    colorCount: number;
  };
};
