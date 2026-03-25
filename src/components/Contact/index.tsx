// @ts-nocheck
/* eslint-disable */
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { content, images } from "@/content";
import { EMAIL_REGEX, trimValue, validateEmail, validatePhoneNumber } from "@/lib/formValidation";
import { CallLogoutUser } from "../../redux/actions";
import AppImage from "../Common/AppImage";
import CountrySelectInput from "../Common/CountrySelectInput/CountryMobileInput";
import CustomMendotoryMsg from "../Common/CustomMendotoryMsg";
import { CONTACT_US_API_URL } from "../Shared/constant";

const Contact = () => {
    const dispatch = useDispatch();
    const contactContent = content.contact;
    const successIcon = images.common.successIcon;
    const { geoComplyLocation } = useSelector((state) => state.allReducers);
    const [loading,setLoading] = useState(false)
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            fname: "",
            lname: "",
            email: "",
            message: "",
            mobileNo: {
                countrycode: "1",
                number: "",
            }
        }
    });
    const fname = watch("fname");
    const lname = watch("lname");
    const email = watch("email");
    const message = watch("message");
    const mobileNo = watch("mobileNo");

    const SubmitContact = ({ fname, lname, email, message, mobileNo }) => {
        document.getElementById("contactflag")?.classList?.remove("active");
        setLoading(true)

        const jsonData = JSON.stringify({
            "first_name" : fname,
            "last_name" : lname,
            "email" : email.toLowerCase(),
            "phone" : mobileNo?.countrycode.toString() + " " + mobileNo?.number.toString(),
            "message" : message,
            "location": geoComplyLocation
        });
        window.axios.post(CONTACT_US_API_URL, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(function (result) {
            setTimeout(()=> {
                toast.success(result.data.msg);
                SubmitClearForm();
            }, 100);
            setLoading(false)

        })
        .catch(function (result) {
            if(result?.response?.data?.errors?.location){
                toast.error(result.response.data.errors?.location);
            }else{
                toast.error(result.response.data.error);
            }
            if(result?.response?.status === 403) {
                dispatch(CallLogoutUser());
                localStorage.removeItem("accessToken");
                localStorage.removeItem("access_tokens");
            };
            setLoading(false)

        });
    };

    const SubmitClearForm = () => {
        setTimeout(() => {
            reset({
                fname: "",
                lname: "",
                email: "",
                message: "",
                mobileNo: {
                    countrycode: mobileNo?.countrycode || "1",
                    number: "",
                }
            });
        }, 200);
    }

    return(<section className="privacypage RefundPolicypage">
    <div className="main-header">
        <div className="container pravcypolicycontainer">
            <div className="row">
                <div className="col-md-12" style={{ textAlign: "center" }}>
                    <h1>{contactContent.pageTitle}</h1>
                </div>
            </div>
        </div>
    </div>
    <div className="container pravcypolicycontainer">
        <div className="row">
            <div className="col-md-12">
                <div className="contactusform">
                    <h4 style={{ marginBottom: "40px" }}>{contactContent.heading}</h4>
                    <form className="paymentformsWraps" onSubmit={handleSubmit(SubmitContact)}>
                        <div className="rowcustom">
                            <div className={errors?.fname ? "form-group error" : "form-group"}>
                                <label>{contactContent.fields.firstName.label}</label>
                                <div className="form-groupfiled">
                                    <Controller
                                        name="fname"
                                        control={control}
                                        rules={{ required: "First name cannot be empty" }}
                                        render={({ field }) => (
                                            <input type="text" className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder={contactContent.fields.firstName.placeholder} />
                                        )}
                                    />
                                    {fname !== "" && <AppImage src={successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors?.fname?.message && <CustomMendotoryMsg value={""} label={"First name"} />}
                                </div>
                            </div>
                        </div>
                        <div className="rowcustom">
                            <div className={errors?.lname ? "form-group error" : "form-group"}>
                                <label>{contactContent.fields.lastName.label}</label>
                                <div className="form-groupfiled">
                                    <Controller
                                        name="lname"
                                        control={control}
                                        rules={{ required: "Last name cannot be empty" }}
                                        render={({ field }) => (
                                            <input type="text" className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder={contactContent.fields.lastName.placeholder} />
                                        )}
                                    />
                                    {lname !== "" && <AppImage src={successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors?.lname?.message && <CustomMendotoryMsg value={""} label={"Last name"} />}
                                </div>
                            </div>
                        </div>
                        <div className="rowcustom">
                            <div className={errors?.email ? "form-group error" : "form-group"}>
                                <label>{contactContent.fields.email.label}</label>
                                <div className="form-groupfiled">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{ validate: (value) => validateEmail(value) }}
                                        render={({ field }) => (
                                            <input type="text" className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder={contactContent.fields.email.placeholder} />
                                        )}
                                    />
                                    {EMAIL_REGEX.test(email || "") === true && <AppImage src={successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors?.email?.message && <div className="danger-color">{errors.email.message}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="rowcustom">
                            <div className={errors?.mobileNo ? "form-group error" : "form-group"}>
                                <label>{contactContent.fields.phone.label}</label>
                                <div className="form-groupfiled">
                                    <Controller
                                        name="mobileNo"
                                        control={control}
                                        rules={{
                                            validate: (value) => validatePhoneNumber(value?.number)
                                        }}
                                        render={({ field }) => (
                                            <CountrySelectInput
                                                MobileNo={field.value}
                                                setMobileNo={field.onChange}
                                                id={"contactflag"}
                                            />
                                        )}
                                    />
                                    {mobileNo?.number?.toString()?.length === 10 && <AppImage src={successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors?.mobileNo?.message && <div className="danger-color">{errors.mobileNo.message}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="rowcustom">
                            <div className={errors?.message ? "form-group error" : "form-group"}>
                                <label>{contactContent.fields.message.label}</label>
                                <div className="form-groupfiled">
                                    <Controller
                                        name="message"
                                        control={control}
                                        rules={{ required: "Message cannot be empty" }}
                                        render={({ field }) => (
                                            <textarea type="text" className="form-control" value={field.value} id="input" onChange={(e) => field.onChange(e.target.value)} placeholder={contactContent.fields.message.placeholder} />
                                        )}
                                    />
                                    {message !== "" && <AppImage src={successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                                    {errors?.message?.message && <CustomMendotoryMsg value={""} label={"Message"} />}
                                </div>
                            </div>
                        </div>
                        <div className="contactussubmit">
                            <Button className="btn formcomnbtn" style={{
                                display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                width:"100%",
                            }} disabled={loading} type="submit">
                            {contactContent.submitButton}
                            {loading&&<span className="loading_spinner"></span>}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>)
}

export default Contact;
