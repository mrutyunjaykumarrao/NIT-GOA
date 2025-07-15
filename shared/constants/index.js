// Shared constants between client and server
export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student'
};

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  FACULTY: '/api/faculty',
  ADMIN: '/api/admin',
  CONTENT: '/api/content',
  UPLOAD: '/api/upload'
};

export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx'],
  ALLOWED_MAX_SIZE: 5 * 1024 * 1024 // 5MB
};

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};
