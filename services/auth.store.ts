export interface AuthUser {
  name: string;
  email: string;
  password: string;
  userId?: string;
}

const users: AuthUser[] = [];

export const registerUser = (user: AuthUser) => {
  const existingUser = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingUser) {
    return false;
  }
  users.push(user);
  return true;
};

export const authenticateUser = (email: string, password: string) => {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return null;
  }
  if (user.password !== password) {
    return null;
  }
  return user;
};
