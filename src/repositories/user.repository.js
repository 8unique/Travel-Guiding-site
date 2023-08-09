import {
  ref,
  get,
  set,
  query,
  orderByChild,
  equalTo,
  remove,
  update,
} from "firebase/database";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from "firebase/auth";
import moment from "moment";

import { auth, provider, db } from "../config/firebase.config";

const PlaceService = require("../services/place.service");

const getUser = async (by, value) => {
  const fbQuery = query(ref(db, "users/"), orderByChild(by), equalTo(value));
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => resolve(snapshot.val()))
      .catch((err) => reject(err));
  });
};

const registerUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    await createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        if (userCredential !== null || userCredential !== undefined) {
          set(ref(db, `users/${auth.currentUser.uid}`), {
            id: auth.currentUser.uid,
            name: user.name,
            email: user.email,
            phone_number: user.phoneNumber,
            joined_date: moment().format("YYYY-MM-DD HH:mm").toString(),
            user_type:
              user.userType === 0
                ? "Traveler"
                : user.userType === 1 && "Business Owner",
          }).then(async () => {
            if (user.userType === 1) {
              const place = {
                userId: auth.currentUser.uid,
                businessName: user.businessName,
                businessType: user.businessType,
                phoneNumber: user.phoneNumber,
                addresses: user.addresses,
                startingPrice: user.startingPrice,
                openingTime: user.openingTime,
                closingTime: user.closingTime,
                description: user.description,
                images: user.images,
              };
              await PlaceService.registerPlace(place)
                .then((key) => {
                  update(ref(db, `users/${auth.currentUser.uid}`), {
                    place_id: key,
                    last_updated: moment()
                      .format("YYYY-MM-DD HH:mm")
                      .toString(),
                  })
                    .then(() => resolve("Success"))
                    .catch(() =>
                      reject(
                        "Account created, but failed to update business id"
                      )
                    );
                })
                .catch(async () => {
                  await remove(`users/${auth.currentUser.uid}`).then(() =>
                    reject("Account creation failed")
                  );
                });
            } else {
              resolve("Success");
            }
          });
        }
      })
      .catch((err) => reject(err.code));
  });
};

const loginUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    await signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        if (userCredential !== null || userCredential !== undefined) {
          getUser("email", user.email).then((response) =>
            resolve(response[auth.currentUser.uid])
          );
        }
      })
      .catch((err) => reject(err.code));
  });
};

const loginUserWithGoogle = async () => {
  return new Promise(async (resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        getUser("email", result.user.email)
          .then((response) => resolve(response[result.user.uid].name))
          .catch((err) => {
            if (err) {
              set(ref(db, `users/${result.user.uid}`), {
                id: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                phone_number: null,
                joined_date: moment().format("YYYY-MM-DD HH:mm").toString(),
              }).then(() => resolve(result.user.displayName));
            }
          });
      })
      .catch((err) => reject(err.code));
  });
};

const updateUserDetails = async (data) => {
  return new Promise(async (resolve, reject) => {
    update(ref(db, `users/${data.id}`), {
      name: data.name,
      phone_number: data.phoneNumber,
      last_updated: moment().format("YYYY-MM-DD HH:mm").toString(),
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err.code));
  });
};

const updateUserPassword = async (data) => {
  return new Promise(async (resolve, reject) => {
    auth.currentUser.providerData.some((e) => e.providerId.includes("google"))
      ? await reauthenticateWithPopup(auth.currentUser, provider)
          .then(() => {
            continueUserPasswordUpdate(data.newPassword)
              .then((res) => resolve(res))
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err))
      : await reauthenticateWithCredential(
          auth.currentUser,
          EmailAuthProvider.credential(data.email, data.currPassword)
        )
          .then(() => {
            continueUserPasswordUpdate(data.newPassword)
              .then((res) => resolve(res))
              .catch((err) => reject(err));
          })
          .catch(() => reject("Failed to update password"));
  });
};

const continueUserPasswordUpdate = async (newPassword) => {
  return new Promise(async (resolve, reject) => {
    await updatePassword(auth.currentUser, newPassword)
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

const logoutUser = async () => {
  return new Promise(async (resolve, reject) => {
    await signOut(auth);
    resolve("logged out");
  });
};

const resetUserPassword = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      await sendPasswordResetEmail(auth, email);
      resolve("Reset mail sent");
    } catch (err) {
      reject(err.code);
    }
  });
};

const confirmUserPasswordReset = async (oobCode, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      resolve("password change success");
    } catch (err) {
      reject(err.code);
    }
  });
};

const getUserBookings = async (user_id, place_id) => {
  const fbQuery = query(
    ref(db, "bookings/"),
    orderByChild("user_id"),
    equalTo(user_id)
  );

  return new Promise(async (resolve, reject) => {
    var result = [];
    await get(fbQuery).then((snapshot) => {
      snapshot.val() && result.push(snapshot.val());
    });

    place_id &&
      getPlaceBookings(place_id).then((res) => {
        result.push(res);
      });

    result.length > 0
      ? resolve(
          result.filter(
            (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
          )[0]
        )
      : reject("Couldn't fetch data");
  });
};

const getPlaceBookings = async (place_id) => {
  const fbQuery = query(
    ref(db, "bookings/"),
    orderByChild("place_id"),
    equalTo(place_id)
  );

  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => resolve(snapshot.val()))
      .catch((err) => reject(err));
  });
};

const updateBookingStatus = async (id, status) => {
  return new Promise(async (resolve, reject) => {
    update(ref(db, `bookings/${id}`), {
      status: status,
      last_updated: moment().format("YYYY-MM-DD HH:mm").toString(),
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err.code));
  });
};

export {
  getUser,
  resetUserPassword,
  confirmUserPasswordReset,
  registerUser,
  loginUser,
  loginUserWithGoogle,
  updateUserDetails,
  updateUserPassword,
  logoutUser,
  getUserBookings,
  updateBookingStatus,
};
