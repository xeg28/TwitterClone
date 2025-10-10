export type User = {
  id?: number;
  legalName?: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  followers?: number;
  following?: number;
  biography?: string;
  dateJoined?: Date;
}

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}