export interface School {
  id: string;
  name: string;
  code: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
}
export interface CreateSchoolRequest {
  name: string;
  code: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface UpdateSchoolRequest {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

