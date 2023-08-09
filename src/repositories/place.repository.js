import {
  query,
  child,
  push,
  ref,
  set,
  orderByChild,
  equalTo,
  get,
  update,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import moment from "moment";

import { db, firebaseConfig, storage } from "../config/firebase.config";

const registerPlace = async (data) => {
  return new Promise(async (resolve, reject) => {
    const key = push(child(ref(db), "place")).key;
    const businessId = (await getLastBusinessId()) + 1;
    await set(ref(db, `place/${key}`), {
      id: key,
      owner_id: data.userId,
      business_id: businessId,
      business_name: data.businessName,
      business_type: data.businessType,
      phone_number: data.phoneNumber,
      addresses: data.addresses,
      starting_price: data.startingPrice,
      opening_time: data.openingTime,
      closing_time: data.closingTime,
      description: data.description,
    })
      .then(async () => {
        await uploadImages(Array.from(data.images), key)
          .then(async (imgUrls) => {
            await update(ref(db, `place/${key}`), {
              images: imgUrls,
            }).then(() => resolve(key));
          })
          .catch((err) => reject(err));
      })
      .catch(() => reject("Failed to create place"));
  });
};

/**
 * Retrieves places from the database based on the user's location.
 * This function uses the user's location to query the database and fetch relevant places.
 * @param {object} user_loc - The user's location object.
 * @returns {Promise<Array>} - A promise that resolves with an array of places.
 */
const getPlaces = async (user_loc) => {
  const fbQuery = query(ref(db, "place/"));
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => {
        var lat1 = user_loc.location.y;
        var lng1 = user_loc.location.x;
        var places = [];
        // Change radius (km) as required between user and place
        var distanceBetweenUserAndLoc = 3;

        Object.keys(snapshot.val()).forEach((k) => {
          var p = snapshot.val()[k];
          for (var i = 0; i < p.addresses.length; i++) {
            var address = p.addresses[i];
            if (
              getDistanceFromLatLonInKm(lat1, lng1, address.lat, address.lng) <=
              distanceBetweenUserAndLoc
            ) {
              p.addresses = [address];
              places.push(p);
            }
          }
        });
        resolve(places);
      })
      .catch((err) => reject(err));
  });
};

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * This function determines the great-circle distance between two points given their longitudes and latitudes.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} - The distance between the two points in kilometers.
 */
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371;
  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

/**
 * Converts degrees to radians.
 * This function converts a degree value to its equivalent in radians.
 * @param {number} deg - The degree value to be converted.
 * @returns {number} - The equivalent value in radians.
 */
const degreesToRadians = (deg) => {
  return deg * (Math.PI / 180);
};

const getPlace = async (by, id) => {
  const fbQuery = query(ref(db, "place/"), orderByChild(by), equalTo(id));
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => resolve(snapshot.val()))
      .catch((err) => reject(err));
  });
};

const uploadImages = async (images, key) => {
  return new Promise(async (resolve, reject) => {
    await Promise.all(
      images.map((file) => {
        return new Promise(async (resolve, reject) => {
          await uploadBytesResumable(
            storageRef(storage, `/place/${key}/${file.name}`),
            file
          )
            .then((res) => getDownloadURL(res.ref).then((url) => resolve(url)))
            .catch((err) => reject(err));
        });
      })
    )
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};

const getLastBusinessId = async () => {
  const fbQuery = query(ref(db, "place/"));
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => resolve(Object.keys(snapshot.val()).length))
      .catch(() => resolve(0));
  });
};

const createBooking = async (data) => {
  return new Promise(async (resolve, reject) => {
    const key = push(child(ref(db), "bookings")).key;
    await set(ref(db, `bookings/${key}`), {
      id: key,
      place_id: data.placeId,
      user_id: data.userId,
      name: data.name,
      email: data.email,
      phone_number: data.phoneNumber,
      booked_at: data.bookedAt,
      details: data.details,
      status: "Pending",
      placed_at: moment().format("YYYY-MM-DD HH:mm").toString(),
    })
      .then(() => resolve("Success"))
      .catch(() => reject("Failed to create booking"));
  });
};

const createReview = async (data) => {
  return new Promise(async (resolve, reject) => {
    var reviewCount = await countReviews(data.reviewerId, data.placeId);
    if (reviewCount < 2) {
      const key = push(child(ref(db), "reviews")).key;
      await set(ref(db, `reviews/${key}`), {
        id: key,
        place_id: data.placeId,
        review: data.review,
        rating: data.rating,
        name: data.name,
        reviewer_id: data.reviewerId,
        placed_at: moment().format("YYYY-MM-DD HH:mm").toString(),
      })
        .then(() => resolve("Success"))
        .catch(() => reject("Failed to create review"));
    } else {
      reject("Review limit reached for this place.");
    }
  });
};

