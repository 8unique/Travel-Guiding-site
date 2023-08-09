const initialState = {
  currentUser: undefined,
  currentLoc: undefined,
  profileSection: 0,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: payload };
    case "SET_CURRENT_LOC":
      return { ...state, currentLoc: payload };
    case "SET_PROFILE_SECTION":
      return { ...state, profileSection: payload };
    default:
      return state;
  }
};

export default reducer;
