export const setCurrentUser = (payload) => {
  return {
    type: "SET_CURRENT_USER",
    payload: payload,
  };
};

export const setCurrentLoc = (payload) => {
  return {
    type: "SET_CURRENT_LOC",
    payload: payload,
  };
};

export const setProfileSection = (payload) => {
  return {
    type: "SET_PROFILE_SECTION",
    payload: payload,
  };
};
