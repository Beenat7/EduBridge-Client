export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: string;
  section: string;
  status: string;
}

export interface ClassSubject {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface CreateClassRequest {
  schoolId: string;
  name: string;
  gradeLevel: string;
  section: string;
}

export interface UpdateClassRequest {
  name: string;
  gradeLevel: string;
  section: string;
}
