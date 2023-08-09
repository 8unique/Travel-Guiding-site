const UserRepository = require("../repositories/user.repository");

const getUser = (by, value) => {
  return UserRepository.getUser(by, value);
};

const registerUser = (user) => {
  return UserRepository.registerUser(user);
};

const loginUser = (user) => {
  return UserRepository.loginUser(user);
};

const loginUserWithGoogle = () => {
  return UserRepository.loginUserWithGoogle();
};

const updateUserDetails = (data) => {
  return UserRepository.updateUserDetails(data);
};

const updateUserPassword = (data) => {
  return UserRepository.updateUserPassword(data);
};

const logoutUser = () => {
  return UserRepository.logoutUser();
};

const resetUserPassword = (email) => {
  return UserRepository.resetUserPassword(email);
};

const confirmPasswordReset = (oobCode, newPassword) => {
  return UserRepository.confirmUserPasswordReset(oobCode, newPassword);
};

const getUserBookings = (user_id, place_id) => {
  return UserRepository.getUserBookings(user_id, place_id);
};

const updateBookingStatus = (id, status) => {
  return UserRepository.updateBookingStatus(id, status);
};

const updateBookingPostponement = (id, postponedDate) => {
  return UserRepository.updateBookingStatus(id, postponedDate);
};

export {
  getUser,
  confirmPasswordReset,
  registerUser,
  loginUser,
  loginUserWithGoogle,
  resetUserPassword,
  updateUserDetails,
  updateUserPassword,
  logoutUser,
  getUserBookings,
  updateBookingStatus,
  updateBookingPostponement,
};
