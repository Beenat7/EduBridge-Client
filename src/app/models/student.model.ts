export interface Student {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  studentCode: string;
  dateOfBirth: string;
  gender: string;
  schoolId: string;
  grade: string;
  status: string;
}

export interface CreateStudentRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  studentCode: string;
  dateOfBirth: string;
  gender: string;
  schoolId: string;
  grade: string;
}

export interface UpdateStudentRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
}