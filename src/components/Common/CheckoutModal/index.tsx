// @ts-nocheck
/* eslint-disable */
import { City, Country, State } from 'country-state-city';
import moment from "moment";
import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from '@/lib/router';
import { toast } from 'react-toastify';
import { images } from "@/content";
import sound from "../../../assets/audio/apple_pay_sound.wav";
import ErrorIcon from "../../../assets/img/error.svg";
import RightArrowIcon from "../../../assets/img/RightArrowIcon.svg";
import SecureImage from "../../../assets/img/secure.webp";
import SucessIcon from "../../../assets/img/success.svg";
import { subtractYearsFromDate } from "../../../components/Account/function";
import { AddMyProduct, CallLogoutUser, cardDetailsGet, checkLogin, customerDetailsGet, getAccessToken, getGeoCoplyMessage, getIsBillingAsHomeAddress, getOverCallingGeoLocation, getRegioLcTime, getUser, OrderIsInProcessModalStateFct } from "../../../redux/actions";
import PostRequest from "../../Account/PostRequest";
import { CHECK_OUT_PACKAGE, GET_PROFILE_API_URL, HOME_URL, PACKAGES, PAYMENT_PLACE_ORDER_API_URL, PLACE_PRODUCT_ORDER_API_URL, USER_CRYPTO_PAYMENT_API_URL, USER_KYC_API, USER_TIERLOCK_STATUS_URL } from "../../Shared/constant";
import CashPayComponent from "../CashPayComponent";
import CommonBillingAddressForm from "../CommonBillingAddressForm";
import CountrySelectInput from "../CountrySelectInput/CountryMobileInput";
import CustomMendotoryMsg from "../CustomMendotoryMsg";
import OrderInProcessModal from "../OrderInProcessModal";
import OrderProcessCancelModal from "../OrderProcessCancelModal";
import PaymentMethedModal from "../PaymentMethedModal";
import AppImage from "../AppImage";
import CardTokenizationForm from "./CardTokenizationForm";

