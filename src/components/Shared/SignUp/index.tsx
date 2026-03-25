// @ts-nocheck
/* eslint-disable */
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from '@/lib/router';
import { toast } from 'react-toastify';
import { images } from "@/content";
import { EMAIL_REGEX, PASSWORD_ERROR_MESSAGE, trimValue, validateConfirmPassword, validateEmail, validatePassword, validatePhoneNumber } from "@/lib/formValidation";
import InfoIcon from "../../../assets/img/information-button.png";
import { checkLogin, getAccessToken, getOverCallingGeoLocation, getRegioLcTime, getUniqueBrowserId, getUser } from "../../../redux/actions";
import AppImage from "../../Common/AppImage";
import CountrySelectInput from "../../Common/CountrySelectInput/CountryMobileInput";
import CustomMendotoryMsg from "../../Common/CustomMendotoryMsg";
import { PRIVACY_POLICY, PROMOTIONAL_RULES, SIGN_UP_API_URL, TERMS_CONDITIONS } from '../../Shared/constant';

const SignUpSidebar = (props) => {
    const { SignUp, setSignUp, AllclearData, setAllclearData } = props;
    const dispatch = useDispatch();
    const [ ProvideContent, setProvideContent ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const { accessToken } = useSelector((state) => state.allReducers);
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        defaultValues: {
            fname: "",
            lname: "",
            email: "",
            password: "",
            confirmPassword: "",
            rcode: "",
            mobileNo: {
                countrycode: "1",
                number: "",
            },
            termsconditions: false,
            sweepstakesrules: false,
        }
    });
    const fname = watch("fname");
    const lname = watch("lname");
    const email = watch("email");
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");
    const MobileNo = watch("mobileNo");
    const updateTermsCondtions1 = watch("termsconditions");
    const updateTermsCondtions = watch("sweepstakesrules");
    const rcode = watch("rcode");


    useEffect(() => {
        const params = new URLSearchParams(window?.location?.search);
        const referCode = params.get('refer-code');
        if (!accessToken && params.has('refer-code')) {
            setSignUp(true);
            setValue("rcode", referCode)
        }
      }, []);

            const[ipaddress,setIpAddress]= useState('')
            function callAPI(state) {
                const data = fetch('https://api.ipify.org/?format=json')
                  .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                      return response.json();
                  })
                  .then((data) => {
                      localStorage.setItem("IP", data?.ip);
                      return data?.ip;
                  })
                  .catch((error) => {
                     return ""
                  });
                  return data
            };
        
            useEffect(() => {
                const fetchIp = async() =>{
                    const Ip = await callAPI()
                    setIpAddress(Ip)
                }
                fetchIp()
            }, []);

    const SignUpSubmit = ({ fname, lname, email, password, confirmPassword, mobileNo, rcode }) => {
        document.getElementById("signupflag")?.classList?.remove("active");
        document.getElementById("pageisLoading").style.display = "flex";
        dispatch(getRegioLcTime(""));
        dispatch(getOverCallingGeoLocation(true));
        const jsonData = JSON.stringify({ 
            first_name: fname, 
            last_name: lname, 
            email: email.toLowerCase(), 
            password: confirmPassword, 
            phone: mobileNo?.countrycode.toString() + " " + mobileNo?.number.toString(),
            referrer_code:rcode.trim(),
            ipaddress:ipaddress
        });
        window.axios.post(SIGN_UP_API_URL, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (result) {
            dispatch(getUniqueBrowserId(result?.data?.data?.user_id));
            document.getElementById("pageisLoading").style.display = "none";
            dispatch(getUser(result?.data?.data?.user));
            dispatch(getAccessToken(result?.data?.data?.access_token));
            localStorage.setItem("access_tokens", result?.data?.data?.access_token);
            dispatch(checkLogin("yes"));
            toast.success(result.data.msg);
            closeSidebar();
            ResetForm();
            document.getElementById("signupflag")?.classList?.remove("active");
        })  
        .catch(function (result) {
            dispatch(getUser(""));
            dispatch(checkLogin("no"));
            dispatch(getAccessToken(""));
            toast.error(result.response.data.error);
            document.getElementById("pageisLoading").style.display = "none";
        });
    };


    useEffect(() => {
        if(AllclearData === true) {
            ResetForm();
            document.getElementById("signupflag")?.classList?.remove("active");
            setTimeout(() => {
                setAllclearData(false);
            }, 200);
        };
    }, [ AllclearData ]);

    // clear for data
    const ResetForm = () => {
        reset({
            fname: "",
            lname: "",
            email: "",
            password: "",
            confirmPassword: "",
            rcode: "",
            mobileNo: {
                countrycode: MobileNo?.countrycode || "1",
                number: ""
            },
            termsconditions: false,
            sweepstakesrules: false,
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
        document.getElementById("signupflag")?.classList?.remove("active");
    };

    // close sidebar function
    const closeSidebar = (url) => {
        if(url !== undefined) {
            setTimeout(() => {
                setSignUp(false);
                document.getElementById("signupflag")?.classList?.remove("active");
            }, 100)
        } else {
            setSignUp(false);
            setProvideContent(false);
            ResetForm();
            document.getElementById("signupflag")?.classList?.remove("active");
        }
    };

    return(<div className={SignUp === true ? "sidebarcommon open" : "sidebarcommon"}>
        <h2>SIGN UP
            <svg onClick={() => closeSidebar()} preserveAspectRatio="xMidYMid meet" data-bbox="82.189 55.096 481.811 481.808" xmlns="http://www.w3.org/2000/svg" viewBox="82.189 55.096 481.811 481.808" role="presentation" aria-hidden="true">
                <g>
                    <path d="M531.936 536.904L323.094 328.063 114.253 536.904l-32.064-32.062L291.032 296 82.189 87.157l32.064-32.061 208.842 208.842L531.936 55.096 564 87.157 355.155 296 564 504.842l-32.064 32.062z"></path>
                </g>
            </svg>
        </h2>
        <p>Join Sweepscoins.games and Play To Win!</p>
        <form className="paymentformsWraps signupfields" onSubmit={handleSubmit(SignUpSubmit)}>
            <div className="termscondtaceptsection">
                <div className="form-group-checkbox">
                    <Controller
                        name="termsconditions"
                        control={control}
                        rules={{ validate: (value) => value ? true : "Please accept terms and conditions" }}
                        render={({ field }) => (
                            <input type="checkbox" id="termsconditions" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                        )}
                    />
                    <label htmlFor="termsconditions">I accept terms & conditions <Link to={TERMS_CONDITIONS} onClick={() => closeSidebar("checkTermsfile")} >View terms of use</Link></label>
                    {errors?.termsconditions?.message && <div className="danger-color">{errors.termsconditions.message}</div>}
                </div>
                <div className="form-group-checkbox">
                    <Controller
                        name="sweepstakesrules"
                        control={control}
                        rules={{ validate: (value) => value ? true : "Please accept official sweepstakes rules" }}
                        render={({ field }) => (
                            <input type="checkbox" id="sweepstakesrules" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                        )}
                    />
                    <label htmlFor="sweepstakesrules">I accept official sweepstakes rules <Link to={TERMS_CONDITIONS} onClick={() => closeSidebar("checkTermsfile")} >View terms of use</Link></label>
                    {errors?.sweepstakesrules?.message && <div className="danger-color">{errors.sweepstakesrules.message}</div>}
                </div>
            </div>
            <div className="rowcustom rowcustom-col-2">
                <div className={errors?.fname ? "form-group error" : "form-group"}>
                    <label>First Name *</label>
                    <div className="form-groupfiled">
                        <Controller
                            name="fname"
                            control={control}
                            rules={{ required: "First name cannot be empty" }}
                            render={({ field }) => (
                                <input type="text" className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder="Enter First Name" autoComplete="off"/>
                            )}
                        />
                        {fname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                        {errors?.fname?.message && <CustomMendotoryMsg value={""} label={"First name"} />}
                    </div>
                </div>
                <div className={errors?.lname ? "form-group error" : "form-group"}>
                    <label>Last Name *</label>
                    <div className="form-groupfiled">
                        <Controller
                            name="lname"
                            control={control}
                            rules={{ required: "Last name cannot be empty" }}
                            render={({ field }) => (
                                <input type="text" className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder="Enter Last Name" autoComplete="off"/>
                            )}
                        />
                        {lname !== "" && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                        {errors?.lname?.message && <CustomMendotoryMsg value={""} label={"Last name"} />}
                    </div>
                </div>
            </div>
            <div className="rowcustom rowcustom-col-2">
                <div className={errors?.email ? "form-group error" : "form-group"}>
                    <label>Email *</label>
                    <div className="form-groupfiled">
                        <Controller
                            name="email"
                            control={control}
                            rules={{ validate: (value) => validateEmail(value) }}
                            render={({ field }) => (
                                <input type="text" className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder="Enter Email" autoComplete="off"/>
                            )}
                        />
                        {EMAIL_REGEX.test(email || "") === true && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                        {errors?.email?.message && <div className="danger-color">{errors.email.message}</div>}
                    </div>
                </div>
                <div className={errors?.mobileNo ? "form-group error" : "form-group"}>
                    <label>Phone</label>
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
                                    id={"signupflag"}
                                />
                            )}
                        />
                        {MobileNo?.number?.toString()?.length === 10 && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"icon"} width={18} height={18} />}
                        {errors?.mobileNo?.message && <div className="danger-color">{errors.mobileNo.message}</div>}
                    </div>
                </div>
            </div>
            <duv className="rowcustom">
                <div className="form-group">
                <label>Referral code</label>
                <div className="form-groupfiled">
                <Controller
                    name="rcode"
                    control={control}
                    render={({ field }) => (
                        <input type="text" className="form-control" 
                        value={field.value} 
                        onChange={(e) => field.onChange(trimValue(e.target.value))}
                         placeholder="Enter Referral code" autoComplete="off"/>
                    )}
                />
                </div>
                </div>
            </duv>
            <div className="rowcustom rowcustom-col-2 paswordfield">
                <div className={errors?.password ? "form-group error" : "form-group"}>
                    <label>Password *
                        <div className="passwordnotewrapper">
                            <ol>
                                {/* Minimum 8 characters. */}
                                <li>The alphabet must be between [a-z]</li>
                                <li>At least one alphabet should be of Upper Case [A-Z]</li>
                                <li>At least 1 number or digit between [0-9].</li>
                                <li>At least 1 character from [ @ $ ! % * ? & ].</li>
                            </ol>
                            <AppImage src={images.auth.info} className="errorsuccessicon" alt={"info icon"} width={18} height={18} />
                        </div>
                    </label>
                    <div className="form-groupfiled passwordboxset">
                        <input type="password" className="d-none" style={{ display: "none" }} />
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                validate: (value) => validatePassword(value, "Password cannot be empty", PASSWORD_ERROR_MESSAGE)
                            }}
                            render={({ field }) => (
                                <input type={showPassword ? "text" : "password"} className="form-control" value={field.value} onChange={(e) => field.onChange(trimValue(e.target.value))} placeholder="Enter Password" autoComplete="new-password"/>
                            )}
                        />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 3l18 18"></path><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>}
                        </span>
                        {errors?.password?.message && <div className="danger-colorset">{errors.password.message}</div>}
                    </div>
                </div>
                <div className={errors?.confirmPassword ? "form-group error" : "form-group"}>
                    <label>Confirm Password *
                        <div className="passwordnotewrapper">
                            <ol>
                                {/* Minimum 8 characters. */}
                                <li>The alphabet must be between [a-z]</li>
                                <li>At least one alphabet should be of Upper Case [A-Z]</li>
                                <li>At least 1 number or digit between [0-9].</li>
                                <li>At least 1 character from [ @ $ ! % * ? & ].</li>
                            </ol>
                            <AppImage src={images.auth.info} className="errorsuccessicon" alt={"info icon"} width={18} height={18} />
                        </div>
                    </label>
                    <div className="form-groupfiled passwordboxset">
                        <input type="password" className="d-none" style={{ display: "none" }} />
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                validate: (value) => validateConfirmPassword(value, password)
                            }}
                            render={({ field }) => (
                                <input type={showConfirmPassword ? "text" : "password"} className="form-control" value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder="Enter Confirm Password" autoComplete="new-password" />
                            )}
                        />
                        <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 3l18 18"></path><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path><path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" /></svg>}
                        </span>
                        {errors?.confirmPassword?.message && <div className="danger-colorset">{errors.confirmPassword.message}</div>}
                    </div>
                </div>
            </div>
            <div className="rowcustom rowcustom-col-2">
                <div className="form-group">
                    <Button className="btn formcomnbtnsidbr" type="submit">Submit</Button>
                </div>
            </div>
        </form>
        <div className="prvidethiswhy">
            <AppImage src={images.auth.sweepsGames} alt="Sweeps Coins" width={360} height={260} />
            <div className="prvidethiswhytoggleinfo">
                <div onClick={() => setProvideContent(!ProvideContent)}>Why do I need to provide this?</div>
                {ProvideContent && (<p>Sweeps Coins is an authorized sponsor of promotional sweepstakes games.  In order to comply with local and federal laws, including anti-money laundering laws, sweepstakes laws, and tax laws, we are required to collect certain personal information from sweepstakes participants before we can award prizes.  The requirement that we collect such information is also spelled out in our <Link to={TERMS_CONDITIONS} onClick={() => closeSidebar("checkTermsfile")} >Terms & Conditions</Link> and <Link to={PROMOTIONAL_RULES} onClick={() => closeSidebar("checkTermsfile")}>Promotional Rules</Link>.  We value your privacy, and we will not use your personal information for any unauthorized reasons.  Please see our <Link to={PRIVACY_POLICY} onClick={() => closeSidebar("checkTermsfile")}>Privacy Policy</Link> for further information on how we protect your private information.</p>)}
            </div>
        </div>
    </div>);
}

export default SignUpSidebar;
