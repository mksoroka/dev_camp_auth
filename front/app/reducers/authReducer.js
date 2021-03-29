const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        ...action.payload,
      };
    case 'CLEAR_AUTH':
      return {
        ...state,
        accessToken: null,
      };
    default:
      return state;
  }
};

export default Reducer;
