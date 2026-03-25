// @ts-nocheck
/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from '@/lib/router';
import { toast } from "react-toastify";
import { images } from "@/content";
import DebitCardImage from "../../assets/img/dd.png";
import CrptoImage from "../../assets/img/payment/Crypto.png";
import TierlockImage from "../../assets/img/payment/tierlock-logo.png";
import SecureImage from "../../assets/img/secure.webp";
import { checkLogin, customerDetailsGet, getAccessToken, getUser } from "../../redux/actions";
import { HOME_URL, PLACE_PRODUCT_ORDER_API_URL } from "../Shared/constant";
import AppImage from "./AppImage";
import Popup from "./CheckoutModal/Popup";
import CoinFlowContnet from "./SolanaPayment/Coinflow";

const PaymentMethedModal = (props) => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const { email,PaymentMethodModalState, SubmitPaymentMethod, setTypePayment, callSelectMethod, setStepUpdate, minimunamounterror, SuccessPopup, setSuccessPopup, show, setShow } = props; 
    const { UniqueBrowserId, profiledata, accessToken, customerDetail } = useSelector((state) => state.allReducers);
    
    const SubmitPaymentFct = (url) => {
            setTypePayment(url);
        if(props?.TypePayment == url && url === "cash_app"){
            return null;
        }
        SubmitPaymentMethod(url);
    };

    const handleClose = () => {
        localStorage.removeItem('walletName');
        setShow(false); 
    };

  

    const selectedProduct = props?.selectedProduct;
    const PaymentContinueStepGeo = async (payment_url) => {
        dispatch(customerDetailsGet({}));
        document.getElementById("pageisLoading").style.display = "none";
        document.getElementById("checkoutflag")?.classList?.remove("active");
        const jsonData = JSON.stringify({ 
            "first_name" : profiledata?.first_name, 
            "last_name" : profiledata?.last_name, 
            "email" :  profiledata?.email.toLowerCase(), 
            "phone" : profiledata?.phone,
            "cart" : selectedProduct.id,
            "total_amount": parseInt(selectedProduct.price * 100),
            "street_address": profiledata?.kyc_verified ?  profiledata?.address?.street_address :address?.street1,
            "billing_address":profiledata?.kyc_verified ? profiledata?.address?.billing_address :address?.street2,
            "country": profiledata?.address?.country,
            "city":profiledata?.kyc_verified  ?  profiledata?.address?.city : SelectCity,
            "state":profiledata?.kyc_verified ?  profiledata?.address?.state :selectedOption?.value,
            "zipcode":profiledata?.kyc_verified ? profiledata?.address?.zipcode :address?.zip
        });
        const response = await window.axios.post(PLACE_PRODUCT_ORDER_API_URL, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(async function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            setShow(true)
            dispatch(customerDetailsGet(result?.data?.data));
            localStorage.setItem("order_place", JSON.stringify(result?.data?.data))
        }).catch(function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            dispatch(customerDetailsGet({}));
            toast.error(result.response.data.error);
            if(result?.response?.data?.detail === "Token expired.") {
                AccessTokenCheckLogout();
            };
        });
    };

    const AccessTokenCheckLogout = () => {
        setTimeout(() =>  Navigate(HOME_URL), 200);
        localStorage.removeItem("accessToken");
        dispatch(getAccessToken(""));
        dispatch(checkLogin("no"));
        dispatch(getUser(""));
    };

    return(
    <>
    <div className="payment_method_wrapper">
        <h4>{PaymentMethodModalState?.title}</h4>
        <div className="payment_wrapper">
            <ul>
                <li onClick={() => SubmitPaymentFct("tierlock")}>
                    <AppImage src={images.checkout.tierlockLogo} style={{ width: "110px" }} alt="CrptoImage" width={110} height={36} />
                    Tierlock
                    <span className="payment_name_class">(Trusted Security)</span>
                </li>
            </ul>
            <ul>

            </ul>
        </div>
        {
            minimunamounterror &&(
            <p className="payment_msg_error">
            {minimunamounterror}
            </p>
            )
        }

        <AppImage src={images.checkout.secure} className="secureimage" alt="SecureImage" width={180} height={50} />
    </div>
    {show&&(<Popup isOpen={show} onClose={handleClose}>
        <CoinFlowContnet 
            isOpen={show}
            email={email} 
            selectedProduct={props?.selectedProduct} 
            handleClose={handleClose}
            SuccessPopup={SuccessPopup} 
            setSuccessPopup={setSuccessPopup}
        />
    </Popup>)}
    </>

    )
}
export default PaymentMethedModal;
