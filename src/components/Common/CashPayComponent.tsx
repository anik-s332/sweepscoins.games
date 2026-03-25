// @ts-nocheck
/* eslint-disable */
import PropTypes from "prop-types";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.head.appendChild(script);
  });
};
const CashPayComponent = (props) => {
  const UUID = uuidv4()
  const dispatch = useDispatch();
  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_APP_LOCATION_ID;
  let cashAppPayInstance; // Define a variable to hold the Cash App Pay instance

  const buildPaymentRequest = async (payments) => {
    const getID = await props?.PaymentContinueStepGeo("cash_app");
    const paymentRequest = payments.paymentRequest({
      countryCode: 'US',
      currencyCode: 'USD',
      total: {
        amount: parseFloat(props?.amount).toFixed(),
        label: 'Total',
      },
    });
    return {paymentRequest: paymentRequest, orderDetails: getID};
  };

  const initializeCashApp = async (payments) => {
    document.getElementById("pageisLoading").style.display = "flex";
    const { paymentRequest, orderDetails } = await buildPaymentRequest(payments);
    const cashAppPay = await payments.cashAppPay(paymentRequest, {
      redirectURL: `${window.location.href}/${orderDetails?.id}`,
      referenceId: UUID,
    });
    const buttonOptions = {
      shape: 'semiround',
      width: 'full',
    };
    await cashAppPay.attach('#cash-app-pay', buttonOptions);
    setTimeout(()=>document.getElementById("pageisLoading").style.display = "none", [500])
    return cashAppPay;
  };

  const createPayment = async (token) => {
    const body = JSON.stringify({
      locationId,
      sourceId: token,
      idempotencyKey: window.crypto.randomUUID(),
    });
    await dispatch(await props?.callBackInitPayment(body))
  };

  const displayPaymentResults = (status) => {
    const statusContainer = document.getElementById('payment-status-container');
    if (status === 'SUCCESS') {
      statusContainer.classList.remove('is-failure');
      statusContainer.classList.add('is-success');
    } else {
      statusContainer.classList.remove('is-success');
      statusContainer.classList.add('is-failure');
    }

    statusContainer.style.visibility = 'visible';
  };

  useEffect(() => {
    const initializeSquarePayment = async () => {
      try {
        const isScriptLoaded = await loadScript(process.env.NEXT_PUBLIC_SQUARE_CDN_URL);
        if (!isScriptLoaded) {
          throw new Error('Square.js failed to load');
        }
        initializePayment();
      } catch (error) {
        console.error('Error loading or initializing Square.js:', error);
        toast.error('Failed to load payment script. Please try again later.');
      }
    };
  
    initializeSquarePayment();
  
    return () => {
      if (cashAppPayInstance) {
        cashAppPayInstance.destroy();
      }
    };
  }, []);
  
  const initializePayment = async () => {
    try {
      if (!window.Square) {
        throw new Error('Square.js is not loaded');
      }
      const payments = window.Square.payments(appId, locationId);
      if (cashAppPayInstance) {
        cashAppPayInstance.destroy();
      }
      cashAppPayInstance = await initializeCashApp(payments);
      cashAppPayInstance.addEventListener('ontokenization', async function ({ detail }) {
        const tokenResult = detail.tokenResult;
        if (tokenResult.status === 'OK') {
          const paymentResults = await createPayment(tokenResult.token);
          displayPaymentResults('SUCCESS');
          console.debug('Payment Success', paymentResults);
        } else {
          let errorMessage = `${tokenResult.status}`;
          if (tokenResult.errors) {
            errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
          }
          displayPaymentResults('FAILURE');
          if (cashAppPayInstance) {
            cashAppPayInstance.destroy();
          }
          toast.error(`Your Payment ${errorMessage}`);
          initializePayment(); // Retry on failure
        }
      });
    } catch (error) {
      console.error('Error initializing payment:', error);
    }
  };



  return (
    <div>
      <form id="payment-form">
        <h2 hidden>Pay ${props?.amount}</h2>
        <div id="cash-app-pay"></div>
      </form>
      <div hidden id="payment-status-container"></div>
    </div>
  );
};
CashPayComponent.propTypes = {
    amount: PropTypes.any,
    callBackInitPayment: PropTypes.func,
}
CashPayComponent.defaultProps = {
    callBackInitPayment: ()=>{},
}

export default CashPayComponent;
