// @ts-nocheck
/* eslint-disable */
import { images } from "@/content";
import Logo from "../../assets/img/sweepcoinscash-back.webp";
import AppImage from "./AppImage";

const EighteenYearsOldModel = (props) => {
    const { setEighteenModelState, setTermsPravacyState, TermsPravacyState } = props;

    // allow to view site
    const AllowSite = () => {
        setEighteenModelState(false);
        sessionStorage.setItem("SiteBlockChecking", "no");
    };

    // redirect to google site
    const BlockSite = () => {
        window.location.replace('https://www.google.com/');
    };

    // privacy policy page link
    const privacyPolicyLink = () => {
        setTermsPravacyState({...TermsPravacyState, open: !TermsPravacyState?.open, Url: "PRIVACY_POLICY"});
    };

    // terms and conditions page link
    const termsAndCondtionsLink = () => {
        setTermsPravacyState({...TermsPravacyState, open: !TermsPravacyState?.open, Url: "TERMS_CONDITIONS"});
    };

    return(<div className="EighteenYearsOldModelWrapper">
        <AppImage src={images.common.ageGateLogo} alt="logo" width={127} height={127} priority />
        <h1>Welcome</h1>
        <p>Are you older than 18?</p>
        <div className="btngroupmange">
            <button type="button" className="btn yesbtn" onClick={() => AllowSite()}>Yes</button>
            <button type="button" className="btn nobtn" onClick={() => BlockSite()}>No</button>
        </div>
        <div className="lastmessageterms">By accessing this site, you accept the 
            <button className="btn btn-link" onClick={() => privacyPolicyLink()}>Privacy Policy</button> and 
            <button className="btn btn-link" onClick={() => termsAndCondtionsLink()}>Terms and Conditions</button>
        </div>
    </div>)
};

export default EighteenYearsOldModel;
