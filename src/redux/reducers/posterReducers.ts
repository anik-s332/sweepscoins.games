// @ts-nocheck
/* eslint-disable */
import { ActionTypes } from "../../redux/actions";

const initailData = {
    singlposterslist: [],
    selectedPosters: [],
    selectPosterMulti: {
        cart: 1,
        amount: 3.99,
    },
    PreselectMultiPoster: false,
    is_login: "no",
    profiledata: {},
    accessToken: "",
    customerDetail : {},
    referData : {},
    cardDetails: {},
    accountUrl: "my-books",
    myproducts: [],
    products: [],
    productidObjects: {},
    checkCacheNewz: "",
    geoComplyLocation: "",
    isSiteBlock: true,
    ipAddress: "",
    spoofingDetection:"",
    ComplyErrorMessage: "",
    UniqueBrowserId: "",
    LicenseErrorMsg: "",
    packageList: [],
    ReGeoLcTimeGet: "",
    ReGeoLcCurrentTimeGet: "",
    creditList: [],
    orderlist: [],
    StopOverCalling: false,
    EighteenPlusModel: false,
    CouponPackage: null,
    OrderIsInPrcessModalState: {
        open: false,
        iframe: ""
    },
    isbillingAsHomeAddress: true,
    zipCodesAll: [],
    reload: false,
}

