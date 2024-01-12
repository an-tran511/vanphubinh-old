export type Partner = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isCustomer: boolean;
  isSupplier: boolean;
};

export type NewPartner = {
  name: string;
  address: string;
  phone: string;
  email: string;
  isCustomer: boolean;
  isSupplier: boolean;
};
