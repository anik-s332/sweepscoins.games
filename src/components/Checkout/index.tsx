// @ts-nocheck
/* eslint-disable */
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from '@/lib/router';
import { content, images } from "@/content";
import AppImage from "../Common/AppImage";
import CheckoutModal from "../Common/CheckoutModal";
import SuccessModal from "../Common/SuccessModal";
import { CHECK_OUT_PACKAGE } from "../Shared/constant";

const Checkout = (props) => {
    const navigate = useNavigate();
    const { setLoginSigupUp, order_id } = props;
    const { selectedPosters, accessToken, is_login } = useSelector((state) => state.allReducers);
    const checkoutContent = content.checkout;

    const [ checkoutPoup, setCheckoutPoup ] = useState({
        open: false,
        title: "",
    });
    const [ SuccessPopup, setSuccessPopup ] = useState({
        open: false,
        title: ""
    })
    useLocation();
    useParams();

    useEffect(()=>{
        if(order_id == selectedPosters?.id){
            CheckoutPaymentModal()
        }
    },[order_id == selectedPosters?.id])
    const CheckoutPaymentModal = () => {
        if(accessToken === "" && is_login === "no") {
            setLoginSigupUp(true);
        } else {
            setCheckoutPoup({...checkoutPoup, open: !checkoutPoup?.open, title: "Checkout"});
        }
    };

    const callCheckoutPayment = () => {
        if(accessToken === "" && is_login === "no") {
            setLoginSigupUp(true);
        } else {
            navigate(`${CHECK_OUT_PACKAGE}/${selectedPosters?.id}`, {state: selectedPosters})
        }
    };

    const PaymentDetails = (props) =>{
        return(
            <div className="container">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="checkoulistwrps" >
                                <h2>{checkoutContent.pricePrefix}{Number(selectedPosters?.price).toLocaleString()}</h2>
                                <div className="checkoutlistwrapper">
                                    <div className="checkoutlist">
                                        {selectedPosters?.package_image_path === null
                                          ? <AppImage src={images.common.defaultProduct} alt="image" width={120} height={120} />
                                          : <AppImage src={selectedPosters?.package_image_path} alt="image" width={120} height={120} />}
                                        <h5>{selectedPosters?.name}</h5>
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

    if(order_id == selectedPosters?.id){
        return(
        <section className="checkoutsection checkout-payment pt-sm-5 pt-4">
            <div className="container">
                <div className="col-md-12">
                    <div className="row d-flex">
                        <div className="col-md-6 mx-auto">
                            <CheckoutModal modalState={false} selectedProduct={selectedPosters} SuccessPopup={SuccessPopup} setSuccessPopup={setSuccessPopup} checkoutPoup={checkoutPoup} setCheckoutPoup={setCheckoutPoup}  />
                            {SuccessPopup?.open && (<SuccessModal SuccessPopup={SuccessPopup} setSuccessPopup={setSuccessPopup} />)}
                            {(SuccessPopup?.open) && (<div className="ModalBackground"></div>)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        )
    }

    return(
        <section className="checkoutsection">
            <PaymentDetails>
                <div className="col-md-6">
                    <div className="checkoutpaymnt">
                        <h1 style={{ marginBottom: "15px" }}>{checkoutContent.pageTitle}</h1>
                        <div className="price_summary_wrapper">
                            <h4>{checkoutContent.summaryTitle}</h4>
                            <ul className="order_details_sections">
                                <li><span>{checkoutContent.priceLabel}:</span> ${Number(selectedPosters.price)?.toLocaleString()}</li>
                                <li><span>{checkoutContent.feeLabel}:</span> ${selectedPosters?.tierlock_fee || 0}</li>
                                <li><span>{checkoutContent.totalLabel}:</span> ${parseFloat(selectedPosters.price) + parseFloat(selectedPosters?.tierlock_fee || 0)}</li>
                            </ul>
                        </div>

                        {selectedPosters?.sweep_coins && (<h4 className="credits_scrore">{checkoutContent.creditsPrefix} {selectedPosters?.sweep_coins} {checkoutContent.creditsSuffix}</h4>)}

                        <Button className="btn clickpaymnt right-Icon" onClick={callCheckoutPayment}>{checkoutContent.completeButton} <AppImage src={images.checkout.rightArrow} alt="arrow" width={18} height={18} /></Button>
                        <AppImage src={images.checkout.secure} className="secureimage" alt="SecureImage" width={180} height={50} />
                    </div>
                </div>
            </PaymentDetails>
        {checkoutPoup?.open && (<CheckoutModal modalState={false} selectedProduct={selectedPosters} SuccessPopup={SuccessPopup} setSuccessPopup={setSuccessPopup} checkoutPoup={checkoutPoup} setCheckoutPoup={setCheckoutPoup}  />)}
        {SuccessPopup?.open && (<SuccessModal SuccessPopup={SuccessPopup} setSuccessPopup={setSuccessPopup} />)}
        {(checkoutPoup?.open || SuccessPopup?.open) && (<div className="ModalBackground"></div>)}
    </section>)
};

export default Checkout;
