// src/utils/authUtils.js

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// Get all registered users
export const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
};

// Save a user to localStorage
export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Save all users to localStorage
export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Set the currently logged in user
export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Check if a user with the given email already exists
export const userExists = (email) => {
  const users = getUsers();
  return users.some((user) => user.email === email);
};

// Authenticate user
export const authenticateUser = (email, password) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

// Get the currently logged in user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
};

// Logout the current user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Update the current user's profile info
export const updateUser = (updatedUser) => {
  const users = getUsers().map((u) =>
    u.email === updatedUser.email ? updatedUser : u
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
};
