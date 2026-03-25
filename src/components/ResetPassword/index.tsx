// @ts-nocheck
/* eslint-disable */
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from '@/lib/router';
import { toast } from 'react-toastify';
import { validateConfirmPassword, validatePassword } from "@/lib/formValidation";
import { CallLogoutUser } from "../../redux/actions";
import { HOME_URL, RESET_PASSWORD_API_URL } from "../Shared/constant";
import { images } from "@/content";
import AppImage from "../Common/AppImage";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const Location = useLocation();
    const Navigate = useNavigate();
    const ResetPasswordId = Location?.pathname?.split("/")[2];
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });
    const newPassword = watch("newPassword");

    const ResetPasswordFnt = ({ confirmPassword }) => {
        document.getElementById("pageisLoading").style.display = "flex";
        const jsonData = JSON.stringify({ password: confirmPassword });
        window.axios.post(RESET_PASSWORD_API_URL + ResetPasswordId, jsonData, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        }).then(function (result) {
            toast.success(result.data.msg);
            ClearFields();
            setTimeout(() => {
                document.getElementById("pageisLoading").style.display = "none";
                Navigate(HOME_URL)
            }, 500);
        })  
        .catch(function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            toast.error(result.response.data.error);
            if(result?.response?.status === 403) {
                dispatch(CallLogoutUser());
                localStorage.removeItem("access_tokens");
            };
        });
    };

    // clear field set
    const ClearFields = () => {
        setTimeout(() => {
            reset({
                newPassword: "",
                confirmPassword: ""
            });
        }, 500);
    };

    return(<div className="loginsignuptabs loginsignuptabsresetpssword">
            <h1>Reset Password</h1>
            <div className="loginPopupMain">
                <form className="loginwitemilformwrps paswordfield" onSubmit={handleSubmit(ResetPasswordFnt)}>
                    <React.Fragment>
                        <div className="form-group">
                            <label>New Password
                                <div className="passwordnotewrapper">
                                    <ol>
                                        {/* Minimum 8 characters. */}
                                        <li>The alphabet must be between [a-z]</li>
                                        <li>At least one alphabet should be of Upper Case [A-Z]</li>
                                        <li>At least 1 number or digit between [0-9].</li>
                                        <li>At least 1 character from [ @ $ ! % * ? & ].</li>
                                    </ol>
                                    <AppImage src={images.auth.infoIcon} alt="info icon" width={13} height={13} />
                                </div>
                            </label>
                            <div className="passwordFieldwrap">
                                <input type="password" className="d-none" />
                                <Controller
                                    name="newPassword"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            validatePassword(
                                                value,
                                                "Password cannot be empty",
                                                "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
                                            )
                                    }}
                                    render={({ field }) => (
                                        <input type={showPassword ? "text" : "password"} className="form-control" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                                    )}
                                />
                                <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 3l18 18"></path><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>}
                                </span>
                            </div> 
                            {errors?.newPassword?.message && <div className="danger-colorset">{errors.newPassword.message}</div>}
                        </div>
                        <div className="form-group">
                            <label>Confirm Password
                                <div className="passwordnotewrapper">
                                    <ol>
                                        {/* Minimum 8 characters. */}
                                        <li>The alphabet must be between [a-z]</li>
                                        <li>At least one alphabet should be of Upper Case [A-Z]</li>
                                        <li>At least 1 number or digit between [0-9].</li>
                                        <li>At least 1 character from [ @ $ ! % * ? & ].</li>
                                    </ol>
                                    <AppImage src={images.auth.infoIcon} alt="info icon" width={13} height={13} />
                                </div>
                            </label>
                            <div className="passwordFieldwrap">
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            validateConfirmPassword(value, newPassword, "Password cannot be empty")
                                    }}
                                    render={({ field }) => (
                                        <input type={showConfirmPassword ? "text" : "password"} className="form-control" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                                    )}
                                />
                                <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 3l18 18"></path><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>}
                                </span>
                            </div>
                            {errors?.confirmPassword?.message && <div className="danger-colorset">{errors.confirmPassword.message}</div>}
                        </div>
                        <Button className="btn loginbtn" type="submit">Reset</Button>
                    </React.Fragment>
                </form>
            </div>
        </div>)
}

export default ResetPassword;
