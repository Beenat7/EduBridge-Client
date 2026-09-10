export interface Parent {
  id: string;
  schoolId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

export interface CreateParentRequest {
  schoolId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateParentRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
