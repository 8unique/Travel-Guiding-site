const PlaceRepository = require("../repositories/place.repository");

const registerPlace = (data) => {
  return PlaceRepository.registerPlace(data);
};

const getPlaces = (user_loc) => {
  return PlaceRepository.getPlaces(user_loc);
};

const getPlace = (by, id) => {
  return PlaceRepository.getPlace(by, id);
};

const createBooking = (data) => {
  return PlaceRepository.createBooking(data);
};

const createReview = (data) => {
  return PlaceRepository.createReview(data);
};

const getReviews = (id) => {
  return PlaceRepository.getReviews(id);
};

const getDashboardData = (placeId) => {
  return PlaceRepository.getDashboardData(placeId);
};

const updateBusinessVisits = (data) => {
  return PlaceRepository.updateBusinessVisits(data);
};

const updateBusinessDetails = (place) => {
  return PlaceRepository.updateBusinessDetails(place);
};

const updateBusinessAddresses = (data) => {
  return PlaceRepository.updateBusinessAddresses(data);
};

export {
  registerPlace,
  getPlaces,
  getPlace,
  createBooking,
  createReview,
  getReviews,
  getDashboardData,
  updateBusinessVisits,
  updateBusinessDetails,
  updateBusinessAddresses,
};
