// @ts-nocheck
export const HOME_LANDING_URL = "/";
export const HOME_URL = "/home";
export const MEMBER_DASHBOARD = "/member-dashboard";    
export const MY_ACCOUNT = "/my-account";
export const PRIVACY_POLICY = "/privacy-policy";
export const RESPONSIBLE_GAME_PLAY = "/responsible-game-play";
export const TERMS_CONDITIONS = "/terms-and-conditions";
export const PROMOTIONAL_RULES = "/promotional-rules";
export const CONTACT = "/contact";
export const RESET_PASSWORD = "/reset-password";
export const PACKAGES = "/packages";
export const BLOGS = "/blogs";
export const CHECK_OUT_PACKAGE = "/checkout-package";
export const USER_DATA_DETECTION = "/user-data-deletion";
export const FREE_CREDIT = "/free-credit";
export const CHECK_OUT_PACKAGE_TIERLOCK = "/checkout-package-tierlock";

// Api urls
export const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const RESET_PASSWORD_API_URL = API_URL + "user/create-password/";
export const LOGIN_API_URL = API_URL + "user/login";
export const SIGN_UP_API_URL = API_URL + "user/sign-up";
export const LOGOUT_API_URL = API_URL + "user/logout";
export const FORGOT_PASSWORD_API_URL = API_URL + "user/forgot-password";
export const CREATE_PASSWORD_API_URL = API_URL + "user/create-password";
export const FILE_UPLOAD_API_URL = API_URL + "file/profile-upload";
export const PROFILE_UPDATE_API_URL = API_URL + "user/profile-update";
export const REQUEST_FOR_REFERRAL = API_URL+ 'user/referral-requests'
export const GET_PROFILE_API_URL = API_URL + "user/get";
export const PROFILE_UPLOAD_API_URL = API_URL + "file/profile-upload";
export const GET_PRODUCT_API_URL = API_URL + "product/list";
export const PLACE_PRODUCT_ORDER_API_URL = API_URL + "user/place-order";
export const PAYMENT_PLACE_ORDER_API_URL = API_URL + "user/payment";
export const PRE_SELECTED_PRODUCT = API_URL + "product/pre-selected/";
export const CONTACT_US_API_URL = API_URL + "contact-us";
export const SUBSCRIBE_API_URL = API_URL + "subscribe";
export const SOCIAL_FIREBASE_API_URL = API_URL + "user/social-auth";
export const USER_CREDIT_REQUEST_API_URL = API_URL + "user/credit-request/";
export const USER_CREDIT_LIST_API_URL = API_URL + "user/credit/list";
export const USER_REDEEM_COUPON_API_URL = API_URL + "user/redeem/";
export const ALL_SESSION_LOGOUT_API_URL = API_URL + "user/auth";
export const USER_VALID_LOGIN_API_URL = API_URL + "user/validate/login";
export const PACKAGES_LIST_API_URL = API_URL + "package/list";
export const ORDER_LIST_API_URL = API_URL + "user/order/list";
export const COIN_FLOW_PAYMENT_API_URL = API_URL + "user/coinflow-payment";

export const GET_GEO_LOCATE_LICENSE = API_URL + "user/geocomply/license";
export const GET_GEO_LOCATE_PERMISSION_LICENSE = API_URL + "user/geocomply/permission";
export const POST_PLACE_ORDER_COUPON = API_URL + "user/place-order-coupon";
export const GET_CREDIT_COUPON = API_URL + "user/coupon-package";
export const ADMIN_REFERRAL_CONDITION_DETAIL_API = API_URL +"admin/referral/condition-details";
export const USER_KYC_API = API_URL +"user/kyc";

export const GET_COIN_FLOW_PAYMENT_LINK_API_URL = API_URL + "user/coinflow-payment-link";
export const GET_COOIN_FLOW_WALLET_API_URL = API_URL + "user/coinflow-get-wallet";
export const GET_COIN_FLOW_ORDER_API_URL = API_URL + "user/coinflow-get-order";

// new api 2024
export const USER_CRYPTO_PAYMENT_API_URL = API_URL + "user/crypto-payment";
export const USER_ORDER_STATUS_URL = API_URL + "user/order-status";

// tierlock api
export const USER_TIERLOCK_STATUS_URL = API_URL + "user/tierlock-link";



