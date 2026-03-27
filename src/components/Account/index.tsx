// @ts-nocheck
/* eslint-disable */
import { City, Country, State } from 'country-state-city';
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { images } from "@/content";
import CashPaymentIcon from "../../assets/img/cash-payment.png";
import CloseIcon from '../../assets/img/closebutton.png';
import DefaultGameImage from "../../assets/img/DefaultProduct.jpg";
import DefaultProfile from "../../assets/img/dummyimage.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import ProfileLoader from "../../assets/img/spinner_transferent.svg";
import CloseBtn from "../../assets/img/x-mark (2).png";
import { CallLogoutUser, ClearReduxFlow, GetOrderList, GetProductsIdWise, accountNavigate, getCreditlist, getOverCallingGeoLocation, getProductList, getRegioLcTime, getUser, updateProfilePic, updateUser, updateUserWallet, getAllZipCodes } from "../../redux/actions";
import CommonModal from "../Common/CommonModal/index";
import CountrySelectInput from "../Common/CountrySelectInput/CountryMobileInput";
import CustomMendotoryMsg from "../Common/CustomMendotoryMsg";
import PaginationPage from "../Common/PaginationPage";
import RedeemCreditsModal from "../Common/RedeemCreditsModal";
import { timeSince } from "../Common/Timesince";
import { trimValue } from "@/lib/formValidation";
import { ADMIN_REFERRAL_CONDITION_DETAIL_API, GET_PRODUCT_API_URL, GET_PROFILE_API_URL, ORDER_LIST_API_URL, PROFILE_UPDATE_API_URL, PROFILE_UPLOAD_API_URL, REQUEST_FOR_REFERRAL, USER_CREDIT_LIST_API_URL, USER_KYC_API, USER_REDEEM_COUPON_API_URL } from "../Shared/constant";
//Calling WOWjs
import moment from 'moment';
import { Link, useNavigate } from '@/lib/router';
import { RWebShare } from "react-web-share";
import { getReferData } from "../../redux/actions";
import CommonBillingAddressForm from "../Common/CommonBillingAddressForm";
import { subtractYearsFromDate } from "./function";
import PostRequest from "./PostRequest";
import AppImage from "../Common/AppImage";

