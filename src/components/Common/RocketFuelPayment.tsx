// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useState } from 'react';

const RocketFuelPayment = (props) => {
    const { rocketFuelOptions, setRocketFuelOptions } = props;
    const [sdkLoaded, setSdkLoaded] = useState(false);

    const currentHostDomain = new URL(window.location.href).origin;

    const updateOrder = async (result) => {
        let status = "pending";
        let result_status = parseInt(result.status);
        switch (result_status) {
            case 101:
                status = "partial-payment";
                break;
            case 1:
                status = "completed";
                break;
            default:
                status = "failed";
                break;
        }
        const url = 'ENDPOINT_TO_UPDATE_WEBFLOW_ORDER';
        const options = {
            method: 'POST',
            body: JSON.stringify({
                "status": status,
                "order_id": rocketFuelOptions.order.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            // Handle response if needed
        } catch (error) {
            console.error('Error updating order:', error);
            // Handle error
        }
    };

    const getUUID = async () => {
        let body = getCartFunctionData();
        let url = rocketFuelOptions?.data?.result?.uuid;
        const options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            let result = await response.json();
            return result.uuid;
        } catch (error) {
            console.error('Error fetching UUID:', error);
            throw error; // Propagate error
        }
    };

    const start = async () => {
        let csrf = document.cookie.split('csrf=')[1].split(';')[0];

        let apolloEndpoint = `${currentHostDomain}/.wf_graphql/apollo`;
        const requestOptions = {
            method: "POST",
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-wf-csrf': csrf,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                operationName: 'Dynamo2',
                variables: {},
                query: 'query Dynamo2 { database { id commerceOrder { availableShippingMethods { description id mode name price { value unit decimalValue string } selected } comment customData { checkbox name textArea textInput } customerInfo { identity { email fullName } } extraItems { name pluginId pluginName price { value unit decimalValue string } } id paymentProcessor startedOn statusFlags { billingAddressRequiresPostalCode hasDownloads hasSubscription isFreeOrder needAddress needIdentity needItems needPayment requiresShipping shippingAddressRequiresPostalCode shouldRecalc } subtotal { value unit decimalValue string } total { value unit decimalValue string } updatedOn userItems { count rowTotal { value unit decimalValue string } sku { f__draft_0ht f__archived_0ht f_main_image_4dr { url file { size origFileName createdOn updatedOn mimeType width height variants { origFileName quality height width s3Url error size } } alt } f_sku_values_3dr { property { id } value { id } } value { id } } product { id f__draft_0ht f__archived_0ht f_name_ f_sku_properties_3dr { id name enum { id name slug } } } id } userItemsCount } } site { id commerce { businessAddress { country } defaultCountry defaultCurrency quickCheckoutEnabled } } }'
            }])
        };
        try {
            let response = await fetch(apolloEndpoint, requestOptions);
            let result = await response.json();
            setRocketFuelOptions(prevState => ({
                ...prevState,
                order: result[0].data.database.commerceOrder
            }));
        } catch (error) {
            console.error('Error starting payment:', error);
            // Handle error
        }
    };

    const getCartFunctionData = () => {
        let cart = rocketFuelOptions.order;
        let data = {
            'amount': rocketFuelOptions.order.price,
            'currency': 'USD',
            cart,
            order_id: rocketFuelOptions.order.id
        };
        return data;
    };

    const initializePayment = async () => {
        if (document.querySelector('#rocketfuel-payment-button').disabled) return;
        document.querySelector('#rocketfuel-payment-button').disabled = true;
        document.querySelector('#rocketfuel-payment-button').innerHTML = `<strong class="bold-text-2">Processing Payment...</strong>`;

        try {
            await start();
            let uuid = await getUUID();

            let rkfl = new window.RocketFuel({
                uuid: uuid,
                callback: updateOrder,
                environment: "prod"
            });

            let checkIframe = setInterval(() => {
                if (rkfl.iframeInfo.iframe) {
                    document.querySelector('#rocketfuel-payment-button').innerHTML = `<strong class="bold-text-2">Preparing window...</strong>`;
                    rkfl.initPayment();
                    clearInterval(checkIframe);
                }
            }, 500);

            setRocketFuelOptions(prevState => ({
                ...prevState,
                rkfl: rkfl
            }));

        } catch (error) {
            console.error('Payment initialization error:', error);
            document.querySelector('#rocketfuel-payment-button').disabled = false;
            document.querySelector('#rocketfuel-payment-button').innerHTML = `<strong class="bold-text-2">Error! Please reload</strong>`;
        }
    };

    useEffect(() => {
        initRocketfuelProcess();
    }, [ rocketFuelOptions ]);

    const initRocketfuelProcess = () => {
        if (document.querySelector('#rocketfuel-payment-button')) {
            const rkflSDK = document.createElement('script');
            rkflSDK.src = 'https://d3rpjm0wf8u2co.cloudfront.net/static/rkfl.js';
            rkflSDK.onload = () => {
                setSdkLoaded(true);
            };
            rkflSDK.onerror = () => {
                console.error('Failed to load RocketFuel SDK');
            };
            document.body.appendChild(rkflSDK);

            document.querySelector('#rocketfuel-payment-button').addEventListener('click', async () => {
                if (sdkLoaded) {
                    await initializePayment();
                } else {
                    console.error('RocketFuel SDK not loaded yet.');
                }
            });
        }
        rocketfuelWindowListener();
    };

    const rocketfuelWindowListener = () => {
        window.addEventListener('message', (event) => {
            switch (event.data.type) {
                case 'rocketfuel_iframe_close':
                    document.querySelector('#rocketfuel-payment-button').disabled = false;
                    document.querySelector('#rocketfuel-payment-button').innerHTML = `<strong class="bold-text-2">Resume Payment...</strong>`;
                    break;
                default:
                    break;
            }
        });
    };

    return (
        <div>
            <button id="rocketfuel-payment-button">Pay with RocketFuel</button>
        </div>
    );
};

export default RocketFuelPayment;
