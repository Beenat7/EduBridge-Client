export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  description: string;
  status: string;
}

export interface SubjectClass {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface SubjectTeacher {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface TeacherSubject {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface CreateSubjectRequest {
  schoolId: string;
  name: string;
  code: string;
  description: string;
}

export interface UpdateSubjectRequest {
  name: string;
  code: string;
  description: string;
}
