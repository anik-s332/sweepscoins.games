// @ts-nocheck
/* eslint-disable */
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from '@/lib/router';
import { images } from "@/content";
import AppImage from "../AppImage";
import { cardDetailsGet, customerDetailsGet, SelectMultiPosters } from "../../../redux/actions";
import { PACKAGES } from '../../Shared/constant';

const SuccessModal = (props) => {
    const { SuccessPopup, setSuccessPopup, Ammount } = props;
    const dispatch = useDispatch();
    const { cardDetails, customerDetail } = useSelector((state) => state.allReducers);
    const navigate = useNavigate();

    const CartClearStore = () => {
        dispatch(SelectMultiPosters({cart: 1,amount: 3.99}));
        dispatch(cardDetailsGet({}));
        dispatch(customerDetailsGet({}));
    };

    const totalAmount = Number((customerDetail?.amount) / 100).toLocaleString();
    const tierlock_fee = Number(customerDetail?.gwres?.tierlock_fee ?? 0);

    return(<div className="successModalwraps">
        <div className="successpymentwrapper">
            <div className="succesiocn">
                <AppImage src={images.home.successAnimation} alt="correct icon" width={120} height={120} />
            </div>
            <h4>Thank You!</h4>
            <p>We received your payment of <b>
                {/* ${(customerDetail?.total_amount||customerDetail?.amount) / 100} */}
                ${(parseFloat(totalAmount) + parseFloat(tierlock_fee)).toLocaleString()}
            </b> <br />
            We will send a confirmation email shortly to : <b>{customerDetail?.email}</b></p>
            <div className="tarnsitionId">
                <span>Transaction id</span> : {cardDetails?.transaction_id}
            </div>
            <div className="successpymentbutns">
                <Link className="btn cancelbtn" to={PACKAGES} onClick={() => CartClearStore()} >Sweepscoins points</Link>
                <Button className="savebtn" onClick={() => {setSuccessPopup({...SuccessPopup, open: false}); navigate("/")}}>Cancel</Button>
            </div>
        </div>
    </div>)
}

export default SuccessModal;