const CheckoutModal = (props) => {
    const audioMedia = new Audio(sound);
    const Navigate = useNavigate();
    const { selectedProduct, checkoutPoup, setCheckoutPoup, SuccessPopup, setSuccessPopup } = props;
    const { accessToken, customerDetail, UniqueBrowserId, OrderIsInPrcessModalState, profiledata, isbillingAsHomeAddress } = useSelector((state) => state.allReducers);
    const phone = profiledata?.phone;
    const phoneCountry = profiledata?.phone?.replace("-", " ")?.split(" ");
    const lastTenDigits = phone?.slice(-10);
    const [ MobileNo, setMobileNo ] = useState({
        countrycode: phoneCountry?.length>0 && profiledata?.phone?.includes(" ")?phoneCountry?.[0]?.replace("-NaN", ""):"1",
        number: lastTenDigits || "",
    });
    const [fname, setFname] = useState(profiledata?.first_name || "");
    const [lname, setLname] = useState(profiledata?.last_name || "");
    const [email, setEmail] = useState(profiledata?.email || "");
    const [ Birthdate, setBirthdate ] = useState(profiledata?.dob ? new Date(profiledata?.dob) :"");
    const [show, setShow] = React.useState(false);
    const [ SelectCountry, setSelectCountry ] = useState(
        {
            key: 232,
            label: "United States",
            value: "US"
        }
    );
    const [ isDisableBilling, setisDisableBilling ] = useState(false);

    useEffect(() => {
        UserGetAPI_Function();
    }, []);

    const [ KycAddress, setKycAddress ] = useState({
        country: "US",
        city: "",
        state: "",
        zip: "",
        street2: (profiledata?.address?.billing_address===null || profiledata?.address?.billing_address===undefined || profiledata?.address?.billing_address==="")?"":profiledata?.address?.billing_address,
    });

    const UserGetAPI_Function = () => {
        window.axios.get(GET_PROFILE_API_URL, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }}).then(function (result) {
            if(result?.status === 200) {
                dispatch(getUser(result?.data?.data));
            };
        }).catch(function (result) {
            if(result?.response?.status === 403) {
                dispatch(CallLogoutUser());
            }
        });
    };

    const KYCVerification  = async() =>{
        const IP = await callAPI();

        const payload = {
            // ssn:SSN?.replace(/-/g, ""),
            dob_year: moment(Birthdate).format('YYYY'),
            dob_month: moment(Birthdate).format('MM'),
            dob_day: moment(Birthdate).format('DD'),
            user_ip:IP
        }
        if(Object.keys(profiledata?.address).length === 0) {
            dispatch(getIsBillingAsHomeAddress(false));
        };
        if(Object.keys(profiledata?.address).length === 0 || (isbillingAsHomeAddress === false || isbillingAsHomeAddress === undefined)) {
            payload.street_address = KycAddress?.street2;
            payload.country = KycAddress.country;
            payload.state = KycAddress.state;
            payload.city = KycAddress.city;
            payload.zipcode = KycAddress.zip;
            payload.billing_address = KycAddress?.street2;
            payload.billing_country = KycAddress.country;
            payload.billing_state = KycAddress.state;
            payload.billing_city = KycAddress.city;
            payload.billing_zipcode = KycAddress.zip;
        } else {
            payload.street_address = profiledata?.address?.street_address,
            payload.country = profiledata?.address?.country,
            payload.state = profiledata?.address?.state,
            payload.city = profiledata?.address?.city,
            payload.zipcode = profiledata?.address?.zipcode,
            payload.billing_address = KycAddress?.street2;
            payload.billing_country = KycAddress.country;
            payload.billing_state = KycAddress.state;
            payload.billing_city = KycAddress.city;
            payload.billing_zipcode = KycAddress.zip;
        };

        const response = await PostRequest(
            USER_KYC_API,
            payload,
            accessToken,
            false
        );
        if (response?.status === 200) {
            setStepUpdate("paymentdetailsmethod");
            UserGetAPI_Function()
        } else if(response?.status === 401){
            if(Array.isArray(response?.data?.error?.error)) {
                toast.error(<ul>{response?.data?.error?.error.map((msg, index) => {
                    return(<li key={index}>{msg}</li>)
                })}</ul>);
            } else {
                toast.error(response?.data?.error?.error, { autoClose: 5000 });
            }
        } else if(response?.status === 400){
            if(Array.isArray(response?.data?.error?.error)) {
                toast.error(<ul>{response?.data?.error?.error.map((msg, index) => {
                    return(<li key={index}>{msg}</li>)
                })}</ul>);
            } else {
                toast.error(response?.data?.error?.error, { autoClose: 5000 });
            }
        } else {
            toast.error(response?.data?.error, { autoClose: 5000 });
        };
    };

    var newDate = subtractYearsFromDate(22);

    const [ SelectState, setSelectState ] = useState((profiledata?.address?.state===null||profiledata?.address?.state==="")?"":profiledata?.address?.state);

    const [stateIsoCode,setStateisoCode] = useState("")

    const [optionsState, setOptionsState] = useState([]);
    const [optionsCity, setOptionsCity] = useState([]);


    const [rcode,setRCode] = useState("")
    const [ CustomError, setCustomError ] = useState(false);
    const [ stepUpdate, setStepUpdate ] = useState("yourdetails");
    const dispatch = useDispatch();
    const [ creditCard, setCreditCard ] = useState("");
    const [ creditCardError, setCreditCardError ] = useState("");
    const [ expiryDate, setExpiryDate ] = useState("");
    const [ cvv, setCVV ] = useState("");
    const [ cardholderName, setCardholderName ] = useState("");
    const [ MobileError, setMobileError ] = useState("");
    const [ paymentDropdown, setPaymentDropdown ] = useState(false);
    const [ errorEmail, setErrorEmail ] = useState("");
    const [ errorExpiryDate, setErrorExpiryDate ] = useState("");
    const EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    const { register, handleSubmit, setValue, trigger, setError, clearErrors, formState: { errors } } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            fname: profiledata?.first_name || "",
            lname: profiledata?.last_name || "",
            email: profiledata?.email || "",
            birthdate: profiledata?.dob ? new Date(profiledata?.dob) : null,
        },
    });

    const [ Loader, setLoader ] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("coinflow")
    const [ showHideCvv, setShowHideCvv ] = useState(false);
    const navigate = useNavigate();
    const [ zipCodeBillingValids, setZipCodeBillingValids ] = useState(false);
    const {payment_id} = useParams()
    const [ loading, setLoading ] = useState(false);
    const [ zipLoading, setZipLoading ]  = useState(false);

    useEffect(() => {
        setKycAddress({
            ...KycAddress,
            country: (profiledata?.address?.billing_country===null || profiledata?.address?.billing_country===undefined || profiledata?.address?.billing_country==="")? "US" : profiledata?.address?.billing_country,
            city: (profiledata?.address?.billing_city===null || profiledata?.address?.billing_city===undefined || profiledata?.address?.billing_city==="") ? "": profiledata?.address?.billing_city,
            state: (profiledata?.address?.billing_state===null || profiledata?.address?.billing_state===undefined || profiledata?.address?.billing_state==="") ? "" : profiledata?.address?.billing_state,
            zip: (profiledata?.address?.billing_zipcode===null|| profiledata?.address?.billing_zipcode===undefined || profiledata?.address?.billing_zipcode==="") ? "": profiledata?.address?.billing_zipcode,
            street2: (profiledata?.address?.billing_address===null || profiledata?.address?.billing_address===undefined || profiledata?.address?.billing_address==="") ? "" : profiledata?.address?.billing_address,
        });
    }, [ profiledata ]);

    useEffect(() => {
        setValue("fname", profiledata?.first_name || "");
        setValue("lname", profiledata?.last_name || "");
        setValue("email", profiledata?.email || "");
        setValue("birthdate", profiledata?.dob ? new Date(profiledata?.dob) : null);
    }, [profiledata, setValue]);

    useEffect(()=>{
        if(payment_id){
            if(payment_id == customerDetail?.id){
                setPaymentMethod("cash_app")
                setStepUpdate("payment_option")
            }
        }
    },[customerDetail?.id, payment_id])
    
    // aniket code
    const [ PaymentMethodModalState, setPaymentMethodModalState ] = useState({
        open: false,
        title: "",
    });
    const [ TypePayment, setTypePayment ] = useState("");
    const [ DontWorryModal, setDontWorryModal ] = useState({
        open: false,
        flag: "",
    });
    useEffect(() => {
        const SaveTokenAPI = async (res) => {
            if(typeof res.data == "object"){
                if(res?.data?.type == "response"){
                    if(res?.data?.STATUS === 200){
                        CloseCheckoutModal();
                        toast(res?.data?.data?.msg);
                        dispatch(cardDetailsGet(res.data.data?.data));
                        dispatch(customerDetailsGet(res.data.data?.data));
                        setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});

                    }else{
                        if(typeof res?.data?.data?.error == "string"){
                            toast.info(res?.data?.data?.error)
                        }else if(res?.data?.data?.msg){
                            toast.info(res?.data?.data?.msg)
                        }else{
                            const error = res?.data?.data?.error;
                            if (error && typeof error === 'object') {
                                Object.keys(error).forEach(key => {
                                    const value = error[key];
                                    toast.info(`${key}: ${value}`);
                                });
                            }
                        }
                    }
                }
            }
        };
        addEventListener("message", SaveTokenAPI);
        return ()=>{
            removeEventListener("message", SaveTokenAPI);
        }
    }, []); 
    // select credit card
    const creditcardNo = (e) => {
        setCreditCard(e.target.value.trim().replace(/\s+/g, "").replace(/[^0-9]/gi, "").substr(0, 23));
    };

    const cc_format = (value) => {
        const v = value
          .replace(/\s+/g, "")
          .replace(/[^0-9]/gi, "")
          .substr(0, 23);
        const parts = [];
      
        for (let i = 0; i < v.length; i += 4) {
          parts.push(v.substr(i, 4));
        }
      
        return parts.length > 1 ? parts.join(" ") : value;
    }
    


    const getCountryIsoCodeByName = (countryName) => {
        const country = Country?.getAllCountries()?.find(country => country.name === countryName);
        return country ? country.isoCode : ""; 
    };
    

    const fetchStates = (countryName) => {
        const countryIsoCode = getCountryIsoCodeByName(countryName); 
        if (countryIsoCode) {
            const states = State.getStatesOfCountry(countryIsoCode).map((state, index) => {
                return {
                    label: state.name,
                    value: state.isoCode,
                    key: index
                };
            });
            setOptionsState(states); 
        } else {
            setOptionsState([]); 
        }
    };

    useEffect(() => {
        if(optionsState?.length > 0) {
            const EditSelect = optionsState?.find(option => option?.value === profiledata?.address?.state);
            setSelectState(EditSelect?.label);
        };
    }, [profiledata?.address?.state, optionsState?.length > 0])

    useEffect(()=>{
        fetchStates(SelectCountry.label)
        fetchCities(SelectCountry?.label, SelectState);  

    },[SelectCountry, SelectState])

    const getStateIsoCodeByName = (countryIsoCode, stateName) => {

        const states = State.getStatesOfCountry(countryIsoCode);
        const state = states.find(state => state.name === stateName);  
        return state ? state.isoCode : "";  
    };
    
    const fetchCities = (cisoCode, stateName) => { 
        const countryIsoCode = getCountryIsoCodeByName(cisoCode); 
        if (countryIsoCode && stateName) {
            const stateIsoCode = getStateIsoCodeByName(countryIsoCode, stateName);
            setStateisoCode(stateIsoCode)
    
            if (stateIsoCode) {
                const cities = City.getCitiesOfState(countryIsoCode, stateIsoCode).map((city, index) => {
                    return {
                        label: city.name,
                        value: city.isoCode,  
                        key: index
                    };
                });
                setOptionsCity(cities);  
            } else {
                setOptionsCity([]);
            }
        } else {
            setOptionsCity([]);  
        }
    };   


    const onYourDetailsValid = (data) => {
        setFname(data.fname.trim());
        setLname(data.lname.trim());
        setEmail(data.email.trim());
        setBirthdate(data.birthdate);

        if (MobileNo?.number?.length !== 10) {
            setCustomError(true);
            setMobileError("Please enter 10 digit number");
            return;
        }
        if (KycAddress?.country === "" || KycAddress?.state === "" || KycAddress?.city === "" || KycAddress?.zip === "" || KycAddress?.street2 === "") {
            setCustomError(true);
            return;
        }

        setCustomError(false);
        setErrorEmail("");
        setMobileError("");
        setStepUpdate("paymentdetailsmethod");
    };

    const onYourDetailsInvalid = (formErrors) => {
        setCustomError(true);

        if (formErrors.email) {
            setErrorEmail(formErrors.email.message);
        } else {
            setErrorEmail("");
        }

        if (formErrors.fname) {
            // no specific state for fname errors, use errors from useForm in render
            // keep custom error to show red style
            setCustomError(true);
        }

        if (formErrors.lname) {
            setCustomError(true);
        }

        if (formErrors.birthdate) {
            setCustomError(true);
        }
    };

    const PaymentSelectMethodWithKyc = () => {
        handleSubmit(onYourDetailsValid, onYourDetailsInvalid)();
    };

    // fill form then submit
    const PaymentSelectMethod = () => {
        if (Birthdate === "" || Birthdate === null) {
            setError("birthdate", {
                type: "manual",
                message: "Birth date cannot be empty",
            });
        } else {
            clearErrors("birthdate");
        }

        if(Birthdate !== ""&& 
            zipCodeBillingValids === true &&
            KycAddress?.country !== "" && KycAddress?.state !== "" && KycAddress?.city !== "" && KycAddress?.zip !== "" && KycAddress?.street2 !== "" &&
            fname !== "" && lname !== "" && email !== "" && MobileNo?.number?.length === 10
        ) {
            if(EmailRegex.test(email) === true 
                // && SSNRegex.test(SSN) === true
            ) {
                // setStepUpdate("paymentdetailsmethod");
                KYCVerification()
            } else {
                if(EmailRegex.test(email) === false) {
                    setErrorEmail("Please Enter Valid Email id");
                } else {
                    setErrorEmail("");
                }
                if(MobileNo?.number?.length < 10) {
                    setMobileError("Please enter 10 digit number");
                } else {
                    setMobileError("");
                }
            }
        } else {
            setCustomError(true);
            if(email === "") {
                setErrorEmail("Email id cannot be empty");
            } else if(EmailRegex.test(email) === false) {
                setErrorEmail("Please Enter Valid Email id");
            } else {
                setErrorEmail("");
            }
            if(MobileNo?.number === "") {
                setMobileError("Phone number cannot be empty");
            } else if(MobileNo?.number?.length < 10) {
                setMobileError("Please enter 10 digit number");
            } else {
                setMobileError("");
            }
        };
        
    };

    useEffect(() => {
        if(OrderIsInPrcessModalState !== undefined && OrderIsInPrcessModalState?.open) {
            if (profiledata?.kyc_verified) {
                PaymentSelectMethodWithKyc();
            } else {
                PaymentSelectMethod();
            }
        
        };
    }, [ OrderIsInPrcessModalState ]);

    // select payment method and submit function
    const [minimunamounterror,setMinumumAmountError] = useState("")
    const SubmitPaymentMethod = (url) => {
        setMinumumAmountError("")
        if(fname !== "" && lname !== "" && email !== "" && MobileNo?.number?.length === 10) {
            if(EmailRegex.test(email) === true) {
                if(url === "debit_card" || url === "credit_card") {
                    PaymentContinueStep();
                    setPaymentMethod("card")
                } else if(url === "crypto") {
                    if (props?.selectedProduct?.price < 5) {
                        setMinumumAmountError("To proceed with a crypto payment, the minimum package amount required is $5.")
                    } else {
                        PaymentContinueStep(url);
                    }
                } else if(url === "tierlock") {
                    PaymentContinueStep(url);
                } else if(url==="direct_payment") {
                    if(callpaynotebtn){
                        null
                    }else{
                        PaymentContinueStep("direct_payment");
                    }
                } else if(url === "coinflow") {
                    if(customerDetail?.id) {
                        setStepUpdate("payment_option")
                        setPaymentMethod("coinflow");
                    } else {
                        PaymentContinueStep(url);    
                    }
                } else {
                    PaymentContinueStep(url);
                }
            } else {
                if(EmailRegex.test(email) === false) {
                    setErrorEmail("Please Enter Valid Email id");
                } else {
                    setErrorEmail("");
                }
                if(MobileNo?.number?.length < 10) {
                    setMobileError("Please enter 10 digit number");
                } else {
                    setMobileError("");
                }
            }
        } else {
            setCustomError(true);
            if(email === "") {
                setErrorEmail("Email id cannot be empty");
            } else if(EmailRegex.test(email) === false) {
                setErrorEmail("Please Enter Valid Email id");
            } else {
                setErrorEmail("");
            }
            if(MobileNo?.number === "") {
                setMobileError("Phone Number cannot be empty");
            } else if(MobileNo?.number?.length < 10) {
                setMobileError("Please enter 10 digit number");
            } else {
                setMobileError("");
            }
        };
    };

    const PaymentContinueStep = (payment_url) => {
        document.getElementById("checkoutflag")?.classList?.remove("active");
        if(fname !== "" && lname !== "" && email !== "" && MobileNo?.number?.length === 10) {
            if(EmailRegex.test(email) === true) {
                dispatch(getRegioLcTime(""));
                dispatch(getOverCallingGeoLocation(true));
                document.getElementById("pageisLoading").style.display = "flex";
                setCustomError(false);
                setErrorEmail("");
                PaymentContinueStepGeo(payment_url);

            } else {
                if(EmailRegex.test(email) === false) {
                    setErrorEmail("Please Enter Valid Email id");
                } else {
                    setErrorEmail("");
                }

                if(MobileNo?.number?.length < 10) {
                    setMobileError("Please enter 10 digit number");
                } else {
                    setMobileError("");
                }
            }
        } else {
            setCustomError(true);
            if(email === "") {
                setErrorEmail("Email id cannot be empty");
            } else if(EmailRegex.test(email) === false) {
                setErrorEmail("Please Enter Valid Email id");
            } else {
                setErrorEmail("");
            }
            if(MobileNo?.number === "") {
                setMobileError("Phone Number cannot be empty");
            } else if(MobileNo?.number?.length < 10) {
                setMobileError("Please enter 10 digit number");
            } else {
                setMobileError("");
            }
        };
    }

    const GetGeoLicenceFunction = async (url, payment_url) => {
        window.axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}user/geocomply/license/${UniqueBrowserId}`, {
        headers: {
            'Content-Type': 'application/json',
        }}).then(function (result) {
            if(result?.status === 200) {
            dispatch(getGeoCoplyMessage(""));
            };
        }).catch(function (result) {
            dispatch(getGeoCoplyMessage(""));
            document.getElementById("checkoutflag")?.classList?.remove("active");
        });
    };
    
    const ProductId = selectedProduct.id;
    const PaymentContinueStepGeo = async (payment_url) => {
        document.getElementById("checkoutflag")?.classList?.remove("active");
        if(fname !== "" && lname !== "" && email !== "" && MobileNo?.number?.length === 10 && KycAddress?.country !== "" && KycAddress?.state !== "" && KycAddress?.city !== "" && KycAddress?.zip !== "" && KycAddress?.street2 !== "") {
            if(EmailRegex.test(email) === true) {
                setCustomError(false);
                setErrorEmail("");

                const params = { 
                    "first_name" : fname, 
                    "last_name" : lname, 
                    "email" : email.toLowerCase(), 
                    "phone" : MobileNo?.countrycode.toString() + " " + MobileNo?.number.toString(),
                    "cart" : ProductId,
                    "total_amount": parseInt(selectedProduct.price * 100),
                };

                if(Object.keys(profiledata?.address).length === 0) {
                    params.street_address = KycAddress?.street2;
                    params.country = KycAddress.country;
                    params.state = KycAddress.state;
                    params.city = KycAddress.city;
                    params.zipcode = KycAddress.zip;
                    params.billing_address = KycAddress?.street2;
                    params.billing_country = KycAddress.country;
                    params.billing_state = KycAddress.state;
                    params.billing_city = KycAddress.city;
                    params.billing_zipcode = KycAddress.zip;
                } else {
                    params.street_address = profiledata?.address?.street_address,
                    params.country = profiledata?.address?.country,
                    params.state = profiledata?.address?.state,
                    params.city = profiledata?.address?.city,
                    params.zipcode = profiledata?.address?.zipcode,
                    params.billing_address = KycAddress?.street2;
                    params.billing_country = KycAddress.country;
                    params.billing_state = KycAddress.state;
                    params.billing_city = KycAddress.city;
                    params.billing_zipcode = KycAddress.zip;
                };

                const jsonData = JSON.stringify(params); 

                const response = await  window.axios.post(PLACE_PRODUCT_ORDER_API_URL, jsonData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    }
                }).then(function (result) {
                    dispatch(getIsBillingAsHomeAddress(true));
                    if(payment_url === "crypto") {
                        setTimeout(() => {
                            dispatch(customerDetailsGet(result?.data?.data));
                            localStorage.setItem("order_place", JSON.stringify(result?.data?.data))
                            cryptoAPICalling(result?.data?.data);
                        }, 100);
                    } else if(payment_url === "tierlock") {
                        setTimeout(() => {
                            dispatch(customerDetailsGet(result?.data?.data));
                            tierlockAPICalling(result?.data?.data);
                        }, 100);
                    } else if (payment_url ==="direct_payment") {
                        document.getElementById("pageisLoading").style.display = "none";
                        SubmitPaymentFct(result?.data?.data?.id)
                        setCallPayNoteBtn(true)
                    } else {

                        if(payment_url !='cash_app'){
                            document.getElementById("pageisLoading").style.display = "none";
                        }
                        setTimeout(()=> {
                            dispatch(customerDetailsGet(result?.data?.data));
                            localStorage.setItem("order_place", JSON.stringify(result?.data?.data))
                            TokenizingCards(result?.data?.data);
                            setPaymentMethodModalState({
                                ...PaymentMethodModalState,
                                open: false,
                                title: "",
                            });
                            setErrorEmail("");
                        }, 100);
                        return result?.data?.data;
                    }
                })  
                .catch(function (result) {
                    dispatch(getIsBillingAsHomeAddress(false));
                    document.getElementById("pageisLoading").style.display = "none";
                    dispatch(customerDetailsGet(""));
                    toast.error(result.response.data.error);
                    if(result?.response?.data?.detail === "Token expired.") {
                        AccessTokenCheckLogout();
                    };
                });
                if(payment_url == "cash_app"){
                    return response;
                }
            } else {
                if(EmailRegex.test(email) === false) {
                    setErrorEmail("Please Enter Valid Email id");
                } else {
                    setErrorEmail("");
                }

                if(MobileNo?.number?.length < 10) {
                    setMobileError("Please enter 10 digit number");
                } else {
                    setMobileError("");
                }
            }
        } else {
            setCustomError(true);
            if(email === "") {
                setErrorEmail("Email id cannot be empty");
            } else if(EmailRegex.test(email) === false) {
                setErrorEmail("Please Enter Valid Email id");
            } else {
                setErrorEmail("");
            }
            if(MobileNo?.number === "") {
                setMobileError("Phone Number cannot be empty");
            } else if(MobileNo?.number?.length < 10) {
                setMobileError("Please enter 10 digit number");
            } else {
                setMobileError("");
            }
        };
    }

    const [callpaynotebtn,setCallPayNoteBtn] = useState(false)
    const SubmitPaymentFct = (order_id) => {
        const script = document.createElement('script');
        script.src = 'https://developers.seamlesschex.com/docs/checkoutjs/sdk-min.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);
  
        script.onload = () => {
          const objRequestRedirect = {
            publicKey: process.env.NEXT_PUBLIC_PAY_NOTE_KEY,
            sandbox: process.env.NEXT_PUBLIC_SANDBOX_KEY,
            saveBankDetails: false,
            displayMethod: 'redirect',
            paymentToken: 'pay_tok_SPECIMEN-' + Math.random(),
            widgetContainerSelector: 'wrapper-pay-buttons',
            storeName: 'Sweeps Coins Games',
            style: {
              buttonClass: 'btn green-btn btn-block no-overflow',
              buttonColor: '#00b660',
              buttonLabelColor: '#ffffff',
              buttonLabel: 'PAY',
            },
            lightBox: {
              redirectUrl: `${window.location.origin}/home`,
              cancelUrl: `${window.location.origin}/home`,
              title: 'Sweeps Coins Pay',
              subtitle: 'Package purchase',
              logoUrl: '',
              formButtonLabel: 'PAY',
              show_cart_summary: false,
            },
            checkout: {
              totalValue: Number(props?.selectedProduct?.price),
              currency: 'USD',
              description: order_id,
              items: [
                { title: props?.selectedProduct?.name, price: Number(props?.selectedProduct?.price) },
              ],
              customerEmail: email,
              customerFirstName: fname,
              customerLastName: lname,
            },
          };
          const paynoteRedirect = new PAYNOTE(objRequestRedirect);
          paynoteRedirect.render();
        };
      }
    // Tokenizing card
    const TokenizingCards = (customerDetail) => {
        setStepUpdate("payment_option")
        
    };
    const expiryDates = moment(expiryDate);
    const b = moment().utc();
    const expiryDatesdifrr = expiryDates.diff(b,'days');
    
    // card validations
    const MastercardRegex = /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/;
    const AmericanExpressRegex = /^3[47][0-9]{13}$/;
    const VisacardRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const DiscovercreditcardRegex = /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/;
    const MaestrocreditcardRegex = /^(5018|5081|5044|5020|5038|603845|6304|6759|676[1-3]|6799|6220|504834|504817|504645)[0-9]{8,15}$/;
    const JCBcreditcardRegex = /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/;
    const DinercreditcardRegex = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
    const CreditCardValid = MastercardRegex.test(creditCard) === true || AmericanExpressRegex.test(creditCard) === true || VisacardRegex.test(creditCard) === true || DiscovercreditcardRegex.test(creditCard) === true || MaestrocreditcardRegex.test(creditCard) === true || JCBcreditcardRegex.test(creditCard) === true || DinercreditcardRegex.test(creditCard) === true;
    const[ipaddress,setIpAddress]= useState('');

    function callAPI(state) {
        const data = fetch('https://api.ipify.org/?format=json')
          .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
              return response.json();
          })
          .then((data) => {
              localStorage.setItem("IP", data?.ip);
              return data?.ip;
          })
          .catch((error) => {
             return ""
          });
          return data
    };

    useEffect(() => {
        const fetchIp = async() =>{
            const Ip = await callAPI()
            setIpAddress(Ip)
        }
        fetchIp()
    }, [])
    // payment last step 
    const PaymentLastStep = async () => {
        document.getElementById("checkoutflag")?.classList?.remove("active");
        if(CreditCardValid && (expiryDate !== "" && expiryDatesdifrr > 0) && cvv !== "" && cardholderName !== "") {
            if (expiryDatesdifrr > 0 && cvv?.length === 3){
                const options = Intl.DateTimeFormat().resolvedOptions();
                const timezoneName = options.timeZone;
                document.getElementById("pageisLoading").style.display = "flex";
                setLoader(true);
                setCustomError(false);
                setErrorExpiryDate("");
                // const IP = await callAPI();

                const jsonData = JSON.stringify({ 
                    "card_number" : creditCard, 
                    "cardholder_name" : cardholderName, 
                    "order_id" : customerDetail?.id, 
                    "amount" : customerDetail?.total_amount,
                    "ccexp": moment(expiryDate).format('MM/YYYY'),
                    "cvv": cvv,
                    timezone: timezoneName,
                    ipaddress: ipaddress,
                    payment_type: TypePayment === "inoviopay" ? "inoviopay" : "card",
                    coupon_code:rcode.trim()
                });
                window.axios.post(PAYMENT_PLACE_ORDER_API_URL, jsonData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    }
                }).then(function (result) {
                    setTimeout(()=> {
                        document.getElementById("pageisLoading").style.display = "none";
                        document.getElementById("pageisLoadingnew").style.display = "none";
                        dispatch(cardDetailsGet(result.data.data));
                        dispatch(AddMyProduct(selectedProduct));
                        toast.success(result.data.msg);
                        new Audio(sound).play();
                        setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});
                        setCheckoutPoup({...checkoutPoup, open: false});
                        setErrorEmail("");
                        setErrorExpiryDate("");
                        setCreditCardError("");
                        setLoader(false);
                        setPaymentMethodModalState({
                            open: false,
                            title: "",
                        });
                        setTypePayment("");
                    }, 100);
                })  
                .catch(function (result) {
                    dispatch(cardDetailsGet(""));
                    document.getElementById("pageisLoading").style.display = "none";

                    let ErrorMessage = result.response.data.error === undefined ? "" : result.response.data.error;
                    let ErrorMwsg = result.response.data.msg === undefined ? "" : result.response.data.msg;
                    let response_code = result?.response?.data?.response_code;

                    if(result?.response?.data?.error === "Payment is done for this order.") {
                        navigate(PACKAGES);
                        dispatch(customerDetailsGet(""));
                    };
                    if (result?.response?.status === 401) {
                        toast.warning(result.response.data.error);
                    } else {
                        if(response_code){
                            if(response_code ==="3") {
                                toast.error("Please enter valid card number")
                            } else {
                                toast.error(ErrorMessage + (ErrorMwsg === "" ? "" : ":") + ErrorMwsg);      
                            }
                            navigate(PACKAGES);
                        }else{
                            toast.error(ErrorMessage + (ErrorMwsg === "" ? "" : ":") + ErrorMwsg);
                        }
                    }     
                    setLoader(false);
                    if(result?.response?.data?.detail === "Token expired.") {
                        AccessTokenCheckLogout();
                    };
                });
            } else{
                setCustomError(true);
                if(expiryDatesdifrr < 0) {
                    setErrorExpiryDate("Enter Valid Expiry date");
                } else {
                    setErrorExpiryDate("");
                }
            }
        } else {
            setCustomError(true);
            if(expiryDate !== "") {
                if(expiryDatesdifrr < 0 || !expiryDatesdifrr) {
                    setErrorExpiryDate("Enter Valid Expiry date");
                } else {
                    setErrorExpiryDate("");
                }
            } else {
                setErrorExpiryDate("Expiry date cannot be empty");
            }
            if(creditCard === "") {
                setCreditCardError("Credit card number cannot be empty");
            } else if (CreditCardValid === false) {
                setCreditCardError("Enter valid number credit Card");
            } else {
                setCreditCardError("");
            }
        };
    };

  const deviceData = {
  colorDepth: window?.screen?.colorDepth,
  screenHeight: window?.screen?.height,
  screenWidth: window?.screen?.width,
  timeZone: new Date().getTimezoneOffset()
};

const authentication3DS = {
  ...deviceData,
  concludeChallenge: true
};

 const chargebackProtectionData = [
  {
    id: selectedProduct.id,
    productName: selectedProduct?.name,
    productType: "inGameProduct",
    quantity: 1,
    itemClass: "digital",
    sellingPrice: selectedProduct?.price,
    itemFulfillment: "instant",
    rawProductData: {
      productID:selectedProduct.id,
      productDescription: selectedProduct?.description,
      productCategory: selectedProduct?.category,
      weight: "",
      dimensions: "",
      origin: "",
      craftedBy: "",
      craftingDate: ""
    }
  }
]
const PayWithCoinFlow = (data) =>{
    setLoader(true);
    const options = Intl.DateTimeFormat().resolvedOptions();
    const timezoneName = options.timeZone;
    const jsonData = JSON.stringify({ 
                    "card_number" : null, 
                    "cardholder_name" : null, 
                    "order_id" : customerDetail?.id, 
                    "amount" : customerDetail?.total_amount,
                    "ccexp": data?.expiryDate,
                    "cvv": data?.cvv,
                    timezone: timezoneName,
                    ipaddress: ipaddress,
                    payment_type: data?.payment_type,
                    coupon_code:data.rcode?  data.rcode?.trim() :null,
                    token:data?.token?.token,
                    last_four:data?.token?.lastFour,
                    authentication3DS,
                    chargebackProtectionData,

            });
                window.axios.post(PAYMENT_PLACE_ORDER_API_URL, jsonData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    }
                }).then(function (result) {
                    setTimeout(()=> {
                        document.getElementById("pageisLoading").style.display = "none";
                        document.getElementById("pageisLoadingnew").style.display = "none";
                        const data = {
                            transaction_id:result?.data?.transaction_id
                        }
                        dispatch(cardDetailsGet(data));
                        dispatch(AddMyProduct(selectedProduct));
                        toast.success(result.data.msg);
                        new Audio(sound).play();
                        setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});
                        setCheckoutPoup({...checkoutPoup, open: false});
                        setErrorEmail("");
                        setErrorExpiryDate("");
                        setCreditCardError("");
                        setLoader(false);
                        setPaymentMethodModalState({
                            open: false,
                            title: "",
                        });
                        setTypePayment("");
                    }, 100);
                })  
                .catch(function (result) {
                    dispatch(cardDetailsGet(""));
                    document.getElementById("pageisLoading").style.display = "none";

                    let ErrorMessage = result.response.data.error === undefined ? "" : result.response.data.error;
                    let ErrorMwsg = result.response.data.msg === undefined ? "" : result.response.data.msg;
                    if (result?.response?.status === 401) {
                        toast.warning(result.response.data.error);
                    } else {
                        toast.error(ErrorMessage + (ErrorMwsg === "" ? "" : ":") + ErrorMwsg);
                    }     
                    setLoader(false);
                    if(result?.response?.data?.detail === "Token expired.") {
                        AccessTokenCheckLogout();
                    };
                });
    }

    // crypto api calling function
    const cryptoAPICalling = (response) => {
        document.getElementById("checkoutflag")?.classList?.remove("active");
        document.getElementById("pageisLoading").style.display = "flex";
        window.axios.get(`${USER_CRYPTO_PAYMENT_API_URL}/${response?.id}/${parseInt(response?.total_amount / 100)}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            setTimeout(()=> {
                document.getElementById("pageisLoading").style.display = "none";
                dispatch(cardDetailsGet(result.data.data));
                dispatch(AddMyProduct(selectedProduct));

                const approveLink= result?.data?.data?.result?.url
                if (approveLink) {
                    window.location.href = approveLink;
                    fetch(approveLink)
                      .then((response) => {
                        if (response.ok) {
                        } else {
                          console.error("Failed to fetch:", response);
                        }
                      })
                      .catch((error) => {
                        console.error("Error fetching:", error);
                      });
                  }
                toast.success(result.data.msg);
                setCheckoutPoup({...checkoutPoup, open: false});
                setErrorEmail("");
                setErrorExpiryDate("");
                setCreditCardError("");
                setLoader(false);
                setPaymentMethodModalState({
                    open: false,
                    title: "",
                });
                setTypePayment("");
            }, 100);
        })  
        .catch(function (result) {
            dispatch(cardDetailsGet(""));
            document.getElementById("pageisLoading").style.display = "none";
            dispatch(OrderIsInProcessModalStateFct(false));
            let ErrorMessage = result.response.data.error === undefined ? "" : result.response.data.error;
            let ErrorMwsg = result.response.data.msg === undefined ? "" : result.response.data.msg;
            toast.error(ErrorMessage + (ErrorMwsg === "" ? "" : ":") + ErrorMwsg);
            
            setLoader(false);
            if(result?.response?.data?.detail === "Token expired.") {
                AccessTokenCheckLogout();
            };
        });
    };

    // tierlock api calling function
    const tierlockAPICalling = (response_) => {
        document.getElementById("checkoutflag")?.classList?.remove("active");
        document.getElementById("pageisLoading").style.display = "flex";
       
        const payload = {
            order_id: response_?.id,
            product_name: selectedProduct?.name,
        }
        window.axios.post(USER_TIERLOCK_STATUS_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            setTimeout(()=> {
                document.getElementById("pageisLoading").style.display = "none";
                dispatch(cardDetailsGet(result.data.data));
                dispatch(AddMyProduct(selectedProduct));

                const approveLink= result?.data?.data?.url
                if (approveLink) {
                    window.location.href = approveLink;
                }
                setCheckoutPoup({...checkoutPoup, open: false});
                setErrorEmail("");
                setErrorExpiryDate("");
                setCreditCardError("");
                setLoader(false);
                setPaymentMethodModalState({
                    open: false,
                    title: "",
                });
                setTypePayment("");
            }, 100);
        })  
        .catch(function (result) {
            dispatch(cardDetailsGet(""));
            document.getElementById("pageisLoading").style.display = "none";
            dispatch(OrderIsInProcessModalStateFct(false));
            let ErrorMessage = result.response.data.error === undefined ? "" : result.response.data.error;
            let ErrorMwsg = result.response.data.msg === undefined ? "" : result.response.data.msg;
            toast.error(ErrorMessage + (ErrorMwsg === "" ? "" : ":") + ErrorMwsg);
            
            setLoader(false);
            if(result?.response?.data?.detail === "Token expired.") {
                AccessTokenCheckLogout();
            };
        });
    };

    // onChange effect 
    const OnchangeNoGet = (e) => {
        if(e.target.value.length <= 3) {
            setCVV(e.target.value)
        }
    };

    // close checkout modal
    const CloseCheckoutModal = () => {
        document.getElementById("flagsDropdownid")?.classList?.remove("active");
        document.getElementById("checkoutflag")?.classList?.remove("active");
        setCheckoutPoup({...checkoutPoup, open: false})
    }

    // onchange get expiry date and validations
    const onGetExpirydate = (date) => {
        setExpiryDate(date);
        const expiryDates = moment(date);
        const b = moment().utc();
        const expiryDatesdifrr = expiryDates.diff(b,'days');
        if(date !== "") {
            if(expiryDatesdifrr < 0) {
                setErrorExpiryDate("Enter Valid Expiry date");
            } else {
                setErrorExpiryDate("");
            }
        } else {
            setErrorExpiryDate("Expiry date cannot be empty")
        }
    };

    const handleNumericInput = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    };

    // input field space issue 
    document.getElementById("CardholderNameID")?.addEventListener('keydown', function (e) {
        if (this.value.length === 0 && e.which === 32) e.preventDefault();
    });

    document.addEventListener("wheel", function(event){
        if(document.activeElement.type === "number" && document.activeElement.classList.contains("cvv_fileds")) {
            document.activeElement.blur();
        }
    });
    const callSelectMethod = (type)=>{
        document.getElementById("pageisLoading").style.display = "flex";
        setPaymentMethod(type)
        document.getElementById("pageisLoading").style.display = "none";
    }

    const callBackInitPayment = () =>{
        if(paymentMethod == "google_pay" ){
            const TokenNiztion = document.getElementById("iframPayment");
            const iframPaymentBack = document.getElementById("iframPaymentBack");
            TokenNiztion.style.display = "block";
            iframPaymentBack.style.display = "block";
            window.myGlobalFunction();
        }else if(paymentMethod == "cash_app" ){
            
        }else if(paymentMethod == "card" ){
            window.myGlobalFunction("google_pay");
        }
    }
    const callPaymentCompleteCashApp = async (data) =>((dispatch, getState)=>{
        const {customerDetail} = getState()?.allReducers
        document.getElementById("pageisLoading").style.display = "flex";
        const paymentDetails = JSON.parse(data);
        const payload = {
            idempotency_key: paymentDetails?.idempotencyKey,
            token: paymentDetails?.sourceId,
            payment_type: "cash-app",
            order_id:"",
            amount:"",
            coupon_code:rcode.trim(),
            ipaddress: ipaddress,
        }
        if(customerDetail?.id){
            payload.order_id = customerDetail?.id;
        }
        if(customerDetail?.id){
            payload.amount = customerDetail?.total_amount;
        }
        window.axios.post(PAYMENT_PLACE_ORDER_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            document.getElementById("pageisLoadingnew").style.display = "none";
                audioMedia?.play()?.then(() => {
                }).catch(error => {
                    console.error('Error playing audio:', error);
                });
                dispatch(cardDetailsGet(result.data.data));
                toast(result.data.msg);
                setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});
                dispatch(customerDetailsGet({...result?.data?.data, total_amount: result?.data?.data?.amount}));
                CloseCheckoutModal();
        })  
        .catch(function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            if (result?.response?.status === 401) {
                toast.warning(result.response.data.error);
            } else {
                toast.error(result.response.data.error);
            }        
            if(result?.response?.data?.detail === "Token expired.") {
                AccessTokenCheckLogout();
            };
            dispatch(customerDetailsGet(result?.data?.data));
        });
    });

    const AccessTokenCheckLogout = () => {
        setTimeout(() =>  Navigate(HOME_URL), 200);
        localStorage.removeItem("accessToken");
        dispatch(getAccessToken(""));
        dispatch(checkLogin("no"));
        dispatch(getUser(""));
    };

    const FailRedirect = () =>{
        Navigate(PACKAGES),
        dispatch(cardDetailsGet({})),
        dispatch(customerDetailsGet({}))
    };

    const PaymentAmountDetails = () =>{
        return(
            <div className="paymentheadermain">
                <div>
                    <div className="pymenttitle">
                        {stepUpdate === "yourdetails" ? (
                           <div className="backpymentbtn" onClick={() =>{ Navigate(CHECK_OUT_PACKAGE),setMinumumAmountError("")}}><svg viewBox="0 0 18 18" fill="currentColor" width="18" height="18"><path d="M10.8448202,5.14270801 C11.0394183,5.33600267 11.0404716,5.64963633 10.8476779,5.84372938 L7.71273205,8.99980356 L10.8488003,12.1634729 C11.0414976,12.3578663 11.0408107,12.6714558 10.8472635,12.865003 C10.6532807,13.0582298 10.3404929,13.0576181 10.1479487,12.8643191 L6.29891136,9.00019644 L10.1421589,5.14494052 C10.3357619,4.95073257 10.649987,4.9497342 10.8448202,5.14270801 Z"></path></svg> Back</div>

                        ) : (stepUpdate === "paymentdetailsmethod" || (stepUpdate === "payment_option" && paymentMethod == 'cash_app')) ? (
                            <div className="backpymentbtn" onClick={() => {setStepUpdate("yourdetails"), setPaymentMethod("card"),setMinumumAmountError("")}}><svg viewBox="0 0 18 18" fill="currentColor" width="18" height="18"><path d="M10.8448202,5.14270801 C11.0394183,5.33600267 11.0404716,5.64963633 10.8476779,5.84372938 L7.71273205,8.99980356 L10.8488003,12.1634729 C11.0414976,12.3578663 11.0408107,12.6714558 10.8472635,12.865003 C10.6532807,13.0582298 10.3404929,13.0576181 10.1479487,12.8643191 L6.29891136,9.00019644 L10.1421589,5.14494052 C10.3357619,4.95073257 10.649987,4.9497342 10.8448202,5.14270801 Z"></path></svg> Back</div>
                        ) : (
                            <div className="backpymentbtn" onClick={() =>{ setStepUpdate("paymentdetailsmethod"),setMinumumAmountError("")}}><svg viewBox="0 0 18 18" fill="currentColor" width="18" height="18"><path d="M10.8448202,5.14270801 C11.0394183,5.33600267 11.0404716,5.64963633 10.8476779,5.84372938 L7.71273205,8.99980356 L10.8488003,12.1634729 C11.0414976,12.3578663 11.0408107,12.6714558 10.8472635,12.865003 C10.6532807,13.0582298 10.3404929,13.0576181 10.1479487,12.8643191 L6.29891136,9.00019644 L10.1421589,5.14494052 C10.3357619,4.95073257 10.649987,4.9497342 10.8448202,5.14270801 Z"></path></svg> Back</div>
                        )}
                        <div className="dropdowncustome">
                            <div className="dropdowntoggle" onClick={() => setPaymentDropdown(!paymentDropdown)}>
                                <h6 className="w-auto d-inline mb-0 pe-1">Package - {selectedProduct?.name}</h6> <span className="w-auto d-inline mb-0"> (${Number(selectedProduct.price).toLocaleString()})</span>
                            </div>    
                        </div>
                    </div>
                </div>
                <div className="paymentssteps">
                    <div className="active"></div>
                    <div className={(stepUpdate === "paymentdetailsmethod" || stepUpdate === "payment_option") ? "active" : ""}></div>
                    <div className={stepUpdate === "paymentdetails" || (stepUpdate === "payment_option" && paymentMethod == 'card') ? "active" : ""}></div>
                </div>
            </div>
        )
    }
    const CardOldModel = () =>{
        return(
            <div className="paymentforms paymentFormsWrapper">  
                <div className="rowcustom">
                    <div className="col-md-12">
                        <div className={creditCardError !== "" && CreditCardValid !== true ? "form-group error" : "form-group"}>
                            <label>{TypePayment==="debit_card" ?"Debit":"Credit"} Card Number</label>
                            <div className="form-groupfiled">
                                <input type="tel" className="form-control" value={cc_format(creditCard)} onChange={(e) => creditcardNo(e)} placeholder="Enter Credit Card Number" maxLength="23" pattern="\d*" />
                                {CreditCardValid === true && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                {CreditCardValid !== true && <div className="danger-color">{creditCardError}</div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rowcustom rowcustom-col-2">
                    <div className={errorExpiryDate !== "" ? "form-group error" : "form-group"}>
                        <label>Expiry Date</label>
                        <div className="form-groupfiled expirydatswrapper">
                            <input type="text" className="d-none"  />
                            <DatePicker
                                selected={expiryDate}
                                onChange={(date) => onGetExpirydate(date)}
                                dateFormat="MM/yyyy"
                                placeholderText="Select Expiry Date"
                                autoComplete="off"
                                showMonthYearPicker
                            />
                            {errorExpiryDate !== "" ? <AppImage src={images.common.errorIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} /> : 
                            (errorExpiryDate === "" && expiryDate !== "") ? <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} /> : <React.Fragment></React.Fragment>}
                            {errorExpiryDate !== "" && <div className="danger-color">{errorExpiryDate}</div>}
                        </div>
                    </div>
                    <div className={CustomError && cvv === "" ? "form-group error" : "form-group"}>
                        <label>CVV</label>
                        <div className="form-groupfiled cvv-groupfiled">
                            <input type="password" className="d-none"  />
                            <input type={showHideCvv ? "number" : "password"} value={cvv} onChange={(e) => OnchangeNoGet(e)} className="form-control cvv_fileds" onInput={handleNumericInput} placeholder="Enter CVV" maxLength="3" autoComplete="off" />
                            <span className="input-group-text" onClick={() => setShowHideCvv(!showHideCvv)}>
                                {showHideCvv ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 3l18 18"></path><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>}
                            </span>
                            {cvv?.length === 3 && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                            {CustomError && cvv?.length !== 3 && <CustomMendotoryMsg value={cvv} label={"CVV"} />}
                        </div>
                    </div>
                </div>
                <div className="rowcustom">
                    <div className="col-md-12">
                        <div className={CustomError && cardholderName === "" ? "form-group error" : "form-group"}>
                            <label>Cardholder Name</label>
                            <div className="form-groupfiled">
                                <input type="text" className="form-control" id="CardholderNameID" value={cardholderName} onChange={(e) => {
                                const inputValue = e.target.value;
                                const regex = /^[A-Za-z\s]*$/; 

                                if (regex.test(inputValue)) {
                                    setCardholderName(inputValue);
                                }
                                }} placeholder="Enter Cardholder Name" 
                                />
                                {cardholderName !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                {CustomError && cardholderName === "" && <CustomMendotoryMsg value={cardholderName} label={"Cardholder Name"} />}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="rowcustom">
                        <div className="col-md-12">
                            <div className="form-group">
                            <label>Coupon Code</label>
                            <div className="form-groupfiled">
                            <input type="text" className="form-control" 
                                value={rcode} 
                                onChange={(e) => setRCode(e.target.value.trim())}
                                placeholder="Enter Coupon Code" autoComplete="off"/>
                                {rcode !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                            </div>
                            </div>
                        </div>
                        </div>
            </div>
        )
    }
    if(stepUpdate === "payment_option" && (paymentMethod === "card"||paymentMethod==="coinflow")) {
        return(
            <div className={`${props?.modalState ? "CheckoutModalWrapper": "CheckoutModalWrapper1"}`}>
                <button className="closeModal" onClick={() => CloseCheckoutModal()}>
                    <svg viewBox="0 0 6 6" fill="currentColor" width="12px" height="12px"><path d="M5.2 0L3 2.2 0.8 0 0 0.8 2.2 3 0 5.3 0.8 6 3 3.8 5.2 6 6 5.3 3.8 3 6 0.8z"></path></svg>
                </button>

                {!props?.paymentState ?(
                    <React.Fragment>
                        {PaymentAmountDetails()}
                        <h4 className="mb-3">
                            {stepUpdate === "yourdetails" ? "1. Your Details" : stepUpdate === "paymentdetailsmethod" ?  "2. Select Payment Method" : TypePayment === "cash_app"?"Payment": "3. Payment Details"}
                        </h4>
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        <div className="d-inline-flex flex-column w-auto">
                            <h4 className="mb-3">Payment Method</h4>
                            <p>Select payment option</p>
                        </div>
                        <div className="dropdowncustome">
                        <div className="dropdowntoggle" onClick={() => setPaymentDropdown(!paymentDropdown)}>
                            ${Number(selectedProduct.price).toLocaleString()}
                            <svg viewBox="0 0 18 18" fill="currentColor" width="18" height="18"><path d="M3.96966991,5.96966991 C4.23593648,5.70340335 4.65260016,5.6791973 4.94621165,5.89705176 L5.03033009,5.96966991 L9.5,10.439 L13.9696699,5.96966991 C14.2359365,5.70340335 14.6526002,5.6791973 14.9462117,5.89705176 L15.0303301,5.96966991 C15.2965966,6.23593648 15.3208027,6.65260016 15.1029482,6.94621165 L15.0303301,7.03033009 L9.5,12.5606602 L3.96966991,7.03033009 C3.6767767,6.73743687 3.6767767,6.26256313 3.96966991,5.96966991 Z"></path></svg>
                        </div>    
                        {paymentDropdown && (<div className="amountdetailsdropdown">
                            <div className="posterdetails">
                                <span>{"Single Package"}</span>
                                <span>Quantity: 1</span>
                            </div>
                            <div>${Number(selectedProduct.price).toLocaleString()}</div>
                        </div>)}
                    </div>
                    </React.Fragment>
                )}
                    <div className="payment-method">
                        {paymentMethod === "coinflow" && (
                            <React.Fragment>
                            <CardTokenizationForm 
                                selectedProduct={selectedProduct} 
                                PayWithCoinFlow={PayWithCoinFlow} 
                                Loader={Loader}
                                SuccessPopup={SuccessPopup} 
                                setSuccessPopup={setSuccessPopup}
                            />
                            </React.Fragment>
                        )}
                        {paymentMethod == "card" && (
                            <React.Fragment>
                                 {CardOldModel()}
                                <Button className="btn formcomnbtn" disabled={Loader} onClick={() => PaymentLastStep()}>Pay Now</Button>
                            </React.Fragment>
                        )}
                        {paymentMethod == "cash_app" && (
                            <React.Fragment>
                                <CashPayComponent {...props} SecureImage={SecureImage} PaymentContinueStepGeo={PaymentContinueStepGeo} callBackInitPayment={callPaymentCompleteCashApp} amount={selectedProduct.price} />
                            </React.Fragment>
                        )}
                        <AppImage src={images.checkout.secure} className="secureimage" alt="SecureImage" width={180} height={50} />
                    </div>
            </div>
        )
    };

    return(<div  className={`${props?.modalState ? "CheckoutModalWrapper": "CheckoutModalWrapper1 height-100"} `}>
            <div>
                
            <button className="closeModal" onClick={() => CloseCheckoutModal()}>
                <svg viewBox="0 0 6 6" fill="currentColor" width="12px" height="12px"><path d="M5.2 0L3 2.2 0.8 0 0 0.8 2.2 3 0 5.3 0.8 6 3 3.8 5.2 6 6 5.3 3.8 3 6 0.8z"></path></svg>
            </button>
            {PaymentAmountDetails()}
            </div>
            <h4>{stepUpdate === "yourdetails" ? "1. Your Details" : (stepUpdate === "paymentdetailsmethod" || (stepUpdate === "payment_option" && paymentMethod == 'cash_app')) ?  "2. Select Payment Method" : "3. Payment Details"}</h4>
            <div className="paymentWrappers">
                {stepUpdate === "yourdetails" ? (<div className="paymentforms height-100">
                        <div className="rowcustom rowcustom-col-2">
                            <div className={errors.fname ? "form-group error" : "form-group"}>
                                <label>First Name</label>
                                <div className="form-groupfiled">
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        value={fname}
                                        {...register("fname", { required: "First name cannot be empty" })}
                                        onChange={async (e) => {
                                            const value = e.target.value;
                                            setFname(value);
                                            setValue("fname", value);
                                            await trigger("fname");
                                        }}
                                        placeholder="Enter first name"
                                        disabled={zipLoading}
                                    />
                                    {fname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors.fname && <div className="danger-color">{errors.fname.message}</div>}
                                </div>
                            </div>
                            <div className={errors.lname ? "form-group error" : "form-group"}>
                                <label>Last Name</label>
                                <div className="form-groupfiled">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={lname}
                                        {...register("lname", { required: "Last name cannot be empty" })}
                                        onChange={async (e) => {
                                            const value = e.target.value;
                                            setLname(value);
                                            setValue("lname", value);
                                            await trigger("lname");
                                        }}
                                        placeholder="Enter last name"
                                        disabled={zipLoading}
                                    />
                                    {lname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors.lname && <div className="danger-color">{errors.lname.message}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="rowcustom rowcustom-col-2">
                            <div className={errors.email ? "form-group error" : "form-group"}>
                                <label>Email</label>
                                <div className="form-groupfiled">
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        autoComplete="email"
                                        {...register("email", {
                                            required: "Email id cannot be empty",
                                            pattern: {
                                                value: EmailRegex,
                                                message: "Please Enter Valid Email id",
                                            },
                                        })}
                                        onChange={async (e) => {
                                            const value = e.target.value;
                                            setEmail(value);
                                            setValue("email", value);
                                            await trigger("email");
                                            if (EmailRegex.test(value)) {
                                                setErrorEmail("");
                                            } else if (value === "") {
                                                setErrorEmail("Email id cannot be empty");
                                            } else {
                                                setErrorEmail("Please Enter Valid Email id");
                                            }
                                        }}
                                        placeholder="Enter email"
                                        disabled={zipLoading}
                                    />
                                    {EmailRegex.test(email) && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors.email && <div className="danger-color">{errors.email.message}</div>}
                                </div>
                            </div>
                            <div className={(MobileError !== "" && MobileNo?.number?.toString()?.length !== 10) ? "form-group error" : "form-group"}>
                                    <label>Phone</label>
                                    <div className="form-groupfiled">
                                        <CountrySelectInput 
                                            MobileNo={MobileNo}
                                            setMobileNo={setMobileNo}
                                            id={"checkoutflag"}
                                            isPointer={zipLoading}
                                        />
                                        {MobileNo?.number?.toString()?.length === 10 && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                        {MobileNo?.number?.toString()?.length !== 10 && <div className="danger-color">{MobileError}</div>}
                                    </div>
                                </div>

                        </div>
                        {!profiledata?.kyc_verified &&(
                        <div className="rowcustom rowcustom-col-2">
                    <div className={errors.birthdate ? "form-group date-picker-wrapper error" : "form-group date-picker-wrapper"}>
                        <label>Date of Birth *</label>
                        <div className="form-groupfiled">
                            <input type="hidden" {...register("birthdate", { required: "Birth date cannot be empty" })} />
                            <DatePicker 
                                selected={Birthdate} 
                                onChange={async (date) => {
                                    setBirthdate(date);
                                    setValue("birthdate", date);
                                    if (date) {
                                        clearErrors("birthdate");
                                    }
                                    await trigger("birthdate");
                                }} 
                                peekNextMonth 
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Date of Birth"
                                maxDate={newDate}
                                style={{display:"flex"}}
                                disabled={zipLoading}
                            />
                            {Birthdate !== "" && Birthdate !== null && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                            {errors.birthdate && <div className="danger-color">{errors.birthdate.message}</div>}
                        </div>
                    </div>
                        </div>
                         )}

                    <div className="address-details-title">
                       <h4 className="address-details-title">Address Details</h4>
                    </div>
                    <div className="address-details-title">
                        <h4 className="sub_header_title" style={{ justifyContent: "space-between" }}>
                            Billing Address
                        </h4>
                    </div>
                    <CommonBillingAddressForm 
                        KycAddress={KycAddress} 
                        setKycAddress={setKycAddress}
                        CustomError={CustomError}
                        zipCodeBillingValids={zipCodeBillingValids}
                        setZipCodeBillingValids={setZipCodeBillingValids}
                        isDisabled={isDisableBilling || zipLoading}
                        setZipLookupLoading={setZipLoading}
                    />
                </div>) : (stepUpdate === "paymentdetailsmethod" || (stepUpdate === "payment_option" && paymentMethod == 'cash_app')) ? (<PaymentMethedModal 
                    PaymentMethodModalState={PaymentMethodModalState} 
                    setPaymentMethodModalState={setPaymentMethodModalState}
                    SubmitPaymentMethod={SubmitPaymentMethod}
                    setTypePayment={setTypePayment}
                    callSelectMethod={callSelectMethod}
                    setStepUpdate={setStepUpdate}
                    minimunamounterror={minimunamounterror}
                    PaymentContinueStepGeo={PaymentContinueStepGeo}
                    callPaymentCompleteCashApp={callPaymentCompleteCashApp}
                    selectedProduct={selectedProduct}
                    paymentMethod={paymentMethod}
                    props={props}
                    TypePayment={TypePayment}
                    GetGeoLicenceFunction={GetGeoLicenceFunction}
                    email={email}
                    SuccessPopup={SuccessPopup} 
                    setSuccessPopup={setSuccessPopup}
                    show={show} 
                    setShow={setShow}
                />) : (<div className="modal_payments">
                    <CardOldModel />
                </div>)}
                {stepUpdate !== "paymentdetailsmethod" && !(stepUpdate === "payment_option" && paymentMethod == 'cash_app') && (<div className="rowcustom">
                    <div className="col-md-12 mb-2">
                        {stepUpdate === "yourdetails" ? (
                            <Button 
                                className="btn formcomnbtn right-Icon"
                                onClick={() => {
                                    if (profiledata?.kyc_verified) {
                                        PaymentSelectMethodWithKyc();
                                    } else {
                                        PaymentSelectMethod();
                                    }
                                }}
                                disabled={loading || zipLoading}
                            >
                                {(loading || zipLoading) ? "Please wait..." : "Continue"} <AppImage src={images.checkout.rightArrow} alt="arrow" width={18} height={18} />
                            </Button>
                        ) :
                        (<Button className="btn formcomnbtn" disabled={Loader} onClick={() => PaymentLastStep()}>Pay Now</Button>)}
                    </div>
                    <AppImage src={images.checkout.secure} className="secureimage" alt="SecureImage" width={180} height={50} />
                </div>)}
            </div>

            {(OrderIsInPrcessModalState?.open !== undefined && OrderIsInPrcessModalState?.open) && (<OrderInProcessModal DontWorryModal={DontWorryModal} setDontWorryModal={setDontWorryModal} />)}
            {(OrderIsInPrcessModalState?.open !== undefined && OrderIsInPrcessModalState?.open) && (<div className="ModalBackground"></div>)}

            {DontWorryModal?.open && (<OrderProcessCancelModal setDontWorryModal={setDontWorryModal} />)}
            {DontWorryModal?.open && (<div className="ModalBackground" style={{ zIndex: "9999" }}></div>)}
    </div>)
}
CheckoutModal.propTypes = {
    modalState: PropTypes.bool
}
CheckoutModal.defaultProps = {
    modalState: true
}
export default CheckoutModal;