const Account = () => {
    const dispatch = useDispatch();
    const LocationUrl = window.location.href.split("/")[3];
    const { referData,productidObjects, accessToken, orderlist, profiledata, accountUrl,creditList, products, geoComplyLocation, UniqueBrowserId, zipCodesAll } = useSelector((state) => state.allReducers);
    const [ CustomError, setCustomError ] = useState(false);
    const [ fname, setFname ] = useState((profiledata?.first_name === null || profiledata?.first_name === "") ? "" : profiledata?.first_name);
    const [ lname, setLname ] = useState((profiledata?.last_name === null || profiledata?.last_name === "") ? "" : profiledata?.last_name);
    const [ profileUpload, setProfileUpload ] = useState(profiledata?.user_avatar_path === null ? "" : profiledata?.user_avatar_path);
    const [ MobileNo, setMobileNo ] = useState({
        countrycode: (profiledata?.phone === null || profiledata?.phone === "") ? "1" : (parseInt(profiledata?.phone?.split("-")[0]) || parseInt(profiledata?.phone?.split(" ")[0])),
        number: (profiledata?.phone === null || profiledata?.phone === "") ? "" : (parseInt(profiledata?.phone?.split("-")[1]) || parseInt(profiledata?.phone?.split(" ")[1])),
    });
    const [ commonPopup, setCommonPopup ] = useState({
        open: false,
        title: "",
        description: "",
        buttontitle: "" 
    });
    const [ fileUploadLoader, setFileUploadLoader ] = useState(false);
    const [ RedeemCrditModalState, setRedeemCrditModalState ] = useState({
        open: false,
        title: "",
        RedeemData: {}
    });
    const [address,setAddress] = useState({
        street1: (profiledata?.address?.street_address==null||profiledata?.address?.street_address==="")?"":profiledata?.address?.street_address,
        zip: (profiledata?.address?.zipcode ===null||profiledata?.address?.zipcode===""||profiledata?.address?.zipcode===undefined)?"":profiledata?.address?.zipcode,
    })

    const [ SelectCountry, setSelectCountry ] = useState({
        key: 232,
        label: "United States",
        value: "US"
    });
    const [ SelectState, setSelectState ] = useState((profiledata?.address?.state===null||profiledata?.address?.state===""||profiledata?.address?.state===undefined)?"":profiledata?.address?.state);
    const [ SelectCity, setSelectCity ] = useState((profiledata?.address?.city===null||profiledata?.address?.city===""||profiledata?.address?.city===undefined)?"":profiledata?.address?.city);
    const [stateIsoCode,setStateisoCode] = useState("");
    const [state_value,setStateValueForKyc] = useState('')

    const [optionsState, setOptionsState] = useState([]);

    const [optionsCity, setOptionsCity] = useState([]);
    const [ errorZip, setErrorZip ] = useState("");


    const navigate = useNavigate();
    const {
        control: referralControl,
        handleSubmit: handleReferralSubmit,
        reset: resetReferralForm,
        watch: watchReferralForm,
        formState: { errors: referralErrors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            message: ""
        }
    });
    const {
        control: sweepsControl,
        handleSubmit: handleSweepsSubmit,
        reset: resetSweepsForm,
        watch: watchSweepsForm,
        formState: { errors: sweepsErrors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            sweepsCode: ""
        }
    });

    const {
        register: registerAccount,
        handleSubmit: handleAccountSubmit,
        setValue: setAccountValue,
        trigger: triggerAccount,
        formState: { errors: accountErrors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            fname: (profiledata?.first_name === null || profiledata?.first_name === "") ? "" : profiledata?.first_name,
            lname: (profiledata?.last_name === null || profiledata?.last_name === "") ? "" : profiledata?.last_name,
            street1: (profiledata?.address?.street_address == null || profiledata?.address?.street_address === "") ? "" : profiledata?.address?.street_address,
            zip: (profiledata?.address?.zipcode == null || profiledata?.address?.zipcode === "") ? "" : profiledata?.address?.zipcode,
            country: profiledata?.address?.country || "US",
            state: profiledata?.address?.state || "",
            city: profiledata?.address?.city || "",
            birthdate: profiledata?.dob ? new Date(profiledata?.dob) : null,
        }
    });
    const message = watchReferralForm("message");
    const sweepsCode = watchSweepsForm("sweepsCode");
    // error sweeps code
    const [ errorSweepsCode, setErrorSweepsCode ] = useState("");
    const [ MobileError, setMobileError ] = useState("");
    const [ RequestProcessModel, setRequestProcessModel ] = useState({
        open: false,
        data: {}
    });
    const [paginationLength, setPaginationLength] = useState({});
    const [paginationLengthNew, setPaginationLengthnew] = useState({});
    const [maintain,setMaintain] = useState({
        filter:"all",
        limit: 10,
        page: 1,
        search:""
    });
    const [ KycAddress, setKycAddress ] = useState({
        country: "US",
        city: "",
        state: "",
        zip: "",
        street2: (profiledata?.address?.billing_address===null || profiledata?.address?.billing_address===undefined || profiledata?.address?.billing_address==="")?"":profiledata?.address?.billing_address,
    });
    const [ userType, setUserType ] = useState("all");
    const [ userLimit, setUserLimit ] = useState(10);
    const [ userSearch, setUserSearch ] = useState("");
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ searchNone, setSearchNone ] = useState(false);
    const [ zipCodeBillingValids, setZipCodeBillingValids ] = useState(false);
    const [ isDisableBilling, setisDisableBilling ] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("wowjs").then((mod) => {
                const WOWClass =
                    mod?.WOW?.WOW ||
                    mod?.default?.WOW ||
                    mod?.WOW ||
                    mod?.default;

                if (typeof WOWClass === "function") {
                    new WOWClass({
                        live: false,
                    }).init();
                } else {
                    console.error("WOW.js not loaded correctly", mod);
                }
            });
        }
    }, []);

    // code updated
    useEffect(() => {
        setFname((profiledata?.first_name === null || profiledata?.first_name === "") ? "" : profiledata?.first_name);
        setLname((profiledata?.last_name === null || profiledata?.last_name === "") ? "" : profiledata?.last_name);
        setProfileUpload(profiledata?.user_avatar_path === null ? "" : profiledata?.user_avatar_path);
        setMobileNo({
            ...MobileNo, 
            countrycode: (profiledata?.phone === null || profiledata?.phone === "") ? "1" : (parseInt(profiledata?.phone?.split("-")[0]) || parseInt(profiledata?.phone?.split(" ")[0])),
            number: (profiledata?.phone === null || profiledata?.phone === "") ? "" : (parseInt(profiledata?.phone?.split("-")[1] || parseInt(profiledata?.phone?.split(" ")[1]))),    
        });
        setAccountValue("fname", (profiledata?.first_name === null || profiledata?.first_name === "") ? "" : profiledata?.first_name);
        setAccountValue("lname", (profiledata?.last_name === null || profiledata?.last_name === "") ? "" : profiledata?.last_name);
        setAccountValue("street1", (profiledata?.address?.street_address == null || profiledata?.address?.street_address === "") ? "" : profiledata?.address?.street_address);
        setAccountValue("zip", (profiledata?.address?.zipcode == null || profiledata?.address?.zipcode === "") ? "" : profiledata?.address?.zipcode);
        setAccountValue("country", profiledata?.address?.country || "US");
        setAccountValue("state", profiledata?.address?.state || "");
        setAccountValue("city", profiledata?.address?.city || "");
        setAccountValue("birthdate", profiledata?.dob ? new Date(profiledata?.dob) : null);

        setAddress({
            ...address,
            street1: (profiledata?.address?.street_address==null||profiledata?.address?.street_address==="")?"":profiledata?.address?.street_address,
            zip: (profiledata?.address?.zipcode ===null||profiledata?.address?.zipcode===""||profiledata?.address?.zipcode===undefined)?"":profiledata?.address?.zipcode,
        });

        setKycAddress({
            ...KycAddress,
            country: (profiledata?.address?.billing_country===null || profiledata?.address?.billing_country===undefined || profiledata?.address?.billing_country==="")? "US" : profiledata?.address?.billing_country,
            city: (profiledata?.address?.billing_city===null || profiledata?.address?.billing_city===undefined || profiledata?.address?.billing_city==="") ? "": profiledata?.address?.billing_city,
            state: (profiledata?.address?.billing_state===null || profiledata?.address?.billing_state===undefined || profiledata?.address?.billing_state==="") ? "" : profiledata?.address?.billing_state,
            zip: (profiledata?.address?.billing_zipcode===null|| profiledata?.address?.billing_zipcode===undefined || profiledata?.address?.billing_zipcode==="") ? "": profiledata?.address?.billing_zipcode,
            street2: (profiledata?.address?.billing_address===null || profiledata?.address?.billing_address===undefined || profiledata?.address?.billing_address==="") ? "" : profiledata?.address?.billing_address,
        });

        const selectedState = optionsState.find(state => state?.value === profiledata?.address?.state);
        if(profiledata?.address?.state?.length===2){
            setSelectState((profiledata?.address?.state===null||profiledata?.address?.state==="")?"":selectedState?.label)
        }else{
            setSelectState((profiledata?.address?.state===null||profiledata?.address?.state==="")?"":profiledata?.address?.state)
        }
        setSelectCity((profiledata?.address?.city===null||profiledata?.address?.city==="")?"":profiledata?.address?.city)
        if (profiledata?.dob) {
                setBirthdate(new Date(profiledata?.dob));
        }

    }, [ profiledata ]);
    
    const getData = async() =>{
        window.axios
        .get(`${ADMIN_REFERRAL_CONDITION_DETAIL_API}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + accessToken,
          },
        })
        .then(function (result) {
            dispatch(getReferData(result?.data?.data));
        })
        .catch(function (result) {
          if (result?.response?.status === 403) {
            dispatch(CallLogoutUser());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("access_tokens");
          } else if (result?.response?.status === 400) {
              toast.error(result?.response?.data?.error);
         
          }
        });
      }
      const CList = [
        {        key: 232,
            name: "United States",
            value: "US"}
    ]
      useEffect(() => {
        getData()
      }, [])

      const [loading,setLoading]  = useState(false);
      const [zipLoading,setZipLoading]  = useState(false);
      useEffect(() => {
        GetZipCodes();
      }, [ ]);

      const onProfileFormSubmit = (data) => {
        const isMobileValid = MobileNo?.number?.toString()?.length === 10;
        const isDateValid = Birthdate && Birthdate !== null;
        const isAddressValid = data.street1 && data.street1.trim() !== "";
        const isZipValid = data.zip && data.zip.trim() !== "" && zipCodeBillingValids;
        const hasCountry = data.country && data.country.trim() !== "";
        const hasState = data.state && data.state.trim() !== "";
        const hasCity = data.city && data.city.trim() !== "";

        if (!isMobileValid || !isDateValid || !isAddressValid || !isZipValid || !hasCountry || !hasState || !hasCity) {
          setCustomError(true);

          if (!isMobileValid) {
            setMobileError("Please enter 10 digit number");
          } else {
            setMobileError("");
          }

          return;
        }

        setFname(data.fname.trim());
        setLname(data.lname.trim());
        setAddress((prev) => ({ ...prev, street1: data.street1, zip: data.zip }));
        setKycAddress((prev) => ({ ...prev, street2: data.street1, zip: data.zip }));
        setCustomError(false);
        setMobileError("");

        if (profiledata?.kyc_verified) {
            ProfileUpdate2();
        } else {
            ProfileUpdate();
        }
      };

      const onProfileFormError = () => {
        setCustomError(true);
      };

      const GetZipCodes = async () => {
          setZipLoading(true);
          const response = await fetch("https://sweepscoinscash.s3.us-east-2.amazonaws.com/json/zipcodes.json");
          const zipcodesdata = await response?.json();

          if(response?.status) {
            setZipLoading(false);
            dispatch(getAllZipCodes(zipcodesdata));
            } else {
            setZipLoading(false);
            dispatch(getAllZipCodes([]));
          };
      };
      


    useEffect(() => {
        UserGetAPI_Function();
    }, [LocationUrl, accountUrl]);

        const [ Birthdate, setBirthdate ] = useState("");
    

        var newDate = subtractYearsFromDate(22);

        const copyAddress=(e)=>{
            setisDisableBilling(e.target.checked);
            if(e.target.checked) {
                const selectedState = optionsState.find(state => state?.label === SelectState);
                setKycAddress({
                    ...KycAddress,
                    state: selectedState?.value,
                    city: SelectCity,
                    zip: address?.zip,
                    street2: address?.street1,
                });
            } else {
                setKycAddress({
                    ...KycAddress,
                    city: "",
                    state: "",
                    zip: "",
                    street2: "",
                });
            };
        };

         const KYCVerification  = async() =>{
            const IP = await callAPI();
            const selectedState = optionsState.find(state => state?.label === SelectState);

            const payload = {
                // ssn:SSN?.replace(/-/g, ""),
                country: SelectCountry?.value,
                state: selectedState?.value,
                city:SelectCity,
                street_address:address.street1,
                billing_country: KycAddress.country,
                billing_state: KycAddress.state,
                billing_city: KycAddress.city,
                billing_zipcode: KycAddress.zip,
                billing_address: KycAddress.street2,
                zipcode:address?.zip,
                dob_year: moment(Birthdate).format('YYYY'),
                dob_month: moment(Birthdate).format('MM'),
                dob_day: moment(Birthdate).format('DD'),
                user_ip:IP
            }
            const response = await PostRequest(
                USER_KYC_API,
                payload,
                accessToken,
                false
            );
            if (response?.status === 200) {
                UserGetAPI_Function();
                toast.success(response.data.msg);
            } else if(response?.status === 401){
                if(Array.isArray(response?.data?.error?.error)) {
                    toast.error(<ul>{response?.data?.error?.error.map((msg, index) => {
                        return(<li key={index}>{msg}</li>)
                    })}</ul>);
                } else {
                    toast.error(response?.data?.error?.error, { autoClose: 5000 });
                }
            }else if(response?.status === 400){
                if(Array.isArray(response?.data?.error?.error)) {
                    toast.error(<ul>{response?.data?.error?.error.map((msg, index) => {
                        return(<li key={index}>{msg}</li>)
                    })}</ul>);
                } else {
                    toast.error(response?.data?.error?.error, { autoClose: 5000 });
                }
            } 
             else {
                toast.error(response?.data?.error, { autoClose: 5000 });
            }
         }


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
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
            }
        });
    };

    // add credit modal
    const addredeemCredit = (data) => {
        setRedeemCrditModalState({
            ...RedeemCrditModalState,
            open: !RedeemCrditModalState.open,
            title: `Claim credits for ${data?.name}`,
            RedeemData: data,
        });
    };



    // Discard field modal function
    const DiscardAccountData = () => {
        setCommonPopup({...commonPopup, open: false});
        setFname((profiledata?.first_name === null || profiledata?.first_name === "") ? "" : profiledata?.first_name);
        setLname((profiledata?.last_name === null || profiledata?.last_name === "") ? "" : profiledata?.last_name);
        setMobileNo({...MobileNo, 
            countrycode: (profiledata?.phone === null || profiledata?.phone === "") ? "1" : (parseInt(profiledata?.phone?.split("-")[0]) || parseInt(profiledata?.phone?.split(" ")[0])),
            number: (profiledata?.phone === null || profiledata?.phone === "") ? "" : (parseInt(profiledata?.phone?.split("-")[1] || parseInt(profiledata?.phone?.split(" ")[1])))
        })
        setAddress({
            ...address,
            street1: (profiledata?.address?.street_address==null||profiledata?.address?.street_address==="")?"":profiledata?.address?.street_address,
            zip: (profiledata?.address?.zipcode ===null||profiledata?.address?.zipcode==="")?"":profiledata?.address?.zipcode,
        })
        const selectedState = optionsState.find(state => state?.value === profiledata?.address?.state);
        if(profiledata?.address?.state?.length===2){
            setSelectState((profiledata?.address?.state===null||profiledata?.address?.state==="")?"":selectedState?.label)
        }else{
            setSelectState((profiledata?.address?.state===null||profiledata?.address?.state==="")?"":profiledata?.address?.state)
        }
        setSelectCity((profiledata?.address?.city===null||profiledata?.address?.city==="")?"":profiledata?.address?.city)
        setSelectCountry("United States")
        if (profiledata?.dob) {
                setBirthdate(new Date(profiledata?.dob));
        }

    };

    // profile update function
    const ProfileUpdate = () => {
        document.getElementById("accountflag")?.classList?.remove("active");
        if(Birthdate !== ""
            // && SSN !== ""
            && address?.street1!==""&& address?.zip!==""&& ZipCodeValids === true&&SelectCountry !== "" &&SelectState!==""&&SelectCity!=="" &&fname !== "" && lname !== "" && MobileNo?.number?.toString()?.length === 10 && KycAddress?.country !== "" && KycAddress?.state !== "" && KycAddress?.city !== "" && KycAddress?.zip !== "" && zipCodeBillingValids === true && KycAddress?.street2 !== "") {
            // if(SSNRegex.test(SSN) === true){
                const jsonData = JSON.stringify({ first_name: fname, last_name: lname, phone: MobileNo?.countrycode + " " + MobileNo?.number, location: geoComplyLocation,
                    "country":SelectCountry?.value,
                    "city":SelectCity,
                    "state": SelectState,
                    "zipcode":address?.zip,
                    "street_address":address?.street1,
                    "billing_country": KycAddress.country,
                    "billing_state": KycAddress.state,
                    "billing_city": KycAddress.city,
                    "billing_zipcode": KycAddress.zip,
                    "billing_address": KycAddress.street2,
                });
                window?.axios?.post(PROFILE_UPDATE_API_URL, jsonData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    }
                }).then(function (result) {
                    dispatch(updateUser(result?.data?.data));
                    setMobileError("");
                    KYCVerification()
                })  
                .catch(function (result) {
                    toast.error(result.response.data.error);
                    if(result?.response?.status === 403) {
                        dispatch(CallLogoutUser());
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
                    };
                });
        } else {
            setCustomError(true);
            if(ZipCodeValids === false){
                setErrorZip("Please enter valid zip")
            }
            if(MobileNo?.number === "") {
                setMobileError("Phone Number cannot be empty");
            } else if(MobileNo?.number?.toString()?.length) {
                setMobileError("Please enter 10 digit number");
            } else {
                setMobileError("");
            }
        }
    }
    const ProfileUpdate2= () =>{
        document.getElementById("accountflag")?.classList?.remove("active");
        if(fname !== "" && lname !== "" && MobileNo?.number?.toString()?.length === 10 && KycAddress?.country !== "" && KycAddress?.state !== "" && KycAddress?.city !== "" && KycAddress?.zip !== "" && KycAddress?.street2 !== "") {
            const jsonData = JSON.stringify({ 
                "first_name": fname, 
                "last_name": lname, 
                "phone": MobileNo?.countrycode + " " + MobileNo?.number, 
                "location": geoComplyLocation,
                "billing_country": KycAddress.country,
                "billing_state": KycAddress.state,
                "billing_city": KycAddress.city,
                "billing_zipcode": KycAddress.zip,
                "billing_address": KycAddress.street2,
                "country":SelectCountry?.value,
                "city":SelectCity,
                "state": SelectState,
                "zipcode":address?.zip,
                "street_address":address?.street1,
            });
            window?.axios?.post(PROFILE_UPDATE_API_URL, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                }
            }).then(function (result) {
                dispatch(updateUser(result?.data?.data));
                setMobileError("");
                toast.success(result.data.msg);
            })  
            .catch(function (result) {
                toast.error(result.response.data.error);
                if(result?.response?.status === 403) {
                    dispatch(CallLogoutUser());
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
                };
            });
        } else {
            setCustomError(true);

            if(MobileNo?.number === "") {
                setMobileError("Phone Number cannot be empty");
            } else if(MobileNo?.number?.toString()?.length) {
                setMobileError("Please enter 10 digit number");
            } else {
                setMobileError("");
            }
        }
    }
    const ValidZIP = (value) => {
        if(value === "") {
            setErrorZip("Zip cannot be empty");
        } else if(ZipCodeValids === false) {
            setErrorZip("Please enter valid zip")
        } else {
            setErrorZip("");
        }
    };

    const SubmitReferralRequest = ({ message }) =>{
        document.getElementById("accountflag")?.classList?.remove("active");
            setLoading(true)
            const jsonData = JSON.stringify({ 
                   message : message
            });
            window?.axios?.post(REQUEST_FOR_REFERRAL, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                }
            }).then(function (result) {
                if(result.status===200){
                    toast.success(result.data.msg);
                    resetReferralForm({ message: "" })
                    setLoading(false)
                    setCustomError("")
                }else{
                    toast.error(result.data.msg);
                    setLoading(false)
                    setCustomError("")
                }
            })  
            .catch(function (result) {
                setLoading(false)
                toast.error(result.response.data.error);
                if(result?.response?.status === 403) {
                    dispatch(CallLogoutUser());
                };
            });
    }


    const clearInput = () => {
        resetSweepsForm({ sweepsCode: "" });
      };
    // upload avatar image
    const UploadAvatarImage = (e) => {
        setFileUploadLoader(true);
        const files = e.target.files[0];
        const formData = new FormData();
        formData.append("avatar", files, files.name);

        window.axios.post( PROFILE_UPLOAD_API_URL, formData, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            if (result.data) {
                setProfileUpload(result.data.data.user_avatar_path);
                dispatch(updateProfilePic(result.data.data.user_avatar_path));
                setTimeout(() => setFileUploadLoader(false), 100);
            }
        }).catch(function (result) {
            setTimeout(() => setFileUploadLoader(false), 100);
        });
    };

    const submitCode = () => {
        dispatch(getRegioLcTime(""));
        dispatch(getOverCallingGeoLocation(true));
        submitRedeemGeoFunction();
        document.getElementById("pageisLoading").style.display = "flex";
    }
        const[ipaddress,setIpAddress]= useState('')
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
    

    // submit redeem code
    const submitRedeemGeoFunction = () => {
        if(sweepsCode !== "") {
            window.axios.get(`${USER_REDEEM_COUPON_API_URL}${sweepsCode}?ipaddress=${ipaddress}` , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                }
            }).then(function (result) {
                if(result?.data) {
                    document.getElementById("pageisLoading").style.display = "none";
                    dispatch(updateUserWallet(result.data.data));
                    setSweepsCode("");
                    setErrorSweepsCode("");
                    toast.success(result.data.msg);
                }
            }).catch(function (result) {
                document.getElementById("pageisLoading").style.display = "none";
                // toast.error(result.response.data.error);
                if(result?.response?.status === 403) {
                    dispatch(CallLogoutUser());
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
                };
                if(result?.response?.status === 401){
                    toast.warning(result.response.data.error)
                }else{
                    toast.error(result.response.data.error);
                }

            });
        } else {
            setErrorSweepsCode("Sweeps entry code cannot be empty");
        }
    };

    // responsive tab change
    const selctResponsiveTab = (value) => {
        if(value === "My Books") {
            dispatch(accountNavigate("my-books"));
        } else if (value === "My Account") {
            dispatch(accountNavigate("my-account"));
        } else if (value === "Game Request") {
            dispatch(accountNavigate("game-request"));
        } else if(value === "Refer & Earn"){
            dispatch(accountNavigate("refer-earn"));
        }
        else {
            dispatch(accountNavigate("order-list"))
        };
    };

    useEffect(() => {
        getGamecreditList();
        getOrderList();
        setPaginationLength({});
        setPaginationLengthnew({});
        ProductList();
    }, [ maintain.filter,maintain.limit, maintain.page, searchNone, accountUrl ]);

    useEffect(() => {
        getOrderList();
    }, [ userType, userLimit, currentPage, searchNone ]);

    // select user type
    const SelectUserTypeFnct = (e) => {
        setUserType(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        setMaintain({...maintain,
            filter:"all",
            limit: 10,
            page: 1,
            search:""
        });
        setUserSearch("");
        setCurrentPage(1);
    }, [ accountUrl ]);

    // on Enter search
    const onEnterSearch = (e) => {
        const code = e.which || e.keyCode;
        if(code !== 17 && code !== 18) {
            if(code === 13) {
                getGamecreditList(1);
            } else if(maintain.search === "" || maintain.search?.length <= 1) {
                getGamecreditList();
            };
        };
    };

    // on Enter search
    const onEnterSearchNew = (e) => {
        const code = e.which || e.keyCode;
        if(code !== 17 && code !== 18) {
            if(code === 13) {
                getOrderList(1);
            } else if(maintain.search === "" || maintain.search?.length <= 1) {
                getOrderList();
            };
        };
    };

    const clearSearch = () => {
        setMaintain({
             ...maintain,
             search:""
        });
        setUserSearch("");
        setSearchNone(true);
    };

    const getOrderList = (pages) => {
        if(pages !== undefined) {
            setCurrentPage(pages);
        };
        
        window.axios.get(`${ORDER_LIST_API_URL}/${userType}/${userLimit}/${pages === undefined ?currentPage : pages}/${userSearch === "" ? "none" : userSearch.trim()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            dispatch(GetOrderList(result.data.data));
            setPaginationLengthnew(result.data.pagination);
            setSearchNone(false);
        })
        .catch(function (result) {
                dispatch(GetOrderList([]));
             if(result?.response?.status === 403) {
               dispatch(CallLogoutUser());
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
             }
        });
    };

    const getGamecreditList = (pages) => {
        if(pages !== undefined) {
            setMaintain({...maintain,
                page: pages,
            });
        };
        window.axios.get(`${USER_CREDIT_LIST_API_URL}/${maintain?.filter}/${maintain.limit}/${pages === undefined ? maintain.page : pages}/${maintain.search === "" ? "none" : maintain.search.trim()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            setSearchNone(false);
            dispatch(getCreditlist(result.data.data));
            setPaginationLength(result.data.pagination)
        })
        .catch(function (result) {
                dispatch(getCreditlist([]));
             if(result?.response?.status === 403) {
               dispatch(CallLogoutUser());
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
             }
        });
    };

    const ProductList = () => {
        //  get my product
        window.axios.get( `${GET_PRODUCT_API_URL}/5000/1`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(function (result) {
            dispatch(GetProductsIdWise(result.data.data));
            dispatch(getProductList(result.data.data));
        }).catch(function (result) {
            dispatch(GetProductsIdWise([]));
            dispatch(getProductList([]));
            if(result?.response?.status === 403) {
                dispatch(CallLogoutUser());
               localStorage.removeItem("accessToken");
               localStorage.removeItem("access_tokens");
            };
        });
    };

    // page change
    const currentFunction = (page) => {
        setMaintain({...maintain,
            page: page,
        });
    };

    const currentFunctionSet = (page) => {
        setCurrentPage(page);
    };

const [cvalue,setCValue] = useState("Copy")
    const copyReferralCode = () => {
        navigator.clipboard.writeText(profiledata?.referral_code);
        setCValue("Copied")
        setTimeout(() => {
            setCValue("Copy")
        }, 2000);

    };


const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value.startsWith(" ")
        ? value.trimStart()
        : value;

    if (name === "street1" || name === "street2") {
        if (sanitizedValue.length > 30) {
            sanitizedValue = sanitizedValue.slice(0, 30);
        }
    }

    if (name === "zip") {
        if (!/^\d*$/.test(sanitizedValue)) {
            return;
        }
        if (sanitizedValue.length > 6) {
            sanitizedValue = sanitizedValue.slice(0, 6);
        }
    }

    setAddress((prevAddress) => ({
        ...prevAddress,
        [name]: sanitizedValue,
    }));
}

const getCountryIsoCodeByName = (countryName) => {
    const country = Country.getAllCountries().find(country => country.name === countryName);
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
useEffect(()=>{
    fetchStates(SelectCountry?.label)
    fetchCities(SelectCountry?.label, SelectState);  

},[SelectCountry, SelectState])

const getStateIsoCodeByName = (countryIsoCode, stateName) => {

    const states = State.getStatesOfCountry(countryIsoCode);
    const state = states.find(state => state.name === stateName);  
    return state ? state.isoCode : "";  
};
const ZipCodesFilter = Array.isArray(zipCodesAll)? zipCodesAll.filter((elm) => elm?.state?.toString() === stateIsoCode): [];
const ZipCodeValids = ZipCodesFilter?.filter((elm) => elm?.zip_code?.toString() === address?.zip)?.length > 0;

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
const SelectCountryChange = (e) => {
    const selectedCountry = e.target.value; 
    setSelectCountry(selectedCountry);
    setSelectState("")
    setSelectCity("");
};
const SelectStateChange = (e) => {
    const selectedState = e.target.value;
    setErrorZip("")
    if (selectedState !== "") {
        setSelectState(selectedState);  
        setSelectCity("");  
        fetchCities(SelectCountry, selectedState);  

    } else {
        setSelectState("");
        setSelectCity("");  
    }

};

const SelectCityChange = (e) => {
    const selectedCity = e.target.value;  
    setErrorZip("")
    if (selectedCity !== "") {
        setSelectCity(selectedCity);  
    } else {
        setSelectCity("");  
    }

};

    return(<section className="accoutntwrapper">
        <div className="container custom_container_account">
            <div className="myacountsatabswrps">
                <div className="row" style={{ margin: "auto" }}>
                    <div className="col-md-3">
                        <div className="myaccountprofilepic">
                            <div className="acctprofile">
                                <AppImage src={profileUpload || images.account.defaultProfile} fallbackSrc={images.account.defaultProfile} alt="profile" width={180} height={180} />
                                <label className="uploadfileovarlay">
                                    <div className="svgwrp">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M14.267,4 C14.801,4 15.299,4.287 15.566,4.75 L15.566,4.75 L16.144,5.75 C16.233,5.904 16.399,6 16.577,6 L16.577,6 L19.5,6 C20.327,6 21,6.673 21,7.5 L21,7.5 L21,17.5 C21,18.327 20.327,19 19.5,19 L19.5,19 L4.5,19 C3.673,19 3,18.327 3,17.5 L3,17.5 L3,7.5 C3,6.673 3.673,6 4.5,6 L4.5,6 L7.435,6 C7.609,6 7.773,5.907 7.863,5.758 L7.863,5.758 L8.483,4.727 C8.752,4.278 9.245,4 9.769,4 L9.769,4 Z M14.267,5 L9.769,5 C9.594,5 9.43,5.093 9.34,5.242 L9.34,5.242 L8.72,6.273 C8.451,6.722 7.958,7 7.435,7 L7.435,7 L4.5,7 C4.224,7 4,7.225 4,7.5 L4,7.5 L4,17.5 C4,17.775 4.224,18 4.5,18 L4.5,18 L19.5,18 C19.776,18 20,17.775 20,17.5 L20,17.5 L20,7.5 C20,7.225 19.776,7 19.5,7 L19.5,7 L16.577,7 C16.043,7 15.545,6.713 15.278,6.25 L15.278,6.25 L14.7,5.25 C14.611,5.096 14.445,5 14.267,5 L14.267,5 Z M11.9996,7.9999 C13.2656,7.9999 14.4706,8.6099 15.2236,9.6329 C15.9876,10.6719 16.1996,11.9939 15.8046,13.2609 C15.4326,14.4579 14.4576,15.4329 13.2606,15.8049 C12.8426,15.9349 12.4176,15.9989 11.9996,15.9989 C11.1516,15.9989 10.3286,15.7349 9.6336,15.2229 C8.6106,14.4699 7.9996,13.2659 7.9996,11.9999 C7.9996,9.7939 9.7946,7.9999 11.9996,7.9999 Z M11.9996,8.9999 C10.3456,8.9999 8.9996,10.3459 8.9996,11.9999 C8.9996,12.9489 9.4586,13.8529 10.2256,14.4169 C11.0056,14.9919 12.0026,15.1479 12.9636,14.8499 C13.8506,14.5729 14.5736,13.8519 14.8496,12.9639 C15.1486,12.0029 14.9916,11.0059 14.4176,10.2259 C13.8526,9.4579 12.9496,8.9999 11.9996,8.9999 Z"></path></svg>
                                    </div>
                                    <input type="file" onChange={UploadAvatarImage} accept=".svg, .png, .jpg, .jpeg, .webp" />
                                </label>
                                {fileUploadLoader === true && <div className="imageloader"><AppImage src={images.account.profileLoader} alt="loader" width={48} height={48} /></div>}
                            </div>
                            <h4>{(profiledata.first_name === null && profiledata.last_name === null) ? profiledata?.email : 
                                (profiledata.first_name !== null ? profiledata.first_name : "") + " " + (profiledata.last_name !== null ? profiledata.last_name : "")}</h4>
                        </div>
                        {screen.width > 767 ? (<div className="accountsRouting">
                            <a className={accountUrl === "my-books" ? "accountsRoutingLink active" : "accountsRoutingLink"} onClick={() => dispatch(accountNavigate("my-books"))}>Member Dashboard</a>
                            <a className={accountUrl === "my-account" ? "accountsRoutingLink active" : "accountsRoutingLink"} 
                                onClick={() => {
                                    dispatch(accountNavigate("my-account"));
                                    setCustomError(false)
                                    setErrorZip("")
                                }}
                            >My Account</a>
                            <Link to="/packages" className="accountsRoutingLink">Buy Bundles</Link>
                            <a className={accountUrl === "game-request" ? "accountsRoutingLink active" : "accountsRoutingLink"} onClick={() => dispatch(accountNavigate("game-request"))}>Game Requests</a>
                            <a className={accountUrl === "order-list" ? "accountsRoutingLink active" : "accountsRoutingLink"} onClick={() => dispatch(accountNavigate("order-list"))}>Order List</a>
                            <a href={process.env.NEXT_PUBLIC_SITE === "STAGING" ? "https://scc.appristine.in/my-account" : "https://www.sweepscoins.cash/my-account"} target="_blank">Redeem Now</a>
                            <a className={accountUrl === "refer-earn" ? "accountsRoutingLink active" : "accountsRoutingLink"} 
                                onClick={() => {
                                    dispatch(accountNavigate("refer-earn"))
                                    setCustomError(false)
                                    setErrorZip("")
                                }
                            }>Refer & Earn</a>
                        </div>) : (<select className="selectAccountssct" 
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "Redeem Now") {
                                const url = process.env.NEXT_PUBLIC_SITE === "STAGING" ? "https://scc.appristine.in/my-account" : "https://www.sweepscoins.cash/my-account";
                                window.open(url, "_blank");
                            } else if(value === "Buy Bundles") {
                                navigate("/packages");
                            } else {
                                selctResponsiveTab(value);
                            }
                        }}
                        >
                            <option value="My Books">Member Dashboard</option>
                            <option value="My Account">My Account</option>
                            <option value="Buy Bundles">Buy Bundles</option>
                            <option value="Game Request">Game Requests</option>
                            <option value="Order List">Order List</option>
                            <option value="Redeem Now">Redeem Now</option>
                            <option value="Refer & Earn">Refer & Earn</option>
                            
                        </select>)}
                    </div>  
                    <div className="col-md-9">
                        {accountUrl === "my-account" ? (<div className="myaccountwrps">
                            <div className="myaccountwrpsheader">
                                <div className="headertitle">
                                    <h4>My Account</h4>
                                    <p>View and edit your personal info below.</p>
                                </div>
                                <div className="bttngroup">
                                    <Button 
                                        className="btn updteinfobtn" 
                                        onClick={handleAccountSubmit(onProfileFormSubmit, onProfileFormError)}
                                        disabled={zipLoading}
                                    >Update Info</Button>
                                </div>
                            </div>
                            <div className="accountwrps">
                                <h4>Account</h4>
                                <h5>Update your personal information.</h5>
                                <div className="paymentformsWraps">
                                    <div className="rowcustom rowcustom-col-2">
                                        <div className={CustomError && fname === "" ? "form-group error" : "form-group"}>
                                            <label>Login Email:</label>
                                            <div className="emailset">{profiledata?.email}</div>
                                            <div className="noteemail">Your Login email can't be changed</div>
                                        </div>
                                    </div>
                                    <div className="rowcustom rowcustom-col-2">
                                        <div className={accountErrors.fname ? "form-group error" : "form-group"}>
                                            <label>First Name</label>
                                            <div className="form-groupfiled">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={fname}
                                                    {...registerAccount("fname", { required: "First name cannot be empty" })}
                                                    onChange={async (e) => {
                                                        const value = e.target.value;
                                                        setFname(value);
                                                        setAccountValue("fname", value);
                                                        await triggerAccount("fname");
                                                    }}
                                                    placeholder="Enter first name"
                                                />
                                                {fname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {accountErrors.fname && <div className="danger-color">{accountErrors.fname.message}</div>}
                                            </div>
                                        </div>
                                        <div className={accountErrors.lname ? "form-group error" : "form-group"}>
                                            <label>Last Name</label>
                                            <div className="form-groupfiled">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={lname}
                                                    {...registerAccount("lname", { required: "Last name cannot be empty" })}
                                                    onChange={async (e) => {
                                                        const value = e.target.value;
                                                        setLname(value);
                                                        setAccountValue("lname", value);
                                                        await triggerAccount("lname");
                                                    }}
                                                    placeholder="Enter last name"
                                                />
                                                {lname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {accountErrors.lname && <div className="danger-color">{accountErrors.lname.message}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rowcustom rowcustom-col-2">
                                        <div className={(MobileError !== "" && MobileNo?.number?.toString()?.length !== 10) ? "form-group error" : "form-group"}>
                                            <label>Phone</label>
                                            <div className="form-groupfiled">
                                                <CountrySelectInput 
                                                    MobileNo={MobileNo}
                                                    setMobileNo={setMobileNo}
                                                    id={"accountflag"}
                                                />
                                                {MobileNo?.number?.toString()?.length === 10 && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {MobileNo?.number?.toString()?.length !== 10 && <div className="danger-color">{MobileError}</div>}
                                            </div>
                                        </div>
                                        <div className={accountErrors.birthdate ? "form-group date-picker-wrapper error" : "form-group date-picker-wrapper"}>
                                            <label>Date of Birth *</label>
                                            <div className="form-groupfiled">
                                                <input type="hidden" {...registerAccount("birthdate", { required: "Date of birth cannot be empty" })} />
                                                <DatePicker 
                                                    selected={Birthdate} 
                                                    onChange={async (date) => {
                                                        setBirthdate(date);
                                                        setAccountValue("birthdate", date);
                                                        await triggerAccount("birthdate");
                                                    }} 
                                                    peekNextMonth 
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    placeholderText="Date of birth"
                                                    maxDate={newDate}
                                                    style={{display:"flex",}}
                                                    disabled={profiledata?.kyc_verified}
                                                />
                                                {Birthdate !== "" && Birthdate !== null && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {accountErrors.birthdate && <div className="danger-color">{accountErrors.birthdate.message}</div>}
                                            </div>
                                        </div>
                                    </div>
                        <h4 className="address-details-id">Home Address Details :</h4>
                        <div className="rowcustom rowcustom-col-2">
                        <div className={accountErrors.country ? "form-group error" : "form-group"}>
                                <label>Country</label>
                                <div className="form-groupfiled">
                                    <select
                                        className="form-control"
                                        {...registerAccount("country", { required: "Country is required" })}
                                        onChange={async (e) => {
                                            SelectCountryChange(e);
                                            setAccountValue("country", e.target.value);
                                            await triggerAccount("country");
                                        }}
                                        value={SelectCountry}
                                        aria-label="Default select example"
                                        disabled={profiledata?.kyc_verified}
                                    >
                                        {CList?.map((elm, index) => {
                                            return(<option value={elm.name} key={index}>{elm.name}</option>)
                                        })}
                                    </select>
                                    {accountErrors.country && <div className="danger-color">{accountErrors.country.message}</div>}
                                </div>
                            </div>

                            <div className={accountErrors.state ? "form-group error" : "form-group"}>
                                <label>State</label>
                                <div className="form-groupfiled">
                                <select
                                    className="form-control"
                                    {...registerAccount("state", { required: "State is required" })}
                                    value={SelectState}
                                    onChange={async (e) => {
                                        SelectStateChange(e);
                                        setAccountValue("state", e.target.value);
                                        await triggerAccount("state");
                                    }}
                                    aria-label="Default select example"
                                    disabled={profiledata?.kyc_verified}
                                >
                                  <option value="">Select State</option>
                                    {optionsState?.length > 0 ? (
                                      <>
                                     {optionsState.map((elm, index) => (
                                      <option value={elm.label} key={index} >
                                       {elm.label}
                                     </option>
                                      ))}
                                       </>
                                    ) : (
                                         <option disabled>No state found</option>
                                      )}

                                </select>
                                    {accountErrors.state && <div className="danger-color">{accountErrors.state.message}</div>}
                                </div>

                            </div>
                        </div>
                        <div className="rowcustom rowcustom-col-2">
                        <div className={accountErrors.city ? "form-group error" : "form-group"}>
                                <label>City</label>
                                <div className="form-groupfiled">
                                <select
                                    className="form-control"
                                    {...registerAccount("city", { required: "City is required" })}
                                    value={SelectCity}
                                    onChange={async (e) => {
                                        SelectCityChange(e);
                                        setAccountValue("city", e.target.value);
                                        await triggerAccount("city");
                                    }}
                                    aria-label="Default select example"
                                    disabled={profiledata?.kyc_verified}
                                >
                                       <option value="">Select City</option>
                                       {optionsCity?.length > 0 ? (
                                        <>
                                       {optionsCity.map((elm, index) => (
                                         <option value={elm.label} key={index}>
                                          {elm.label}
                                         </option>
                                       ))}
                                     </>
                                   ) : ( 
                                     <option disabled>No city found</option>
                                   )}
                                </select>
                                    {accountErrors.city && <div className="danger-color">{accountErrors.city.message}</div>}
                                </div>
                            </div>
                        <div className={accountErrors.zip ? "form-group error" : "form-group"}>
                                <label>ZIP</label>
                                <div className="form-groupfiled">
                                    <input type="text"
                                        name="zip"
                                        className="form-control" 
                                        {...registerAccount("zip", {
                                            required: "ZIP cannot be empty",
                                            validate: (value) => (ZipCodeValids || "Enter valid ZIP")
                                        })}
                                        value={address?.zip} 
                                        onChange={(e) => {
                                            handleChange(e); 
                                            setAccountValue("zip", e.target.value);
                                        }} 
                                        onKeyUp={(e) => ValidZIP(e.target.value)}
                                        placeholder={"Enter Zip Code"} 
                                        disabled={profiledata?.kyc_verified || zipLoading}
                                    />
                                    {zipCodeBillingValids === true && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"success icon"} width={18} height={18} />}
                                    {zipCodeBillingValids === false && <AppImage src={images.common.errorIcon} className="errorsuccessicon" alt={"success icon"} width={18} height={18} />}

                                    {accountErrors.zip && <div className="danger-color">{accountErrors.zip.message}</div>}
                                    {errorZip !== "" && <div className="danger-color">{errorZip}</div>}
                                </div>
                            </div>  
                        </div>
                        <div className="rowcustom rowcustom-col-1">
                        <div className={accountErrors.street1 ? "form-group error" : "form-group"}>
                                <label>Home Address</label>
                                <div className="form-groupfiled">
                                    <input type="text"
                                     className="form-control" 
                                     name="street1"
                                     {...registerAccount("street1", { required: "Home address cannot be empty" })}
                                     value={address.street1} 
                                    onChange={async (e) => {
                                        handleChange(e);
                                        setAccountValue("street1", e.target.value);
                                        await triggerAccount("street1");
                                    }}
                                    disabled={profiledata?.kyc_verified}

                                     placeholder="Enter address"
                                      />
                                    {(address.street1 !== "") && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {accountErrors.street1 && <div className="danger-color">{accountErrors.street1.message}</div>}
                                </div>
                            </div>
                            
                        </div>
                        <h4 className="address-details-id">
                            Billing Address Details :
                            <div className="form-group-checkbox form-group-checkbox-billing">
                                <input 
                                    type="checkbox" 
                                    id="termsconditions" 
                                    onClick={(e) => copyAddress(e)} 
                                    disabled={SelectCountry === "" || SelectState === "" || SelectCity === "" || address?.zip === "" || ZipCodeValids === false || address?.street1 === ""}
                                />
                                <label htmlFor="termsconditions"> Same as Home Address</label>
                            </div>
                        </h4>
                            <CommonBillingAddressForm 
                                KycAddress={KycAddress} 
                                setKycAddress={setKycAddress}
                                CustomError={CustomError}
                                zipCodeBillingValids={zipCodeBillingValids}
                                setZipCodeBillingValids={setZipCodeBillingValids}
                                isDisabled={isDisableBilling}
                                zipLoading={zipLoading}
                            />

                                    <div className="rowcustomright" >
                                        <Button 
                                            className="btn updteinfobtn" 
                                            onClick={() => {
                                                if(profiledata?.kyc_verified){
                                                    ProfileUpdate2()
                                                } else{
                                                    ProfileUpdate()
                                                }
                                            }}
                                            disabled={zipLoading}
                                        >Update Info</Button>
                                    </div>
                                </div>
                            </div>
                        </div>) : accountUrl === "game-request" ? (<div className="gameListing">
                            <h4>Game Request List :</h4>
                            <div className="card-header-New">
                                <div className="searchBoxwithbtn" style={{ width: "324px" }}>
                                    {maintain.search !== "" && (<label id="focusLabel" className="focusLabel">Search after hitting the enter button.</label>)}
                                    <input type="text" className="form-control" value={maintain.search} onKeyDown={(e) => onEnterSearch(e)} onChange={(e) => setMaintain({...maintain,search:e.target.value})} placeholder="Search (Name, request id)" />
                                    {maintain.search === "" ? (<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>) : (<AppImage src={images.common.closeButton} className="icon searchclear" onClick={() => clearSearch()} alt="close" width={18} height={18} />)}
                                </div>
                                <div className="card-header-right">
                                    <select className="form-control activestatusselet" style={{ width: "125px" }} value={maintain.filter} onChange={(e) => setMaintain({...maintain, filter: e.target.value})}>
                                        <option value="all">All</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="unprocessed">Unprocessed</option>
                                    </select>
                                    <select className="form-control userLimitselect" value={maintain.limit} onChange={(e) => setMaintain({...maintain,limit:e.target.value})}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                        <option value="60">60</option>
                                        <option value="70">70</option>
                                        <option value="80">80</option>
                                        <option value="90">90</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <div className="table_set">
                                <div className="table-responsive" style={{ width: window?.screen?.width < 700 ? window?.screen?.width - 40 + 'px' : "inherit" }}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Request ID</th>
                                                <th>Game Name</th>
                                                <th>Image</th>
                                                <th>Credit</th>
                                                <th>Available balance</th>
                                                <th>Registered</th>
                                                <th>Created at</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {creditList && creditList?.length === 0 ? (<tr>
                                            <td colSpan="10" style={{ textAlign: "center" }}>No Record Found</td>
                                        </tr>) : creditList?.map((item, index) => {
                                                return (<tr key={index}>
                                                <td>{item?.id}</td>
                                                <td>{item?.product_name}</td>
                                                <td className="userAvatar">
                                                    {item?.product_img === null ? (<AppImage src={images.common.defaultProduct} style={{ width: "70px" }} alt="game" width={70} height={70} />) : (<AppImage src={item?.product_img} style={{ width: "70px" }} alt="game" width={70} height={70} />)}
                                                </td>
                                                <td>{item?.amount / 100}</td>
                                                <td>${item?.user_available_balance / 100}</td>
                                                <td>{(item?.is_registered === null || item?.is_registered === false) ? <span className="label_status error">No</span> : <span className="label_status success">Yes</span>}</td>
                                                <td>{timeSince(new Date(item?.created_at))}</td>
                                                <td>
                                                    {item?.status === "rejected" ? <span className="label_status error">Rejected</span> : item?.status === null ? <span className="label_status error">Unprocessed</span> : <span className="label_status success">Approved</span>}
                                                </td>
                                            </tr>)})}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            {creditList?.length > 0 && (<PaginationPage 
                                paginationLength={paginationLength}
                                totalPages={paginationLength?.total_records}
                                currentPage={maintain?.page}
                                onChangePage={currentFunction}
                                userLimit={maintain?.limit}
                            />)}
                        </div>) : accountUrl === "order-list" ? (<div className="gameListing">
                            <h4>Order List :</h4>
                            <div className="card-header-New">
                                <div className="searchBoxwithbtn" >
                                    {userSearch !== "" && (<label id="focusLabel" className="focusLabel">Search after hitting the enter button.</label>)}
                                    <input type="text" className="form-control" value={userSearch} onKeyDown={(e) => onEnterSearchNew(e)} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search (First name, Last name)" />
                                    {userSearch === "" ? (<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>) : (<AppImage src={images.common.closeButton} className="icon searchclear" onClick={() => clearSearch()} alt="close" width={18} height={18} />)}
                                </div>
                                <div className="card-header-right">
                                    <select className="form-control activestatusselet" style={{ width: "125px" }} value={userType} onChange={(e) => SelectUserTypeFnct(e)}>
                                        <option value="all">All</option>
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="pending">Pending</option>

                                    </select>
                                    <select className="form-control userLimitselect" value={userLimit} onChange={(e) => setUserLimit(e.target.value)}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                        <option value="60">60</option>
                                        <option value="70">70</option>
                                        <option value="80">80</option>
                                        <option value="90">90</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <div className="table_set">
                                <div className="table-responsive" style={{ width: window?.screen?.width < 700 ? window?.screen?.width - 40 + 'px' : "inherit" }}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Country</th>
                                                <th>Phone</th>
                                                <th style={{ width: "250px" }}>Packages</th>
                                                <th>Total Amount</th>
                                                <th>Payment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderlist && orderlist?.length === 0 ? (<tr>
                                            <td colSpan="10" style={{ textAlign: "center" }}>No Record Found</td>
                                                </tr>) : orderlist?.map((orders, index) => {
                                                    return(<tr key={index}>
                                                        <td>{orders?.first_name}</td>
                                                        <td>{orders?.last_name}</td>
                                                        <td>{orders?.email}</td>
                                                        <td>{orders?.country?orders?.country:"-"}</td>
                                                        <td>{orders?.phone}</td>
                                                        <td>
                                                            {orders?.cart ? (
                                                                <React.Fragment>
                                                                    {orders?.cart?.map((elm, index) => {
                                                                        return(<div className="order_list" key={index}>
                                                                        {elm?.package_image_path === null ? (<AppImage src={images.common.defaultProduct} style={{ width: "60px" }} alt="game" width={60} height={60} />) : (<AppImage src={elm?.package_image_path} style={{ width: "60px" }} alt="game" width={60} height={60} />)}
                                                                        {elm?.name}
                                                                    </div>)
                                                                    })}
                                                                </React.Fragment>
                                                            ):(
                                                                <React.Fragment>
                                                                    -
                                                                </React.Fragment>
                                                            )}
                                                        </td>
                                                        <td>${orders?.total_amount / 100}</td>
                                                        <td>
                                                            {orders?.is_paid === true ? (
                                    <span className="label_status success">Paid</span>
                                    ) : orders?.is_paid === false ? (
                                    <span className="label_status error">Failed</span>
                                    ) : (
                                    <span className="badge bg_faint_yellow">Pending</span>
                                    )}
                                                        </td>
                                                    </tr>)
                                                })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            {orderlist?.length > 0 && (<PaginationPage 
                                paginationLength={paginationLengthNew}
                                totalPages={paginationLengthNew?.total_records}
                                currentPage={currentPage}
                                onChangePage={currentFunctionSet}
                                userLimit={userLimit}
                            />)}
                        </div>) :  accountUrl === "refer-earn" ? 
                        <>
                        {
                            profiledata?.referral_code ?(
                        <div className="Refer-container">
            <h3 className="title">Give more <span className="subtitle">referrals.</span> Earn more <span className="subtitle">rewards.</span></h3>

            <div className="reward-section">
                <div class="rewards-box" style={{display:"block",margin:'15px 0px'}}>
               <h2 className="Main_Title">Earn up to <span className="New_Title">$100</span> in <span className="New_Title">FREE</span> credits!!</h2>
             </div>


            </div>
            <div className="description">
            Invite your friends and family to Sweepcoins. Earn on 100% deposit bonus.
            </div>
            <div  className="Button_Conatiner">

            <div className="referral-code-section">
                <span className="referral-code">{profiledata?.referral_code}</span>
                <button className="copy-button" onClick={copyReferralCode}>{cvalue}</button>
            </div>
           <RWebShare
                data={{
                  url: `${window?.location?.origin}/home?refer-code=${profiledata?.referral_code?profiledata?.referral_code:""}`,
                  title: `Share`,
                }}
                closeText={`Close`}
              >
                <div className="Invite_Friend_Btn">
                <button>Invite</button>
            </div>
         </RWebShare>

</div>
       <div className="refer-and-earn">
      <h2 >How <span>Refer & Earn</span> Works?</h2>
      <div class="stepper-wrapper">
  <div class="stepper-item">
    <div class="step-counter">1</div>
    <div class="step-name">Open an <br></br>Sweepcoins account.</div>
  </div>
  <div class="stepper-item">
    <div class="step-counter">2</div>
    <div class="step-name">Refer friend & loved ones to Sweepcoins.</div>
  </div>
  <div class="stepper-item active">
    <div class="step-counter">3</div>
    <div class="step-name">Your referred friend opens Sweepcoins account.</div>
  </div>
  <div class="stepper-item">
    <div class="step-counter">4</div>
    <div class="step-name">
    {/* {getReferralMessage(referData)} */}
    Your referral will receive their reward upon account creation! Enjoy sharing and earning with us.
    </div>
  </div>
</div>

    </div>

                       </div>
                            ):
                            <div className="myaccountwrps">
                            <div className="accountwrps">
                            <h4 className="New_Referral_title">Be a part of our referral program!!</h4>
                            <p style={{fontSize:'14px'}}>Join our referral program today and enjoy exclusive rewards for sharing with your friends and family!</p>
                            <div className="paymentformsWraps">
                            <div className="rowcustom rowcustom-col-2">
                                        <div className={CustomError && fname === "" ? "form-group error" : "form-group"}>
                                            <label>First Name</label>
                                            <div className="form-groupfiled">
                                                <input type="text" className="form-control" value={fname} onChange={(e) => setFname(e.target.value.trim())} placeholder="Enter first name"  disabled={fname}/>
                                                {fname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {CustomError && fname === "" && <CustomMendotoryMsg value={fname} label={"First name"} />}
                                            </div>
                                        </div>
                                        <div className={CustomError && lname === "" ? "form-group error" : "form-group"}>
                                            <label>Last Name</label>
                                            <div className="form-groupfiled">
                                                <input type="text" className="form-control" value={lname} onChange={(e) => setLname(e.target.value.trim())} placeholder="Enter last name" disabled={lname} />
                                                {lname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {CustomError && lname === "" && <CustomMendotoryMsg value={lname} label={"Last name"} />}
                                            </div>
                                        </div>
                                    </div>
                            <div className="rowcustom rowcustom-col-2">
                                        <div className={CustomError && fname === "" ? "form-group error" : "form-group"}>
                                            <label>Email</label>
                                            <div className="form-groupfiled">
                                                <input type="text" className="form-control" value={profiledata?.email} onChange={(e) => setFname(e.target.value.trim())} placeholder="Enter email"  disabled={profiledata?.email}/>
                                                {profiledata?.email !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {CustomError && profiledata?.email === "" && <CustomMendotoryMsg value={profiledata?.email} label={"First name"} />}
                                            </div>
                                        </div>
                                     <div className={(MobileError !== "" && MobileNo?.number?.toString()?.length !== 10) ? "form-group error" : "form-group"}>
                                            <label>Phone</label>
                                            <div className="form-groupfiled">
                                                <CountrySelectInput 
                                                    MobileNo={MobileNo}
                                                    setMobileNo={setMobileNo}
                                                    id={"accountflag"}
                                                    isPointer={true}
                                                />
                                                {MobileNo?.number?.toString()?.length === 10 && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                                {MobileNo?.number?.toString()?.length !== 10 && <div className="danger-color">{MobileError}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rowcustom">
                            <div className={referralErrors?.message ? "form-group error" : "form-group"}>
                                <label>Message</label>
                                <div className="form-groupfiled">
                                    <Controller
                                        name="message"
                                        control={referralControl}
                                        rules={{ required: "Message cannot be empty" }}
                                        render={({ field }) => (
                                            <textarea  
                                                type="text" 
                                                className="form-control" 
                                                value={field.value} 
                                                id="input" 
                                                onChange={(e) => field.onChange(e.target.value)} 
                                                placeholder="Type your message here..." 
                                                maxLength={256} 
                                            />
                                        )}
                                    />
                                    {message !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {referralErrors?.message?.message && <CustomMendotoryMsg value={""} label={"Message"} />}

                                    <span className="address_limit">
                                        {message?.length || 0}/256
                                    </span>
                                </div>
                            </div>
                        </div>

                                    <div className="rowcustomright" >
                                        <Button className="btn updteinfobtn" 
                                        style={{display:"flex",justifyContent:"center",alignItems:"center"}}
                                        disabled={loading}
                                        onClick={handleReferralSubmit(SubmitReferralRequest)}>Submit Request 
                                             {loading&&<span className="loading_spinner2"></span>}
                                        </Button>
                                    </div>
                            </div>                                
                            </div>
                            </div>
                        }

                        </>:
                         (<div className="redeemprizebest">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="redeemformadd">
                                        <h4>ENTER SWEEPS ENTRY CODE</h4>
                                        <form onSubmit={handleSweepsSubmit(submitCode)}>
                                        <div style={{ position: "relative"}}>
                                        <Controller
                                            name="sweepsCode"
                                            control={sweepsControl}
                                            rules={{ required: "Sweeps entry code cannot be empty" }}
                                            render={({ field }) => (
                                        <input type="text"      style={{
      paddingRight: "35px", 
      width: "100%", 
    }}
 className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))}/>
                                            )}
                                        />
                                        {sweepsCode && (
    <div
      onClick={clearInput}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        width: "20px", 
        height: "20px",
      }}
    >
      <AppImage
        src={images.common.closeX}
        alt="Clear"
        width={20}
        height={20}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", 
        }}
      />
    </div>
  )}

                                        </div>
                                        {sweepsErrors?.sweepsCode?.message && (<div className="danger-colorset">{sweepsErrors.sweepsCode.message}</div>)}
                                        <button type="submit">SUBMIT CODE</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="redeemprice_wrapper">
                                        <h1 className="wow fadeInLeft">SWEEPS COINS WALLET</h1>
                                        <h4 className="avilableredeemprice">YOUR AVAILABLE CREDITS </h4>
                                        <h5 className="reedemPrice">
                                            {(profiledata?.user_balance === null || profiledata?.user_balance === 0) ? 0 : profiledata?.user_balance / 100}
                                        </h5>
                                        <h4>
                                            ALLOCATE CREDITS BELOW
                                        </h4>
                                        <div className="redeemprizewrapper">
                                            <div className="row">
                                                {products?.length > 0 ? products && products?.map((elm, index) => {
                                                    return(
                                                        <div className="col-4" key={index}>
                                                            <AppImage src={elm?.product_img_path} onClick={() => addredeemCredit(elm)} alt={"redeem price_" + index} width={140} height={140} />
                                                        </div>
                                                    )
                                                }) : (<h5>Games Not Found !</h5>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}

                    </div>
                </div>
            </div>
        </div>
        {commonPopup?.open && (<CommonModal DiscardAccountData={DiscardAccountData} commonPopup={commonPopup} setCommonPopup={setCommonPopup} />)}
        {commonPopup?.open && (<div className="ModalBackground"></div>)}

        {RedeemCrditModalState?.open && (<RedeemCreditsModal RequestProcessModel={RequestProcessModel} setRequestProcessModel={setRequestProcessModel} UserBlalance={profiledata?.user_balance} accessToken={accessToken} RedeemCrditModalState={RedeemCrditModalState} setRedeemCrditModalState={setRedeemCrditModalState} />)}
        {RedeemCrditModalState?.open && (<div className="redeembackground" onClick={() => setRedeemCrditModalState({...RedeemCrditModalState, open: false})}></div>)}

        {RequestProcessModel?.open && (<div className="statusPendingModel">
            <AppImage src={images.account.cashPayment} alt="icon" width={80} height={80} />
            <h1>Your <b>{productidObjects[RequestProcessModel?.data?.product_id].name}</b> credit request is currently in progress. You will receive a confirmation email regarding your credit request with the request id<div className="request_id_pass">{RequestProcessModel?.data?.request_id}</div></h1>
            <button className="btn" onClick={() => setRequestProcessModel({...RequestProcessModel, open: false, data: {}})} >Ok</button>
        </div>)}
        {RequestProcessModel?.open && (<div className="ModalBackground" onClick={() => setRequestProcessModel({...RequestProcessModel, open: false, data: {}})}></div>)}
    </section>)
}

export default Account;

