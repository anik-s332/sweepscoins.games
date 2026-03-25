// @ts-nocheck
import { images } from "@/content";
import CloseIcon from "../../assets/img/close_mark.png";
import AppImage from "./AppImage";
import Privacy from "../Privacy";
import TermsConditions from "../TermsConditions";

const CommonTermsPrivacy = (props) => {
    const { TermsPravacyState, setTermsPravacyState } = props;

    return(<div className="commonModelWrappers">
        <button type="button" className="btn clsoebtnheader" onClick={() => setTermsPravacyState({...TermsPravacyState, open: false, Url: ""})}>
            <AppImage src={images.locate.closeMark} alt="close" width={24} height={24} />
        </button>
        {TermsPravacyState?.Url === "TERMS_CONDITIONS" ? (<TermsConditions />) : (<Privacy />)}
    </div>)
};

export default CommonTermsPrivacy;