const countReviews = async (reviewerId, placeId) => {
  const fbQuery = query(
    ref(db, "reviews/"),
    orderByChild("reviewer_id"),
    equalTo(reviewerId)
  );
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => {
        var count = 0;
        Object.keys(snapshot.val()).forEach((key) => {
          if (snapshot.val()[key].place_id === placeId) {
            count++;
          }
        });
        resolve(count);
      })
      .catch(() => resolve(0));
  });
};

const getReviews = async (placeId) => {
  const fbQuery = query(
    ref(db, "reviews/"),
    orderByChild("place_id"),
    equalTo(placeId)
  );
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => resolve(snapshot.val()))
      .catch((err) => reject(err));
  });
};

/**
 * Retrieves dashboard data for a specific place.
 * This function fetches data related to bookings, starting price, and visits for the specified place.
 * @param {string} placeId - The ID of the place for which the dashboard data is fetched.
 * @returns {Promise<object>} - A promise that resolves with an object containing bookings, startingPrice, and visits data.
 */
const getDashboardData = async (placeId) => {
  const bookingsQuery = query(
    ref(db, "bookings/"),
    orderByChild("place_id"),
    equalTo(placeId)
  );

  return new Promise(async (resolve, reject) => {
    var bookings = 0;
    var startingPrice = 0;
    var visits = 0;
    await get(bookingsQuery).then((snapshot) => {
      snapshot.val() &&
        Object.keys(snapshot.val()).forEach((key) => {
          var b = snapshot.val()[key];
          if (
            (b.status === "Pending" || b.status === "Approved") &&
            moment(b.placed_at).isAfter(moment().subtract(14, "days"))
          ) {
            bookings++;
          }
        });
    });

    await get(child(ref(db), `place/${placeId}/starting_price`))
      .then((snapshot) => (startingPrice = snapshot.val() * bookings))
      .catch((err) => reject(err));

    await get(child(ref(db), `place/${placeId}/visits`))
      .then((snapshot) => (visits = snapshot.val()))
      .catch((err) => reject(err));

    resolve({ bookings, startingPrice, visits });
  });
};

const updateBusinessVisits = async (data) => {
  return new Promise(async (resolve, reject) => {
    update(ref(db, `place/${data.id}`), {
      visits: data.visits,
      last_updated: moment().format("YYYY-MM-DD HH:mm").toString(),
    })
      .then(async () => resolve("Success"))
      .catch((err) => reject(err));
  });
};

const updateBusinessDetails = async (data) => {
  return new Promise(async (resolve, reject) => {
    update(ref(db, `place/${data.id}`), {
      business_name: data.business_name,
      starting_price: data.starting_price,
      opening_time: data.opening_time,
      closing_time: data.closing_time,
      description: data.description,
      last_updated: moment().format("YYYY-MM-DD HH:mm").toString(),
    })
      .then(async () => {
        if (data.imagesToBeRemoved.length > 0)
          await removeImages(data.id, data.imagesToBeRemoved, data.images);

        if (data.additionalImages.length > 0)
          await addNewImages(data.id, data.additionalImages, data.images);

        resolve("Success");
      })
      .catch((err) => reject(err));
  });
};

const updateBusinessAddresses = async (data) => {
  return new Promise(async (resolve, reject) => {
    update(ref(db, `place/${data.id}`), {
      addresses: data.addresses,
      last_updated: moment().format("YYYY-MM-DD HH:mm").toString(),
    })
      .then(async () => resolve("Success"))
      .catch((err) => reject(err));
  });
};

const addNewImages = async (place_id, images, currImages) => {
  return new Promise(async (resolve, reject) => {
    await uploadImages(images, place_id)
      .then(async (imgUrls) => {
        currImages.push(...imgUrls);
        await set(ref(db, `place/${place_id}/images`), currImages)
          .then(() => resolve("Success"))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const removeImages = async (place_id, imagesToBeRemoved, imagedToBeUpdated) => {
  return new Promise(async (resolve, reject) => {
    await Promise.all(
      imagesToBeRemoved.map(async (img) => {
        return new Promise(async (resolve, reject) => {
          var imagePath = img.replace(
            `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/`,
            ""
          );
          imagePath = imagePath.substring(0, imagePath.indexOf("?"));
          imagePath = imagePath.replace(/%2F/g, "/");
          await deleteObject(storageRef(storage, imagePath)).then(async () => {
            await update(ref(db, `place/${place_id}`), {
              images: imagedToBeUpdated,
            })
              .then(() => resolve("Success"))
              .catch((err) => reject(err));
          });
        });
      })
    )
      .then((values) => resolve(values))
      .catch(() => reject("Failed to remove images"));
  });
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
