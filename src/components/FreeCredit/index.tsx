// @ts-nocheck
/* eslint-disable */
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from '@/lib/router';
import { toast } from "react-toastify";
import { content, images } from "@/content";
import AppImage from "../Common/AppImage";
import { setStoreCouponPackage } from "../../redux/actions";
import GetRequest from "../Common/GetRequest";
import PostRequestAPI from "../Common/PostRequest";
import { GET_CREDIT_COUPON, POST_PLACE_ORDER_COUPON } from "../Shared/constant";

const FreeCredit = (props) => {
    const navigate = useNavigate();
    const { setLoginSigupUp } = props;
    const dispatch = useDispatch();
    const { CouponPackage, accessToken } = useSelector((state) => state.allReducers);
    const freeCreditContent = content.freeCredit;
    const [loader, setLoader] = useState(false)
    const params = useParams();

    useEffect(()=>{
        if(params?.free_credit){
            var urlString = params?.free_credit;
            var couponPackage = urlString.split('/').pop().split('-').slice(-1)[0];
            callGetCouponPackage(couponPackage.toLocaleUpperCase())
        }else{
            return navigate("/")
        }
    },[params?.free_credit])

    const callGetCouponPackage =async (id) =>{
        const response = await GetRequest(`${GET_CREDIT_COUPON}/${id}`, accessToken);
        if(response?.status === 200){
            dispatch(setStoreCouponPackage(response?.data?.data))
        }else{
            dispatch(setStoreCouponPackage(null));
            navigate("/home")
        }
    }
    function callAPI() {
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
          .catch(() => {
             return ""
          });
          return data
    };
    const callSubmitForm = async (e) =>{
        e.preventDefault();
        if(accessToken){
            setLoader(true)

            if(document.getElementById("pageisLoading")){
                document.getElementById("pageisLoading").style.display = "flex";
            }
            var urlString = params?.free_credit;
            var couponPackage = urlString.split('/').pop().split('-').slice(-1)[0];
            const IP = await callAPI();
            const payload = {
                promo_code: couponPackage.toLocaleUpperCase(),
                ipaddress: IP
            }
            const response = await PostRequestAPI(POST_PLACE_ORDER_COUPON, payload, accessToken);
            if(response?.status == 200){
                toast.success(response?.data?.msg);
                dispatch(setStoreCouponPackage(null));
                navigate("/")
            }else if(response?.status === 401){
                if( typeof response?.data?.error == "string"){
                    toast.warning(response?.data?.error)
                }
            }else{
                if( typeof response?.data?.error == "string"){
                    toast.error(response?.data?.error)
                }
            }
            if(document.getElementById("pageisLoading")){
                document.getElementById("pageisLoading").style.display = "none";
            }
            setLoader(false)
        }else{
            setLoginSigupUp(true);
        }
    }
    const PaymentDetails = (props) =>{
        return(
            <div className="container">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="checkoulistwrps" >
                                <h2>{freeCreditContent.creditPrefix}{CouponPackage?.sweep_coins}</h2>
                                <div className="checkoutlistwrapper">
                                    <div className="checkoutlist">
                                        {CouponPackage?.package_image_path === null ? <AppImage src={images.common.defaultProduct} alt="image" width={120} height={120} /> : <AppImage src={CouponPackage?.package_image_path} alt="image" width={120} height={120} />}
                                        <h5>{CouponPackage?.name}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {props?.children}

                    </div>
                </div>
            </div>
        )
    }

    return(
        <section className="checkoutsection">
            <PaymentDetails>
                <div className="col-md-6">
                    <div className="checkoutpaymnt">
                        <h1>{freeCreditContent.pageTitle}</h1>
                        <h2>{freeCreditContent.creditPrefix}{CouponPackage?.sweep_coins}</h2>
                        <Button onClick={callSubmitForm} disabled={loader} className="btn clickpaymnt" >{freeCreditContent.submitButton}</Button>
                    </div>
                </div>
            </PaymentDetails>
    </section>)
};

export default FreeCredit;
