// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Country, State, City }  from 'country-state-city';
import { images } from "@/content";
import CustomMendotoryMsg from "./CustomMendotoryMsg";
import AppImage from "./AppImage";
import { useSelector } from "react-redux";

const CommonBillingAddressForm = (props) => {
    const { KycAddress, setKycAddress, CustomError, zipCodeBillingValids, setZipCodeBillingValids, isDisabled } = props;
    const { zipCodesAll } = useSelector((state) => state.allReducers);
    const [ optionsState, setOptionsState ] = useState([]);
    const [ optionsCity, setOptionsCity ] = useState([]);
    const [ stateIsoCode, setStateisoCode ] = useState("");
    const ZipCodesFilter = Array.isArray(zipCodesAll)? zipCodesAll.filter((elm) => elm?.state?.toString() === stateIsoCode): [];
    const ZipCodeValids = ZipCodesFilter?.filter((elm) => elm?.zip_code.toString() === KycAddress?.zip).length > 0;
    const [ errorZip, setErrorZip ] = useState("");
    const CList = [
        {        
            key: 232,
            name: "United States",
            value: "US"
        }
    ];

    useEffect(() => {
        setZipCodeBillingValids(ZipCodeValids);
    }, [ZipCodeValids]);

    const ValidZIP = (value) => {
        if(value === "") {
            setErrorZip("Zip cannot be empty");
        } else if(ZipCodeValids === false) {
            setErrorZip("Please enter valid zip")
        } else {
            setErrorZip("");
        }
    };

    useEffect(() => {
        if(CustomError || KycAddress?.zip) {
            if(KycAddress?.zip === "") {
                setErrorZip("Zip cannot be empty");
            }  else {
                setErrorZip("");
            };
        }
    }, [KycAddress.zip, CustomError]);

    useEffect(() => {
        fetchStates(KycAddress.country);
    }, [KycAddress])

    const getCountryIsoCodeByName = (countryName) => {
        const country = Country?.getAllCountries()?.find(country => country.isoCode === countryName);
        return country?.isoCode; 
    };

    const fetchStates = (countryName) => {
        const countryIsoCode = getCountryIsoCodeByName(countryName); 
        if (countryIsoCode) {
            const states = State.getStatesOfCountry(countryIsoCode).map((state, index) => {
                return {
                    label: state.name,
                    value: state.isoCode,
                    key: index
                };
            });
            setOptionsState(states); 
        } else {
            setOptionsState([]); 
        }
    };

    useEffect(() => {
        fetchCities(KycAddress.country, KycAddress.state);
    }, [KycAddress])

    const getStateIsoCodeByName = (countryIsoCode, stateName) => {
        const states = State.getStatesOfCountry(countryIsoCode);
        const state = states.find(state => state.isoCode === stateName);  
        return state.isoCode ? state.isoCode : "";  
    };

    const fetchCities = (cisoCode, stateName) => { 
        const countryIsoCode = getCountryIsoCodeByName(cisoCode); 
        if (countryIsoCode && stateName) {
            const stateIsoCode = getStateIsoCodeByName(countryIsoCode, stateName);
            setStateisoCode(stateIsoCode);

            if (stateIsoCode) {
                const cities = City.getCitiesOfState(countryIsoCode, stateIsoCode).map((city, index) => {
                    return {
                        label: city.name,
                        value: city.isoCode,  
                        key: index
                    };
                });
                setOptionsCity(cities);  
            } else {
                setOptionsCity([]);
            }
        } else {
            setOptionsCity([]);  
        }
    }; 

    return (<React.Fragment>
        <div className="rowcustom rowcustom-col-2">
            <div className="form-group">
                <label>Country</label>
                <div className="form-groupfiled">
                    <select 
                        className="form-control" 
                        onChange={(e) => setKycAddress({...KycAddress, country: e.target.value})} 
                        defaultValue={KycAddress.country} 
                        aria-label="Default select example"
                        disabled={isDisabled}
                    >
                        {CList?.map((elm, index) => {
                            return(<option value={elm.value} key={index}>{elm.name}</option>)
                        })}
                    </select>
                    {CustomError && KycAddress.country === "" && <CustomMendotoryMsg value={KycAddress.country} label={"Country"} />}
                </div>
            </div>
            <div className="form-group">
                <label>State</label> 
                <div className="form-groupfiled">
                    <select 
                        className="form-control" 
                        onChange={(e) => setKycAddress({...KycAddress, state: e.target.value})} 
                        value={KycAddress.state}
                        defaultValue={KycAddress.state} 
                        aria-label="Default select example"
                        disabled={isDisabled}
                    >
                        <option value="">Select State</option>
                        {optionsState?.map((elm, index) => {
                            return(<option value={elm.value} key={index}>{elm.label}</option>)
                        })}
                    </select>
                    {CustomError && KycAddress.state === "" && <CustomMendotoryMsg value={KycAddress.state} label={"State"} />}
                </div>
            </div>
        </div>
        <div className="rowcustom rowcustom-col-2">
            <div className="form-group">
                <label>City</label>
                <div className="form-groupfiled">
                    <select 
                        className="form-control" 
                        onChange={(e) => setKycAddress({...KycAddress, city: e.target.value})} 
                        value={KycAddress.city}
                        defaultValue={KycAddress.city} 
                        aria-label="Default select example"
                        disabled={isDisabled}
                    >
                        <option value="">Select City</option>
                        {optionsCity?.map((elm, index) => {
                            return(<option value={elm.value} key={index}>{elm.label}</option>)
                        })}
                    </select>
                    {CustomError && KycAddress.city === "" && <CustomMendotoryMsg value={KycAddress.city} label={"City"} />}
                </div>
            </div>
            <div className="form-group">
                <label>ZIP</label>
                <div className="form-groupfiled">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder={"Enter Zip Code"}
                        onKeyUp={(e) => ValidZIP(e.target.value)}
                        onChange={(e) => setKycAddress({...KycAddress, zip: e.target.value})} 
                        value={KycAddress.zip}
                        disabled={isDisabled}
                    />
                    {zipCodeBillingValids === true && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"success icon"} width={18} height={18} />}
                    {zipCodeBillingValids === false && <AppImage src={images.common.errorIcon} className="errorsuccessicon" alt={"success icon"} width={18} height={18} />}
                    {errorZip !== "" && <div className="danger-color">{errorZip}</div>}
                </div>
            </div>
        </div>
        <div className="rowcustom rowcustom-col-1">
            <div className="form-group">
                <label>Billing address </label>
                <div className="form-groupfiled">
                    <input
                        type="text"
                        value={KycAddress.street2}
                        className="form-control"
                        placeholder="Billing Address"
                        onChange={(e) => setKycAddress({...KycAddress, street2: e.target.value})}
                        disabled={isDisabled}
                    />
                    {CustomError && KycAddress.street2 === "" && <CustomMendotoryMsg value={KycAddress.street2} label={"Billing Address"} />}
                </div>
            </div>
        </div>
    </React.Fragment>)
}

export default CommonBillingAddressForm;
