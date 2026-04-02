// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from '@/lib/router';
import sound from "../../assets/audio/apple_pay_sound.wav";
import { PACKAGES, USER_ORDER_STATUS_URL } from "../../components/Shared/constant";
import { content, images } from "@/content";
import AppImage from "../Common/AppImage";
import BannerSection from "./BannerSection";
const VideoModal = dynamic(() => import("../Common/VideoModal"));
const GamesGrid = dynamic(() => import("./GamesGrid"));

const Home = (props) => {
    const { accessToken } = useSelector((state) => state.allReducers);
    const homeContent = content.home;

    const [homepagepopup, setHomePagePopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [customerDetail, setCustomerDetail] = useState({});
    const [cardDetails, setCardDetails] = useState({});
    const [ videoModal, setVideoModal ] = useState({
        open: false,
        url: "",
    });
    const location = useLocation();
    const navigate = useNavigate();
    const { setLocationGet } = props;
    const searchParams = new URLSearchParams(location?.search);
    const action = searchParams.get('action');
    const order_Id = searchParams.get('order');
    const check_id = searchParams.get('check_id');
    const description_as_order_id = searchParams.get('description');

    useEffect(() => {
        if (action === 'CryptoPaymentStatus' && order_Id) {
            OrderStatusApiCall(order_Id);
        } else if (check_id &&  description_as_order_id) {
            OrderStatusApiCall(description_as_order_id);
        }
    }, [action, order_Id, check_id, description_as_order_id]);

    const OrderStatusApiCall = (order_Id) => {
        window.axios.get(`${USER_ORDER_STATUS_URL}/${order_Id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        })
        .then(function (result) {
            if (result?.data?.status === true) {
                setIsSuccess(true);
                setCustomerDetail(result.data);
                setCardDetails(result.data.transaction_id);
            } else if(result?.data?.status === null) {
                if(action === 'CryptoPaymentStatus'){
                    setPopupMessage(homeContent.pendingModal.cryptoMessage);
                }else{
                    setPopupMessage(homeContent.pendingModal.bankMessage);
                 }
                setIsSuccess(false);
            }else{
                setPopupMessage(homeContent.pendingModal.failureMessage);
                setIsSuccess(false);
            }
            setHomePagePopup(true);
        })
        .catch(function (error) {
            console.error("API call failed", error);
        });
    };

    useEffect(() => {
        if (homepagepopup && isSuccess) {
            const audio = new Audio(sound);
            audio.play().catch((error) => console.error("Audio play failed", error));
        }
    }, [homepagepopup, isSuccess]);

    useEffect(() => {
        if(location.pathname) {
            setLocationGet(location.pathname);
        }
    }, [ location, setLocationGet ]);

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

    const pendingHeading = popupMessage === homeContent.pendingModal.failureMessage
        ? homeContent.pendingModal.cancelHeading
        : homeContent.pendingModal.processingHeading;

    return(<React.Fragment>
        <BannerSection />
        <GamesGrid setVideoModal={setVideoModal} />
        {videoModal.open && (<VideoModal videoModal={videoModal} setVideoModal={setVideoModal} />)}
            {homepagepopup && (
                isSuccess ? (
                    <div className="successModalwraps" id="successPopup" >
                        <div className="successpymentwrapper">
                            <div className="succesiocn">
                                <AppImage src={images.home.successAnimation} alt="correct icon" width={120} height={120} />
                            </div>
                            <h4>{homeContent.successModal.heading}</h4>
                            <p>{homeContent.successModal.messagePrefix} <b>${(customerDetail?.total_amount || customerDetail?.amount) / 100}</b> <br />
                            {homeContent.successModal.messageMiddle} <b>{customerDetail?.email}</b></p>
                            <div className="tarnsitionId">
                                <span>{homeContent.successModal.transactionIdLabel}</span>: {cardDetails}
                            </div>
                            <div className="successpymentbutns">
                                <Link className="btn cancelbtn" to={PACKAGES}>{homeContent.successModal.pointsButton}</Link>
                                <Button className="savebtn" onClick={() => { setHomePagePopup(false); navigate("/"); }}>{homeContent.successModal.cancelButton}</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="modal_close_wrapper">
                        <h4>{pendingHeading}</h4>
                        <p>{popupMessage}</p>
                        <Button onClick={() => { setHomePagePopup(false); navigate("/"); }}>{homeContent.pendingModal.closeButton}</Button>
                    </div>
                )
            )}

            {(homepagepopup || isSuccess) && (<div className="ModalBackground"></div>)}
    </React.Fragment>);
}

export default Home;
