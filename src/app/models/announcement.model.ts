export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  lastModifiedAt: string | null;
}

export interface CreateAnnouncementRequest {
  schoolId: string;
  title: string;
  body: string;
}

export interface UpdateAnnouncementRequest {
  title: string;
  body: string;
}