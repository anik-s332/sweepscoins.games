// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { COIN_FLOW_PAYMENT_API_URL, PACKAGES, GET_COIN_FLOW_ORDER_API_URL, GET_COIN_FLOW_PAYMENT_LINK_API_URL } from "../../Shared/constant";
import { getAccessToken, checkLogin, getUser, cardDetailsGet, customerDetailsGet } from "../../../redux/actions";
import { toast } from "react-toastify";
import { images } from "@/content";
import { useHeight } from "./useHeight";
import { Spinner } from "react-bootstrap";
import ClockIcon from "../../../assets/img/alarm-clock.png";
import AppImage from "../AppImage";
import { useNavigate } from '@/lib/router';
import useTimer from "../Timer";
import { useNetworkState } from "react-use";

function CoinflowContentMain(props) {
  const { email, selectedProduct, handleClose, SuccessPopup, setSuccessPopup, accessToken, customerDetail, onStopFuct, setIsPaymentApiCalled } = props;
  const { height } = useHeight();
  const [ getLink, setgetLink ] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    CreateCheckoutLink();
  }, [ selectedProduct ])

  const CreateCheckoutLink = async () => {
      if(selectedProduct?.price !== undefined) {
          const jsonData = JSON.stringify({ 
              subtotal: Math.floor(Number(selectedProduct?.price) * 100),
              chargeback_protection_data: [
                {
                  "productType": "gameOfSkill",
                  "productName": selectedProduct?.name,
                  "quantity": 1,
                  "rawProductData": {
                    "productID": selectedProduct?.id,
                    "productDescription": selectedProduct?.title,
                    "productCategory": "",
                    "weight": "",
                    "dimensions": "",
                    "origin": "",
                    "craftedBy": "",
                    "craftingDate": ""
                  }
                }
              ],
              theme: {
                style: "rounded",
                background: "#fdf3f3",
                primary: "#A32B29",
                backgroundAccent: "#fbe5e5",
                backgroundAccent2: "#f9d0cf",
                textColor: "#3f1110",
                textColorAccent: "#762726",
                textColorAction: "#fdf3f3"
              },
              order_id : customerDetail?.id,
              x_device_id : window.x_device_id,
              allowedPaymentMethods: ["crypto"],
          });
          await window.axios.post(GET_COIN_FLOW_PAYMENT_LINK_API_URL, jsonData, {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + accessToken,
              }
          }).then(async function (result) {
              setgetLink(result?.data?.data?.link);
          }).catch(function (result) {
              handleClose();
              dispatch(cardDetailsGet({}));
              dispatch(customerDetailsGet({}));
              toast.error(result.response.data.error);
              if(result?.response?.data?.detail === "Token expired.") {
                  AccessTokenCheckLogout();
              };
          });
      }
  };

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

  // final payment api calling
  const FinalPaymentApiCalling = async (payment_details) => {
      setIsPaymentApiCalled(true);
      const Ip = await callAPI();
      if(Ip) {
          const jsonData = JSON.stringify({ 
              "payment_id" : payment_details?.info?.paymentId, 
              "payment_type" : "coinflow", 
              "coupon_code" :  "", 
              "order_id" : customerDetail?.id,
              "amount" : customerDetail?.total_amount,
              "ipaddress": Ip,
          });
          window.axios.post(COIN_FLOW_PAYMENT_API_URL, jsonData, {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + accessToken,
              }
          }).then(function (result) {
              setIsPaymentApiCalled(true);
              onStopFuct();
              handleClose();
              setgetLink("");
              toast.success(result.data.msg);
              dispatch(cardDetailsGet(result.data.data));
              setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});
              document.getElementById("pageisLoading").style.display = "none";
          }).catch(function (result) {
              setIsPaymentApiCalled(false);
              // dispatch(cardDetailsGet({}));
              // dispatch(customerDetailsGet({}));
              document.getElementById("pageisLoading").style.display = "none";
              toast.error(result?.response?.data?.error);
              if(result?.response?.data?.detail === "Token expired.") {
                  AccessTokenCheckLogout();
              };
          });
      };
  };

  // if accessToken expire then page will logut and redirect to home page 
  const AccessTokenCheckLogout = () => {
      localStorage.removeItem("accessToken");
      dispatch(getAccessToken(""));
      dispatch(checkLogin("no"));
      dispatch(getUser(""));
      setgetLink("");
  };

  return (<>
    <div className={"w-full sm:w-3/4 md:w-1/2 pr-0 lg:pr-[12%] pt-12"}>
      <div
        className={
          "w-full sm:px-[2%] lg:px-[5%] mt-20 sm:mt-10 sm:mb-10 overflow-auto sm:pt-0"
        }
      >
        <div
          className={
            "h-full rounded-t-xl sm:rounded-xl overflow-auto sm:overflow-hidden"
          }
        >
          {getLink !== "" ? (<iframe
            style={{ width: "100%", height: `${height}px` }}
            src={getLink}
            ref={iframe => {
              // Attach the event listener only once
              if (iframe && !window._coinflowMessageListenerAdded) {
                window._coinflowMessageListenerAdded = true;
                window.addEventListener('message', event => {
                  if (typeof event.data === 'string') {
                    try {
                      const data = JSON.parse(event.data);
                      if (data.data === 'success') {
                        FinalPaymentApiCalling(data);
                      };
                    } catch (e) {
                      // Ignore non-JSON messages
                    }
                  }
                });
              }
            }}
          ></iframe>) : (<div className='crad_loding_ui'>
            <Spinner />
            Please wait. card is loading....
          </div>)}
        </div>
      </div>
    </div>
  </>);
}


