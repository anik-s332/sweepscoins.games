import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { createTransform, persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import thunk from "redux-thunk";
import reducers from "./reducers";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

const persistedAllReducersKeys = [
  "PreselectMultiPoster",
  "CouponPackage",
  "EighteenPlusModel",
  "OrderIsInPrcessModalState",
  "accessToken",
  "accountUrl",
  "customerDetail",
  "isbillingAsHomeAddress",
  "is_login",
  "profiledata",
  "referData",
  "selectPosterMulti",
  "selectedPosters",
  "blogList",
  "blogDetail",
] as const;

const allReducersTransform = createTransform(
  (inboundState, key) => {
    if (key !== "allReducers" || !inboundState) {
      return inboundState;
    }

    return persistedAllReducersKeys.reduce<Record<string, unknown>>((acc, field) => {
      acc[field] = inboundState[field];
      return acc;
    }, {});
  },
  (outboundState) => outboundState,
);

const persistConfig = {
  key: "chathub-store",
  storage,
  version: 2,
  transforms: [allReducersTransform],
};

const middleware = [thunk];

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer, applyMiddleware(...middleware));

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof reducers>;
export type AppStore = typeof store;

export default store;


