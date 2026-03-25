// @ts-nocheck
import React from "react";
import { images } from "@/content";
import ErrorIcon from "../../assets/img/error.svg";
import AppImage from "./AppImage";

const CustomMendotoryMsg = (props) => {
    const { value, label } = props;

    if(label === "CVV") {
        if(label && value?.length !== 3) {
            return(<React.Fragment>
                <AppImage src={images.common.errorIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />
                <div className="danger-color">{`Please enter valid ${label}`}</div>
            </React.Fragment>)
        } 
    } else {
        if(label && (value === "" || value===undefined)) {
            return(<React.Fragment>
                <AppImage src={images.common.errorIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />
                <div className="danger-color">{`${label} cannot be empty`}</div>
            </React.Fragment>)
        } 
    }
}

export default CustomMendotoryMsg;
