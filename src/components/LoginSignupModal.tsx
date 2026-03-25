// @ts-nocheck
/* eslint-disable */
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from '@/lib/router';
import { toast } from 'react-toastify';
import { images } from "@/content";
import { trimValue, validateEmail, validatePassword } from "@/lib/formValidation";
import AppImage from "./Common/AppImage";
import { authfb } from "../config/facebookfirebaseConfig";
import { auth, provider } from "../config/firebaseConfig";
import { CallLogoutUser, accountNavigate, checkLogin, getAccessToken, getOverCallingGeoLocation, getRegioLcTime, getUniqueBrowserId, getUser } from "../redux/actions";
import { CHECK_OUT_PACKAGE, FORGOT_PASSWORD_API_URL, LOGIN_API_URL, MY_ACCOUNT, SOCIAL_FIREBASE_API_URL } from "./Shared/constant";

const LoginSignupModal = (props) => {
    const { setLoginSigupUp, setSignUp } = props;
    const [ LoginSignupSet, setLoginSignupSet ] = useState("Login");
    const [ loginWithForm, setLoginWithForm ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const Location = useLocation(); 
    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        watch,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const email = watch("email");
    const password = watch("password");

    // signup page function
    const signupFunction = () => {
        setSignUp(true);
        setLoginSigupUp(false);
        setLoginWithForm(false);
    };

    const loginFunction = async ({ email, password }) => {
        dispatch(getOverCallingGeoLocation(true));
        dispatch(getRegioLcTime(""));
        document.getElementById("pageisLoading").style.display = "flex";
        const jsonData = JSON.stringify({ email: email.toLowerCase(), password: password });
        window?.axios?.post(LOGIN_API_URL, jsonData, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        }).then(function (result) {
            dispatch(getUniqueBrowserId(result?.data?.data?.user_id));
            document.getElementById("pageisLoading").style.display = "none";
            getLogindata(result);
        })  
        .catch(function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            getLoginerror(result);
        });
    };
    

    // create new password function button
    const ForgotPasswordFnct = ({ email }) => {
        document.getElementById("pageisLoading").style.display = "flex";
        const jsonData = JSON.stringify({ email: email.toLowerCase() });
        window.axios.post(FORGOT_PASSWORD_API_URL, jsonData, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        }).then(function (result) {
            document.getElementById("pageisLoading").style.display = "none";
            toast.success(result.data.msg);
            setLoginSigupUp(false);
            ClearFields();
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
                email: "",
                password: ""
            });
            clearErrors();
        }, 500);
    };

    // forgot password page function
    const forgotpassFunction = () => {
        setLoginSignupSet("Forgotpassword");
        setLoginWithForm(false);
        reset({ email, password: "" });
        clearErrors();
    }

    // sign up or login with google 
    const authWithgoogle = (e) => {
        e.preventDefault();
        dispatch(getRegioLcTime(""));
        dispatch(getOverCallingGeoLocation(true));
        document.getElementById("pageisLoading").style.display = "flex";
        signInWithPopup(auth,provider).then((data)=>{
            const jsonData = JSON.stringify({ uid: data?.user?.uid });
            window.axios.post(SOCIAL_FIREBASE_API_URL, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
                }).then(function (result) {
                    getLogindata(result);
                    document.getElementById("pageisLoading").style.display = "none";
                    dispatch(getUniqueBrowserId(result?.data?.data?.user_id));
                })  
                .catch(function (result) {
                    document.getElementById("pageisLoading").style.display = "none";
                    getLoginerror(result);
                });
        }).catch(function(error) {
            if (error.code === "auth/popup-closed-by-user") {
                document.getElementById("pageisLoading").style.display = "none";
            };
        });
    }

    const getLogindata = (result) => {
        if(!result?.data?.data?.user?.is_active){
            return toast.info("The user is currently inactive. Please contact the administrator for further assistance.");
        }
        setTimeout(() => {
            if(Location?.pathname === "/checkout-package") {
                navigate(CHECK_OUT_PACKAGE);
            } else if(!Location?.pathname?.includes("free-credit") ){
                navigate(MY_ACCOUNT);
            }
            dispatch(accountNavigate("my-books"))
        }, 100);
        dispatch(getUser(result?.data?.data?.user));
        dispatch(getAccessToken(result?.data?.data?.access_token));
        localStorage.setItem("access_tokens", result?.data?.data?.access_token);
        dispatch(checkLogin("yes"));
        toast.success(result.data.msg);
        setLoginSigupUp(false);
        ClearFields();
        document.getElementById("pageisLoading").style.display = "none";
    }
    

    const getLoginerror = (result) => {
        dispatch(getUser(""));
        dispatch(checkLogin("no"));
        dispatch(getAccessToken(""));
        toast.error(result?.response?.data?.error);
    }

    // sign up or login with facebook
    const authWithfacebook = (e) => {
        e.preventDefault();
        dispatch(getRegioLcTime(""));
        dispatch(getOverCallingGeoLocation(true));
        document.getElementById("pageisLoading").style.display = "flex";
        const providerfb1 = new FacebookAuthProvider();
        signInWithPopup(authfb,providerfb1).then((data)=>{
            window.axios.get(SOCIAL_FIREBASE_API_URL + data?.user?.uid, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
                }).then(function (result) {
                    dispatch(getUniqueBrowserId(result?.data?.data?.user_id));
                    getLogindata(result);
                  document.getElementById("pageisLoading").style.display = "none";
                })  
                .catch(function (result) {
                    document.getElementById("pageisLoading").style.display = "none";
                    getLoginerror(result);
                });
        }).catch(function(error) {
            if (error.code === "auth/popup-closed-by-user") {
                document.getElementById("pageisLoading").style.display = "none";
            };
        });
    }

    return(<div className="loginsignupModals">
        <button className="closeModal" onClick={() => setLoginSigupUp(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><filter id="close_svg__a" width="136.7%" height="135.5%" x="-18.3%" y="-17.8%" filterUnits="objectBoundingBox"><feMorphology in="SourceAlpha" operator="dilate" radius="9" result="shadowSpreadOuter1"></feMorphology><feOffset dx="2" dy="12" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="14"></feGaussianBlur><feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g fillRule="evenodd" filter="url(#close_svg__a)" transform="translate(-421 -24)"><path d="m439.77 28 1.23 1.23-6.77 6.77 6.77 6.77-1.23 1.23-6.77-6.77-6.77 6.77-1.23-1.23 6.769-6.77L425 29.23l1.23-1.23 6.77 6.769L439.77 28z"></path></g></svg>
        </button>
        <div className="loginsignuptabs">
            <h1>{LoginSignupSet === "Login" ? "Log In" : "Create New Password"}</h1>
            <div className="loginPopupMain">
                {LoginSignupSet === "Login" ? (<h4>New to this site? <span onClick={() => signupFunction()}>Sign Up</span></h4>) : (<h4>Please enter your email address</h4>)}
                {!loginWithForm && LoginSignupSet !== "Forgotpassword" ? (<React.Fragment>
                    <div className="fbgoglrbnts">
                        {process.env.NEXT_PUBLIC_FACEBOOK_SHOW === "YES" && (<Button className="btn facebook" onClick={(e)=>authWithfacebook(e)}>
                            <span className="iconsn">
                                <AppImage src={images.auth.facebook} alt="FaceBookIcon" width={20} height={20} />
                            </span>
                            Login with Facebook
                        </Button>)}
                        <Button className="btn google" onClick={(e)=>authWithgoogle(e)}>
                            <span className="iconsn">
                                <AppImage src={images.auth.google} alt="GoogleIcon" width={13} height={13} />
                            </span>
                            Login with Google
                        </Button>
                    </div>
                    <div className="ordevidedst">
                        <span>or</span>
                    </div>
                    <Button className="btn loginwithemail" onClick={() => setLoginWithForm(!loginWithForm)}>{LoginSignupSet === "Login" ? "Login" : "Sign up"} with Email</Button>
                </React.Fragment>) : (<div className="loginwitemilformwrps">
                    {LoginSignupSet === "Login" ? (<React.Fragment>
                        <form onSubmit={handleSubmit(loginFunction)}>
                        <div className={errors?.email ? "form-group error" : "form-group"}>
                            <label>Email</label>
                            <input type="email" className="d-none"  />
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    validate: (value) => validateEmail(value)
                                }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={field.value}
                                        onChange={(e) => field.onChange(trimValue(e.target.value))}
                                        autoComplete="off"
                                    />
                                )}
                            />
                            {errors?.email?.message && <div className="danger-colorset">{errors.email.message}</div>}
                        </div>
                        <div className={errors?.password ? "form-group error" : "form-group"}>
                            <label>Password
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
                            <input type="password" className="d-none" />
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        validatePassword(value, "Password cannot be empty", "Please Enter Valid Password")
                                }}
                                render={({ field }) => (
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        autoComplete="off"
                                    />
                                )}
                            />
                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 3l18 18"></path><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>}
                            </span>
                            {errors?.password?.message && <div className="danger-colorset">{errors.password.message}</div>}
                        </div>
                        <h5 className="forgotpassword" onClick={() => forgotpassFunction()}>Forgot password?</h5>
                        <Button className="btn loginbtn" type="submit">Log In</Button>
                        </form>
                    </React.Fragment>) :
                    (<React.Fragment>
                        <form onSubmit={handleSubmit(ForgotPasswordFnct)}>
                        <div className={errors?.email ? "form-group error" : "form-group"}>
                            <label>Email</label>
                            <input type="email" className="d-none"  />
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    validate: (value) => validateEmail(value)
                                }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        autoComplete="off"
                                    />
                                )}
                            />
                            {errors?.email?.message && <div className="danger-colorset">{errors.email.message}</div>}
                        </div>
                        <Button className="btn loginbtn" type="submit">Create Password</Button>
                        </form>
                    </React.Fragment>)}

                    {LoginSignupSet !== "Forgotpassword" && (<React.Fragment>
                        <div className="ordevidedst ordevidedstmrgin">
                            <span>or {LoginSignupSet === "Login" ? "log in" : "Sign Up"} with</span>
                        </div>
                        <div className="socillinks">
                            {process.env.NEXT_PUBLIC_FACEBOOK_SHOW === "YES" && (<div>
                                <a href="javscript:void(0)" onClick={(e)=>authWithfacebook(e)}>
                                    <AppImage src={images.auth.facebook} className="FaceBookIcon" alt="FaceBookIcon" width={20} height={20} />
                                </a>
                            </div>)}
                            <div>
                                <a href="javscript:void(0)" onClick={(e)=>authWithgoogle(e)}>
                                    <AppImage src={images.auth.google} alt="GoogleIcon" width={20} height={20} />
                                </a>
                            </div>
                        </div>
                    </React.Fragment>)}
                </div>)}
            </div>
        </div>
    </div>)
}

export default LoginSignupModal;
