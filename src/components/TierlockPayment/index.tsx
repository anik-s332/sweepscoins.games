// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from '@/lib/router';
import { toast } from 'react-toastify';
import { PAYMENT_PLACE_ORDER_API_URL, HOME_URL } from '../Shared/constant';
import sound from "../../assets/audio/apple_pay_sound.wav";
import { useSelector, useDispatch } from 'react-redux';
import {
  cardDetailsGet,
  customerDetailsGet,
  getAccessToken,
  checkLogin,
  getUser
} from '../../redux/actions';
import SuccessModal from '../Common/SuccessModal';
import { Spinner } from 'react-bootstrap';

export default function TierlockPayment() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const audioRef = useRef(new Audio(sound));

  const { accessToken } = useSelector((state) => state.allReducers);

  const [successPopup, setSuccessPopup] = useState({
    open: false,
    title: "",
  });

  const searchParams = new URLSearchParams(location.search);

  const paymentData = {
    transactionId: searchParams.get('transaction_id'),
    status: searchParams.get('status'),
    orderId: searchParams.get('order_id'),
    amount: searchParams.get('amount'),
    type: searchParams.get('payment_type'),
    statusCode: searchParams.get('status_code'),
  };

  // ----------------------------
  // Check payment status on mount
  // ----------------------------
  useEffect(() => {
    document.getElementById("pageisLoading").style.display = "flex";
    if (paymentData.status === "SUCCESS") {
      callPaymentCompleteCashApp(paymentData);
    } else {
      // toast.error("Payment Failed");
      callPaymentCompleteCashApp(paymentData);
      document.getElementById("pageisLoading").style.display = "none";
      setTimeout(() => navigate(HOME_URL), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------
  // API call to mark payment complete
  // ----------------------------
  const callPaymentCompleteCashApp = async (data) => {
    const payload = {
      payment_type: 'tierlock',
      order_id: data.orderId,
      amount: data.amount,
      transaction_id: data.transactionId,
    };

    window.axios
      .post(PAYMENT_PLACE_ORDER_API_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((result) => {
        // Show success modal
        setTimeout(() => {
            setSuccessPopup({...successPopup, open: true, title: "Thank you for the payment!", amount: result?.data?.data?.amount});
        }, 200);

        // Play audio immediately
        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.warn("Audio playback blocked by browser:", err);
          });
        }

        document.getElementById("pageisLoading").style.display = "none";
        document.getElementById("pageisLoadingnew").style.display = "none";

        // Update Redux state
        dispatch(cardDetailsGet(result.data.data));
        dispatch(
          customerDetailsGet({
            ...result?.data?.data,
            total_amount: result?.data?.data?.amount,
          })
        );

        toast.success(result.data.msg);
        closeCheckoutModal();
      })
      .catch((error) => {
        document.getElementById("pageisLoading").style.display = "none";
        toast.error(error?.response?.data?.error || "Something went wrong");

        if (error?.response?.data?.detail === "Token expired.") {
          accessTokenCheckLogout();
        }

        setTimeout(() => navigate(HOME_URL), 200);
      });
  };

  // ----------------------------
  // Helper functions
  // ----------------------------
  const closeCheckoutModal = () => {
    document.getElementById("flagsDropdownid")?.classList?.remove("active");
    document.getElementById("checkoutflag")?.classList?.remove("active");
    setSuccessPopup({ ...successPopup, open: false });
  };

  const accessTokenCheckLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(getAccessToken(""));
    dispatch(checkLogin("no"));
    dispatch(getUser(""));
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="checkoutsection checkout-payment pt-sm-5 pt-4">
      <h4
        className="fw-bold mb-0 text-center pt-sm-5 pt-4"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "22px",
          flexDirection: "column",
        }}
      >
        <Spinner
          animation="border"
          className="border-4"
          variant="dark"
          style={{ height: 50, width: 50 }}
        />
        Please wait, payment request is being processed
      </h4>

      {successPopup?.open && (<SuccessModal SuccessPopup={successPopup} setSuccessPopup={setSuccessPopup} />)}
      {successPopup?.open && (<div className="ModalBackground"></div>)}
    </div>
  );
}
