export interface Teacher {
  id: string;
  schoolId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  employeeCode: string;
  hireDate: string;
  classId?: string | null;
  className?: string | null;
  status: string;
}

export interface CreateTeacherRequest {
  schoolId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  employeeCode: string;
  hireDate: string;
}

export interface UpdateTeacherRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  employeeCode: string;
  hireDate: string;
}