function CoinFlowContnet(props) {
  const dispatch = useDispatch();
  const { accessToken, customerDetail } = useSelector((state) => state.allReducers);
  const {isOpen, email, selectedProduct, handleClose, SuccessPopup, setSuccessPopup} = props;
  const Navigate = useNavigate();
  const [start, setStart] = useState(false);
  const [restart, setRestart] = useState(false);
  const [stop, setStop] = useState(false);
  const networkState = useNetworkState();
  const checkInternatedisconnected = useRef(false);
  const [ isPaymentApiCalled, setIsPaymentApiCalled ] = useState(false);
  const { timeLeft, status } = useTimer({
      duration: 180, // 3 minutes
      start,
      restart,
      stop,
      onStart: () => console.log("Started"),
      onEnd: () => console.log("Ended"),
      onStop: () => console.log("Stoped"),
  });

  useEffect(() => {
    if(isOpen){
      setStart(true);
    }
  }, [ isOpen ]);

  const onStopFuct = () => {
      setStop(true);
      setRestart(false);
      setStart(false);
  };

  useEffect(() => {
      if(!networkState?.online) {
        checkInternatedisconnected.current = true;
      };
  }, [ networkState?.online ]);

  useEffect(() => {
      if(status === "ended") {
          CheckingOrderStatus();
          setRestart(false);
      };
  }, [ status, networkState?.online ]);

  useEffect(() => {
    if(networkState?.online && checkInternatedisconnected?.current){
      CheckingOrderStatus();
    };
  }, [ checkInternatedisconnected, networkState?.online ]);

  const CheckingOrderStatus = async () => {
    if(!isPaymentApiCalled) {
      const jsonData = JSON.stringify({ 
          "order_id" : customerDetail?.id,
      });
      window.axios.post(GET_COIN_FLOW_ORDER_API_URL, jsonData, {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
          }
      }).then(function (result) {
          if(result?.data?.data?.is_paid === true) {
              handleClose();
              dispatch(cardDetailsGet(result.data.data));
              toast.success(result.data.msg);
              setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});
              document.getElementById("pageisLoading").style.display = "none";
              checkInternatedisconnected.current = false;
          } else if(result?.data?.data?.is_paid === false) {
              toast.error("Your payment was declined. Please try again or contact your administrator for assistance.");
              FailRedirect();
              checkInternatedisconnected.current = false;
          } else {
            checkInternatedisconnected.current = false;
            setRestart(true);
          };
      }).catch(function (result) {
        if(navigator.onLine) {
            dispatch(cardDetailsGet({}));
            dispatch(customerDetailsGet({}));
            document.getElementById("pageisLoading").style.display = "none";
            toast.error(result?.response?.data?.error);
            if(result?.response?.data?.detail === "Token expired.") {
                AccessTokenCheckLogout();
            };
        } else {
          
        }
      });
    }
  };

  // if accessToken expire then page will logut and redirect to home page 
  const AccessTokenCheckLogout = () => {
      localStorage.removeItem("accessToken");
      dispatch(getAccessToken(""));
      dispatch(checkLogin("no"));
      dispatch(getUser(""));
  };

  const FailRedirect = () =>{
      handleClose();
      Navigate(PACKAGES),
      dispatch(cardDetailsGet({})),
      dispatch(customerDetailsGet({}))
  };

  return (
    <React.Fragment>
      <h4>
        Crypto Payment
        <div className="timer_modal_main">
            <AppImage src={images.common.alarmClock} alt="clock" width={18} height={18} />
            Estimated time: {timeLeft} sec left
        </div>
      </h4>
      <div style={{overflow: "auto"}}>
          <CoinflowContentMain
            email={email} 
            selectedProduct={selectedProduct} 
            handleClose={handleClose} 
            SuccessPopup={SuccessPopup}
            setSuccessPopup={setSuccessPopup}
            accessToken={accessToken} 
            customerDetail={customerDetail}
            onStopFuct={onStopFuct}
            setIsPaymentApiCalled={setIsPaymentApiCalled}
          />
      </div>
     </React.Fragment>
  );
}

export default CoinFlowContnet;
