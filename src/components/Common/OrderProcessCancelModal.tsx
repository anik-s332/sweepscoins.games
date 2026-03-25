// @ts-nocheck
/* eslint-disable */
import React from "react";
import { Button, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from '@/lib/router';
import { SelectMultiPosters, cardDetailsGet, customerDetailsGet, OrderIsInProcessModalStateFct } from "../../redux/actions";
import { PACKAGES } from "../Shared/constant";
import CloseIcon from "../../assets/img/close_mark.png";

const OrderProcessCancelModal = (props) => {
    const { setDontWorryModal, DontWorryModal } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const CartClearStore = () => {
        setDontWorryModal({
            ...DontWorryModal,
            open: false,
            flag: "",
        });
        dispatch(SelectMultiPosters({cart: 1,amount: 3.99}));
        dispatch(cardDetailsGet({}));
        dispatch(customerDetailsGet({}));
        dispatch(OrderIsInProcessModalStateFct({
            open: false,
            iframe: "",
        }));
        navigate(PACKAGES);
    };

    // close modal
    const clsoeModal = () => {
        setDontWorryModal({
            ...DontWorryModal,
            open: false,
            flag: "",
        });
    };

    return(<div className="modal_close_wrapper">
        {DontWorryModal?.flag === "" && (<Image src={CloseIcon} className="close_icons" onClick={() => clsoeModal()} alt="close" />)}
        <h4>Your transaction is currently being processed.</h4>
        <p>If you've already sent the funds, don't worry you'll receive an email confirmation once we receive them. Please note that crypto transactions may take some time to confirm on the blockchain. If you have any questions or need more information, please contact our support team.</p>
        <Button onClick={() => CartClearStore()}>Close</Button>
    </div>)
}

export default OrderProcessCancelModal;