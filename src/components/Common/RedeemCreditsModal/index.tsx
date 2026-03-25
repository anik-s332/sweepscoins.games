// @ts-nocheck
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { images } from "@/content";
import sound from '../../../assets/audio/game-bonus-144751.wav';
import { CallLogoutUser, getOverCallingGeoLocation, getRegioLcTime, getUser } from "../../../redux/actions";
import AppImage from "../AppImage";
import { USER_CREDIT_REQUEST_API_URL } from "../../Shared/constant";
const RedeemCreditsModal = (props) => {
    const { RedeemCrditModalState, setRedeemCrditModalState, accessToken, UserBlalance, RequestProcessModel, setRequestProcessModel } = props;
    const dispatch = useDispatch();
    const exceptThisSymbols = ["e", "E", "+", "-"];
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            creditAmount: ""
        }
    });
    const creditAmount = watch("creditAmount");

    useEffect(() => {
        const myInput = document.getElementById("redeemInputBox");

        myInput?.addEventListener("focus", function() {
            myInput.placeholder = "";
        });

        myInput?.addEventListener("blur", function() {
            // myInput.placeholder = "Number of entries you want to redeem";
            myInput.placeholder = "Number of Credits you want to Allocate";
        });
    }, []);

    const isDecimal = (value) => {
        var decimalPattern = /^\d*\.\d+$/;
        return decimalPattern.test(value);
    }
    
    const RedeemCreditValueConvert = (value) => {
        if(isDecimal(value)) {
            var SplitDecimal = value?.split(".");
            var addition = parseInt(SplitDecimal[0].toString() + SplitDecimal[1].toString());
            return SplitDecimal[1]?.length === 1 ? parseInt(addition * 10) : parseInt(addition);
        } else{
            return parseInt(value * 100);
        }
    };

    const submitRedeem = () => {        
        dispatch(getRegioLcTime(""));
        dispatch(getOverCallingGeoLocation(true));
        document.getElementById("pageisLoading").style.display = "flex";
        submitRedeemGeoFunction();
    };


    const submitRedeemGeoFunction = () => {
        if(creditAmount !== "" && creditAmount.toString() !== "0") {
            if(parseInt(creditAmount) <= parseInt(UserBlalance)) {
                window.axios.get(`${USER_CREDIT_REQUEST_API_URL}${RedeemCrditModalState?.RedeemData?.id}/${RedeemCreditValueConvert(creditAmount)}` , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    }
                }).then(function (result) {
                    if(result?.data) {
                        document.getElementById("pageisLoading").style.display = "none";
                        setRedeemCrditModalState({...RedeemCrditModalState, open: false});
                        setRequestProcessModel({...RequestProcessModel, open: true, data: result?.data?.data})
                        dispatch(getUser(result?.data?.data?.user));
                        reset({ creditAmount: "" });
                        new Audio(sound).play();
                        toast.success(result.data.msg)
                                            document.getElementById("pageisLoading").style.display = "none";


                    }
                }).catch(function (result) {
                    document.getElementById("pageisLoading").style.display = "none";
                    toast.error(result.response.data.error);
                    if(result?.response?.status === 403) {
                        dispatch(CallLogoutUser());
                        localStorage.removeItem("access_tokens");
                    };
                });
            }
        };            
    };

    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

    const onChange = (e) => {
        const inputValue = e.target.value;

        if (e.target.type === "number") {
            // const isNumeric = /^\d+$/.test(inputValue);
            const isNumeric = /^\d*\.?\d{0,2}$/.test(inputValue);

            if (!isNumeric && inputValue) {
                return;
            }
            if (parseFloat(inputValue) <= 0) {
                setValue("creditAmount", "");
                return;
            }
            if (parseFloat(inputValue) > 999999) {
                return;
            }
        }
        setValue("creditAmount", e.target.value, { shouldValidate: true })
    };
    document.addEventListener("wheel", function(event){
        if(document.activeElement.type === "number" && document.activeElement.classList.contains("inputredeem")) {
            document.activeElement.blur();
        }
    });

    return(<div className="RedeemCreditModalMain">
        <div className="closebtn" onClick={() => setRedeemCrditModalState({...RedeemCrditModalState, open: false})}>
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="29.6 26 148 148" xmlns="http://www.w3.org/2000/svg" viewBox="29.6 26 148 148" role="presentation" aria-hidden="true">
                <g><path d="M177.6 147.3L130.3 100l47.3-47.3L150.9 26l-47.3 47.3L56.3 26 29.6 52.7 76.9 100l-47.3 47.3L56.3 174l47.3-47.3 47.3 47.3 26.7-26.7z"></path></g>
            </svg>    
        </div>
        <h1>{RedeemCrditModalState?.title}</h1>
        <div className="redeempics">
            <AppImage src={RedeemCrditModalState?.RedeemData?.product_img_path || images.common.defaultProduct} alt={"redeempics_" + RedeemCrditModalState?.RedeemData?.id} width={220} height={220} /> 
            <form className="redeemcreditform" onSubmit={handleSubmit(submitRedeem)}>
                <Controller
                    name="creditAmount"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if(value === "") {
                                return "Redeem amount cannot be empty";
                            }
                            if(value.toString() === "0") {
                                return "Please enter valid amount";
                            }
                            if(parseInt(value) > parseInt(UserBlalance)) {
                                return "Available credit should be more than claim credit.";
                            }
                            return true;
                        }
                    }}
                    render={({ field }) => (
                        <input 
                            type="number" 
                            id="redeemInputBox"
                            className="form-control inputredeem" 
                            value={field.value} 
                            onChange={onChange}
                            min="0" 
                            onKeyPress={preventMinus} 
                            onKeyDown={(e) =>
                                exceptThisSymbols.includes(e.key) && e.preventDefault()
                            }
                            placeholder="Number of Credits you want to Allocate"
                        />
                    )}
                />
                {errors?.creditAmount?.message && (<div className="danger-colorset">{errors.creditAmount.message}</div>)}
                <button className="btn" type="submit" >Submit</button>
            </form>
        </div>
    </div>)
}

export default RedeemCreditsModal;
