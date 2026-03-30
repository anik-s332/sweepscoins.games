// @ts-nocheck
export const ActionTypes = {
    GET_SIGNLE_POSTER: "GET_SIGNLE_POSTER",
    ADD_TO_CART: "ADD_TO_CART",
    SELECT_POSTER_MULTI: "SELECT_POSTER_MULTI",
    CUSTOMER_DETAILS: "CUSTOMER_DETAILS",
    CARD_DETAILS: "CARD_DETAILS",
    PRESELECT_MULTI_POSTER: "PRESELECT_MULTI_POSTER",
    IS_LOGIN: "IS_LOGIN",
    GET_USER: "GET_USER",
    ACCESS_TOKEN: "ACCESS_TOKEN",
    SET_STORE_COUPON_PACKAGE: "SET_STORE_COUPON_PACKAGE",
    UPDATE_USER: "UPDATE_USER",
    UPDATE_PROFILE_PIC: "UPDATE_PROFILE_PIC",
    ACCOUNT_NAVIGATE: "ACCOUNT_NAVIGATE",
    ADD_MY_PRODUCT: "ADD_MY_PRODUCT",
    GET_PRODUCT_ID_WISE: "GET_PRODUCT_ID_WISE",
    GET_PRODUCT_LIST: "GET_PRODUCT_LIST",
    UPDATE_USER_WALLET: "UPDATE_USER_WALLET",
    CLAIM_USER_WALLET: "CLAIM_USER_WALLET",
    SET_LOGOUT_USER: "SET_LOGOUT_USER",
    GET_GEO_COMPLY_LOCATION: "GET_GEO_COMPLY_LOCATION",
    IS_SITE_IS_BLOCK: "IS_SITE_IS_BLOCK",
    GET_IP_ADDRESS: "GET_IP_ADDRESS",
    SPOOFING_DETECTION: "SPOOFING_DETECTION",
    GEOCOMPLY_ISSUE_MESSAGE:"GEOCOMPLY_ISSUE_MESSAGE",
    GET_UNIQUE_BROWSER_ID: "GET_UNIQUE_BROWSER_ID",
    GET_LICENSE_ERROR_MESSAGE: "GET_LICENSE_ERROR_MESSAGE",
    SET_CLEAR_REDUX_FLOW: "SET_CLEAR_REDUX_FLOW",
    GET_PACKAGE_LIST: "GET_PACKAGE_LIST",
    GET_REGEOLC_TIME: "GET_REGEOLC_TIME",
    GET_REGEOLC_CURRENT_TIME: "GET_REGEOLC_CURRENT_TIME",
    CREDIT_LIST: "CREDIT_LIST",
    GET_ORDER_LIST: "GET_ORDER_LIST",
    STOP_OVERCALLING_GEOLOCATION: "STOP_OVERCALLING_GEOLOCATION",
    EIGHTEEN_PLUS_MODEL: "EIGHTEEN_PLUS_MODEL",
    ORDER_IS_IN_PROCESS_MODAL_SET: "ORDER_IS_IN_PROCESS_MODAL_SET",
    GET_REFER_DATA:"GET_REFER_DATA",
    CHECK_RELOAD_CACHE: "CHECK_RELOAD_CACHE",
    BILLING_AS_HOME_ADDRESS: "BILLING_AS_HOME_ADDRESS",
    GET_ALL_ZIPCODES: "GET_ALL_ZIPCODES",
    GET_BLOG_LIST: "GET_BLOG_LIST",
    GET_BLOG_DETAIL: "GET_BLOG_DETAIL",
};

export const EighteenPlusModelFunction = (status) => {
    return {
        type: ActionTypes.EIGHTEEN_PLUS_MODEL,
        payload: status,
    }
};

export const OrderIsInProcessModalStateFct = (status) => {
    return {
        type: ActionTypes.ORDER_IS_IN_PROCESS_MODAL_SET,
        payload: status,
    }
};

export const getLicenseCoplyMessage = (message) => {
    return {
        type: ActionTypes.GET_LICENSE_ERROR_MESSAGE,
        payload: message,
    }
};

export const getOverCallingGeoLocation = (location) => {
    return {
        type: ActionTypes.STOP_OVERCALLING_GEOLOCATION,
        payload: location,
    }
};

export const GetOrderList = (orders) => {
    return {
        type: ActionTypes.GET_ORDER_LIST,
        payload: orders,
    }
}

export const getCreditlist = (credit) => {
    return {
        type: ActionTypes.CREDIT_LIST,
        payload: credit,
    }
}
export const getReferData = (refer) => {
    return {
        type: ActionTypes.GET_REFER_DATA,
        payload: refer,
    }
}

export const getGeoCoplyMessage = (message) => {
    return {
        type: ActionTypes.GEOCOMPLY_ISSUE_MESSAGE,
        payload: message,
    }
};

export const getPackageLists = (list) => {
    return {
        type: ActionTypes.GET_PACKAGE_LIST,
        payload: list,
    }
};


