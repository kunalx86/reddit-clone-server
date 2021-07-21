// Put shared constants here
export const __prod__ = process.env.NODE_ENV === 'prodcution';
export const PAGE_SIZE = 2;
export const FORBIDDEN_USERNAMES = [
  'follow',
  'followers',
  'following',
  'profile',
];
export const FORBIDDEN_GROUPNAMES = [
  'follow',
  'create',
];