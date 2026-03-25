// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from '@/lib/router';
import ClockIcon from "../../assets/img/alarm-clock.png";
import CloseIcon from "../../assets/img/close_mark.png";

const OrderInProcessModal = (props) => {
    const { DontWorryModal, setDontWorryModal } = props;
    const dispatch = useDispatch();
    const { OrderIsInPrcessModalState } = useSelector((state) => state.allReducers);
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(300); // 300 seconds = 5 minutes
    const [isActive, setIsActive] = useState(false);

    const CartClearStore = (url) => {
        if(url === "time_close") {
            setDontWorryModal({
                ...DontWorryModal,
                open: true,
                flag: "time_close",
            });
        } else {
            setDontWorryModal({
                ...DontWorryModal,
                open: true,
                flag: "",
            });
        };
    };

    const iframeRef = useRef(null);

    const handlePaymentSuccess = () => {
    };

    const handleIframeLoad = () => {
        setIsActive(true);
    };

    const handleIframeError = () => {
        console.error('Iframe load error');
    };

    const handleMessage = (event) => {
        const message = event.data;
      
        if (message === 'paymentSuccess') {
          handlePaymentSuccess();
        }
    };
      
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
        interval = setInterval(() => {
            setSeconds(seconds => seconds - 1);
        }, 1000);
        } else if (!isActive && seconds !== 0) {
        clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        if(formatTime(seconds) === "0:00") {
            CartClearStore("time_close");
        };
    }, [ formatTime(seconds) ]);


    return(<div className="successModalwraps successpymentwrapper_transaction_modal">
        <div className="successpymentwrapper successpymentwrapper_transaction">
            <Image src={CloseIcon} className="close_icons" onClick={() => CartClearStore()} alt="close" />
            <iframe 
                id="rocketFuelIframe" 
                ref={iframeRef}
                title="Rocketfuel Payment"
                src={OrderIsInPrcessModalState?.iframe}
                frameBorder="0"
                allowtransparency="true"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
            />
            <div className="timer_modal_tranc">
                <Image src={ClockIcon} alt="clock" />
                {formatTime(seconds)}
            </div>
        </div>
    </div>)
}

export default OrderInProcessModal;