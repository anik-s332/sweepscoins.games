// @ts-nocheck
/* eslint-disable */
import { useEffect } from 'react';

const GooglePayComponent = () => {
  useEffect(()=>{
    
  },[])
  const PaymentIntentConfig = () =>{
    const paymentsClient2 = new google.payments.api.PaymentsClient({
      environment: 'TEST'
    });
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GA2TEWAY',
            parameters: {
                gateway: 'shift24',
                gatewayMerchantId: 'BCR2DN6TVPKLD5QV',
            },
          },
      }],
      merchantInfo: {
          merchantName: 'Example Merchant',
          merchantId: 'BCR2DN4TTWQLDI25', // Your merchant ID
      },
      transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: '10.00',
          currencyCode: 'USD',
          countryCode: 'US',
      },
    };
    paymentsClient2.loadPaymentData(paymentDataRequest)
    .then(paymentData => {
    })
    .catch(error => {
        console.error('Error', error);
    });
  }
  const onSubmit = (e) =>{
    e.preventDefault();
  }
  return (
    <form id="form-main-google" onSubmit={onSubmit} // action="/index.cfm?action=development.i4mDemo"
     method="post" class="form" role="form">
		<fieldset>
			<div class="pay-buttons">
				<button class="pay-button apple-pay-button pay-hidden"></button>
				<button class="pay-button google-pay-button pay-hidden"></button>
			</div>
		</fieldset>
    <button id="outside-submit" onClick={PaymentIntentConfig}>Submit</button>
    {/* <div id="i4goFrame" ></div> */}
    {window.myGlobalFunction("google_pay")}
    </form>
  );
};

export default GooglePayComponent;
