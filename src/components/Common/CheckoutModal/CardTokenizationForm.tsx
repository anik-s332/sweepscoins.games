// @ts-nocheck
// /* eslint-disable use-isnan */
// /* eslint-disable no-unused-vars */
/* eslint-disable */
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CallLogoutUser, cardDetailsGet, customerDetailsGet } from '../../../redux/actions';
import { COIN_FLOW_PAYMENT_API_URL, GET_COIN_FLOW_PAYMENT_LINK_API_URL } from '../../Shared/constant';
import { useHeight } from "../SolanaPayment/useHeight";

const CardTokenizationForm = (props) => {
  const { selectedProduct, SuccessPopup, setSuccessPopup } = props;
  const dispatch = useDispatch();
  const { height } = useHeight();
  const [ getLink, setgetLink ] = useState("");
  const { accessToken, customerDetail } = useSelector((state) => state.allReducers);

  useEffect(() => {
    CreateCheckoutLink();
  }, []);

  // create card payment iframe link
  const CreateCheckoutLink = async () => {
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
          allowedPaymentMethods: ["card", "googlePay", "applePay"],
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
          toast.error(result.response.data.error);
          if(result?.response?.data?.detail === "Token expired.") {
              dispatch(CallLogoutUser());
              localStorage.removeItem("access_tokens");
          };
      });
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
      const Ip = await callAPI()
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
              dispatch(cardDetailsGet(result.data.data));
              toast.success(result.data.msg);
              setSuccessPopup({...SuccessPopup, open: true, title: "Thank you for the payment!"});
              document.getElementById("pageisLoading").style.display = "none";
          }).catch(function (result) {
              dispatch(cardDetailsGet({}));
              dispatch(customerDetailsGet({}));
              document.getElementById("pageisLoading").style.display = "none";
              toast.error(result?.response?.data?.error);
              if(result?.response?.data?.detail === "Token expired.") {
                  dispatch(CallLogoutUser());
                  localStorage.removeItem("access_tokens");
              };
          });
      };
  };


  return(<div className={"w-full sm:w-3/4 md:w-1/2 pr-0 lg:pr-[12%] pt-12"}>
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
    </div>)
}

export default CardTokenizationForm;