export const posterReducers = (state = initailData, action) => {
    switch(action.type) {
        case ActionTypes.EIGHTEEN_PLUS_MODEL :
            return { 
                ...state, 
                EighteenPlusModel : action.payload, 
            };
        case ActionTypes.GET_LICENSE_ERROR_MESSAGE :
            return { 
                ...state, 
                LicenseErrorMsg : action.payload, 
            };
        case ActionTypes.STOP_OVERCALLING_GEOLOCATION :
            return { 
                ...state, 
                StopOverCalling : action.payload, 
            };
        case ActionTypes.GET_REGEOLC_TIME :
            return { 
                ...state, 
                ReGeoLcTimeGet : action.payload, 
            };
        case ActionTypes.GET_REGEOLC_CURRENT_TIME :
            return { 
                ...state, 
                ReGeoLcCurrentTimeGet : action.payload, 
            };
        case ActionTypes.GET_SIGNLE_POSTER :
            return { 
                ...state, 
                singlposterslist : action.payload, 
            };
        case ActionTypes.CREDIT_LIST:
            return {
                ...state,
                creditList: action.payload,
            };
        case ActionTypes.GET_ORDER_LIST:
            return {
                ...state,
                orderlist: action.payload,
            };
        case ActionTypes.GET_UNIQUE_BROWSER_ID :
            return { 
                ...state, 
                UniqueBrowserId : action.payload, 
            };
        case ActionTypes.GET_GEO_COMPLY_LOCATION :
            return {
                ...state,
                geoComplyLocation : action.payload,
            }
        case ActionTypes.GEOCOMPLY_ISSUE_MESSAGE :
            return {
                ...state,
                ComplyErrorMessage : action.payload,
            }
        case ActionTypes.IS_SITE_IS_BLOCK :
            return {
                ...state,
                isSiteBlock : action.payload,
            }
        case ActionTypes.SPOOFING_DETECTION :
            return {
                ...state,
                spoofingDetection : action.payload,
            }
        case ActionTypes.GET_IP_ADDRESS : 
            return {
                ...state,
                ipAddress: action.payload
            }
        case ActionTypes.ADD_TO_CART :
            return {
                ...state,
                selectedPosters : action.payload,
            };
        case ActionTypes.GET_PRODUCT_LIST :
            return {
                ...state,
                products : action.payload
            }
        case ActionTypes.PRESELECT_MULTI_POSTER :
            return {
                ...state,
                PreselectMultiPoster : action.payload
            }
        case ActionTypes.SELECT_POSTER_MULTI :
            return {
                ...state,
                selectPosterMulti : {
                    cart: action.payload.cart,
                    amount : action.payload.amount,
                },
            }
        case ActionTypes.CUSTOMER_DETAILS :
            return { 
                ...state, 
                customerDetail : action.payload, 
            };
        case ActionTypes.GET_REFER_DATA :
            return { 
                ...state, 
                referData : action.payload, 
            };
        case ActionTypes.SET_STORE_COUPON_PACKAGE:
            return { 
                ...state, 
                CouponPackage: action.payload, 
            };
        case ActionTypes.CARD_DETAILS :
            return { 
                ...state, 
                cardDetails : action.payload, 
            };
        case ActionTypes.IS_LOGIN :
            return { 
                ...state, 
                is_login : action.payload, 
            };
        case ActionTypes.ACCOUNT_NAVIGATE :
            return {
                ...state,
                accountUrl: action.payload,
            };
        case ActionTypes.GET_USER :
            return { 
                ...state, 
                profiledata: action.payload, 
            };
        case ActionTypes.UPDATE_USER_WALLET :
            const OldProfileBalance = state.profiledata;
            OldProfileBalance.user_balance = action?.payload?.user_balance;
            
            return { 
                ...state, 
                profiledata: OldProfileBalance, 
            };
        case ActionTypes.CLAIM_USER_WALLET :
            const OldProfileBalances = state.profiledata;
            OldProfileBalances.user_balance = OldProfileBalances.user_balance - parseInt(action?.payload?.amount);
            
            return { 
                ...state, 
                profiledata: OldProfileBalances, 
            };
        case ActionTypes.GET_PACKAGE_LIST :
            return { 
                ...state, 
                packageList: action.payload, 
            };
        case ActionTypes.ADD_MY_PRODUCT :
            const products = Array.isArray(state?.myproducts) ? [...state.myproducts] : [];
            products.unshift(action.payload);
            return { 
                ...state, 
                myproducts: products, 
            };
        case ActionTypes.GET_PRODUCT_ID_WISE :
            const productlists = [...action.payload];
            let arrayproducts = {};
            productlists && productlists.map((elm) => {
                arrayproducts[elm.id] = elm;
            });

            return {
                ...state,
                productidObjects : arrayproducts
            };
        case ActionTypes.UPDATE_USER :
            return { 
                ...state, 
                profiledata: action.payload, 
            };
        case ActionTypes.GET_CATEGORY : 
            return {
                ...state,
                categorylist: action.payload,
            }
        case ActionTypes.UPDATE_PROFILE_PIC : 
            const OldProfile = state.profiledata;
            OldProfile.user_avatar_path = action.payload;

            return {
                ...state,
                profiledata : OldProfile,
            }
        case ActionTypes.ACCESS_TOKEN :
            return { 
                ...state, 
                accessToken : action.payload, 
            };
        case ActionTypes.ORDER_IS_IN_PROCESS_MODAL_SET:
            return {
                ...state,
                OrderIsInPrcessModalState: {
                    ...state.OrderIsInPrcessModalState,
                    open: action.payload?.open,
                    iframe: action.payload?.iframe
                },
            };
        case ActionTypes.BILLING_AS_HOME_ADDRESS:
            return {
                ...state,
                isbillingAsHomeAddress: action.payload
            };
        case ActionTypes.CHECK_RELOAD_CACHE:
            return {
                ...state,
                reload: action.payload
            };
        case ActionTypes.GET_ALL_ZIPCODES:
           return {
                ...state,
                zipCodesAll: action.payload
            };
        case  ActionTypes.SET_LOGOUT_USER :
            return {
                ...state,
                singlposterslist: [],
                selectedPosters: [],
                selectPosterMulti: {
                    cart: 1,
                    amount: 3.99,
                },
                PreselectMultiPoster: false,
                is_login: "no",
                profiledata: {},
                accessToken: "",
                customerDetail : {},
                cardDetails: {},
                accountUrl: "my-books",
                productidObjects: {},
                checkCacheNewz: "",
                isbillingAsHomeAddress: true,
                isSiteBlock: true,
            };
        case  ActionTypes.SET_CLEAR_REDUX_FLOW :
            return initailData;
        default:
            return state;
    }
}