export const ClearReduxFlow = () =>{
    return {
        type: ActionTypes.SET_CLEAR_REDUX_FLOW,
    }
}

export const getGeoCoplyLocation = (data_) => {
    return {
        type: ActionTypes.GET_GEO_COMPLY_LOCATION,
        payload: data_,
    }
};

export const getSpoofingDetection = (data_) => {
    return {
        type: ActionTypes.SPOOFING_DETECTION,
        payload: data_,
    }
};

export const getUniqueBrowserId = (id) => {
    return {
        type: ActionTypes.GET_UNIQUE_BROWSER_ID,
        payload: id,
    }
};

export const GetIPAddress = (ipaddress) => {
    return {
        type: ActionTypes.GET_IP_ADDRESS,
        payload: ipaddress,
    }
};

export const IsSiteIsBlockCheck = (site) => {
    return {
        type: ActionTypes.IS_SITE_IS_BLOCK,
        payload: site,
    }
};

export const claimUserWallet = (wallet) => {
    return {
        type: ActionTypes.CLAIM_USER_WALLET,
        payload: wallet,
    }
};

export const preSelectMultiPoster = (posters) => {
    return {
        type: ActionTypes.PRESELECT_MULTI_POSTER,
        payload: posters,
    }
};

export const CallLogoutUser = () =>{
    return {
        type: ActionTypes.SET_LOGOUT_USER,
    }
}

export const getProductList = (products) => {
    return {
        type: ActionTypes.GET_PRODUCT_LIST,
        payload: products,
    }
};

export const updateUserWallet = (balance) => {
    return {
        type: ActionTypes.UPDATE_USER_WALLET,
        payload: balance,
    }
};

export const getSinglePosters = (posters) => {
    return {
        type: ActionTypes.GET_SIGNLE_POSTER,
        payload: posters,
    }
};

export const AddToCartPosters = (posters) => {
    return {
        type: ActionTypes.ADD_TO_CART,
        payload: posters,
    }
};

export const SelectMultiPosters = (posters) => {
    return {
        type: ActionTypes.SELECT_POSTER_MULTI,
        payload: posters,
    }
}

export const customerDetailsGet = (customer) => {
    return {
        type: ActionTypes.CUSTOMER_DETAILS,
        payload: customer,
    }
}

export const cardDetailsGet = (card) => {
    return {
        type: ActionTypes.CARD_DETAILS,
        payload: card,
    }
}

export const accountNavigate = (link) => {
    return {
        type: ActionTypes.ACCOUNT_NAVIGATE,
        payload: link,
    }
}

export const GetProductsIdWise = (products) => {
    return {
        type: ActionTypes.GET_PRODUCT_ID_WISE,
        payload: products,
    }
}

export const AddMyProduct = (product) => {
    return {
        type: ActionTypes.ADD_MY_PRODUCT,
        payload: product,
    }
}

export const GetCategory = (categorys) => {
    return {
        type: ActionTypes.GET_CATEGORY,
        payload: categorys,
    }
}

export const getIdWiseCategoryList = (category) => {
    return {
        type: ActionTypes.ID_WISE_CATEGORY,
        payload: category,
    }
}

export const checkLogin = (status) => {
    return {
        type: ActionTypes.IS_LOGIN,
        payload: status,
    }
}

export const getUser = (user) => {
    return {
        type: ActionTypes.GET_USER,
        payload: user,
    }
}

export const getRegioLcTime = (time) => {
    return {
        type: ActionTypes.GET_REGEOLC_TIME,
        payload: time,
    }
}

export const getRegioCurrentLcTime = (time) => {
    return {
        type: ActionTypes.GET_REGEOLC_CURRENT_TIME,
        payload: time,
    }
}

export const updateProfilePic = (profile) => {
    return {
        type: ActionTypes.UPDATE_PROFILE_PIC,
        payload: profile,
    }
}

export const updateUser = (user) => {
    return {
        type: ActionTypes.UPDATE_USER,
        payload: user,
    }
}

export const getAccessToken = (token) => {
    return {
        type: ActionTypes.ACCESS_TOKEN,
        payload: token,
    }
}

export const setStoreCouponPackage = (token) => {
    return {
        type: ActionTypes.SET_STORE_COUPON_PACKAGE,
        payload: token,
    }
}

export const CheckReloadCache = (load) => {
    return {
        type: ActionTypes.CHECK_RELOAD_CACHE,
        payload: load,
    }
}

export const getIsBillingAsHomeAddress = (billing) => {
    return {
        type: ActionTypes.BILLING_AS_HOME_ADDRESS,
        payload: billing,
    }
}

export const getAllZipCodes = (zipcodes) => {
    return {
        type: ActionTypes.GET_ALL_ZIPCODES,
        payload: zipcodes,
    }
}
export const getBlogList = (blogs) => {
    return {
        type: ActionTypes.GET_BLOG_LIST,
        payload: blogs,
    }
}

export const getBlogDetail = (blog) => {
    return {
        type: ActionTypes.GET_BLOG_DETAIL,
        payload: blog,
    }
}

