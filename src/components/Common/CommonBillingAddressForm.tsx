// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { Country, State, City }  from 'country-state-city';
import { images } from "@/content";
import CustomMendotoryMsg from "./CustomMendotoryMsg";
import AppImage from "./AppImage";
import useZipCodeLookup from "./useZipCodeLookup";

const CommonBillingAddressForm = (props) => {
    const { KycAddress, setKycAddress, CustomError, zipCodeBillingValids, setZipCodeBillingValids, isDisabled, setZipLookupLoading } = props;
    const [ optionsState, setOptionsState ] = useState([]);
    const [ optionsCity, setOptionsCity ] = useState([]);
    const [ stateIsoCode, setStateisoCode ] = useState("");
    const CList = [
        {        
            key: 232,
            name: "United States",
            value: "US"
        }
    ];
    const applyZipLookupResult = useCallback((zipData) => {
        const stateFromApi = zipData?.state?.toString()?.trim?.() || "";
        const cityFromApi = zipData?.city?.toString()?.trim?.() || "";
        const usStates = State.getStatesOfCountry("US");
        const matchedState = usStates.find((item) =>
            item?.isoCode === stateFromApi ||
            item?.name?.toLowerCase?.() === stateFromApi?.toLowerCase?.()
        );
        const normalizedState = matchedState?.isoCode || stateFromApi;

        setKycAddress((prevAddress) => ({
            ...prevAddress,
            state: normalizedState || prevAddress.state,
            city: cityFromApi || prevAddress.city,
            zip: zipData?.zip_code?.toString() || prevAddress.zip,
        }));
    }, [setKycAddress]);

    const {
        handleZipCodeChange,
        isLoading: zipLookupLoading,
        lookupZipCode,
        setZipError,
        validateZipCodeField,
        zipError,
    } = useZipCodeLookup({
        zipCode: KycAddress?.zip,
        onZipCodeChange: (value) => setKycAddress((prevAddress) => ({ ...prevAddress, zip: value })),
        onLookupSuccess: applyZipLookupResult,
        onValidityChange: setZipCodeBillingValids,
        state: KycAddress?.state,
        city: KycAddress?.city,
    });

    useEffect(() => {
        if(CustomError || KycAddress?.zip) {
            if(KycAddress?.zip === "") {
                setZipError("Zip cannot be empty");
            }  else {
                validateZipCodeField(KycAddress?.zip);
            };
        }
    }, [KycAddress.zip, CustomError, setZipError, validateZipCodeField]);

    useEffect(() => {
        if (setZipLookupLoading) {
            setZipLookupLoading(zipLookupLoading);
        }

        return () => {
            if (setZipLookupLoading) {
                setZipLookupLoading(false);
            }
        };
    }, [setZipLookupLoading, zipLookupLoading]);

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
        return state?.isoCode ? state.isoCode : "";  
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
                        value: city.name,
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

    const hasSelectedCityInOptions = optionsCity?.some(
        (cityOption) =>
            cityOption?.value?.toLowerCase?.() === KycAddress?.city?.toLowerCase?.()
    );

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
                        disabled={isDisabled || zipLookupLoading}
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
                        onChange={(e) => setKycAddress({...KycAddress, state: e.target.value, city: ""})} 
                        value={KycAddress.state}
                        defaultValue={KycAddress.state} 
                        aria-label="Default select example"
                        disabled={isDisabled || zipLookupLoading}
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
                        disabled={isDisabled || zipLookupLoading}
                    >
                        <option value="">Select City</option>
                        {KycAddress?.city && !hasSelectedCityInOptions && (
                            <option value={KycAddress.city}>{KycAddress.city}</option>
                        )}
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
                        onBlur={() => validateZipCodeField(KycAddress?.zip)}
                        onChange={(e) => handleZipCodeChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                lookupZipCode(KycAddress?.zip);
                            }
                        }}
                        value={KycAddress.zip}
                        disabled={isDisabled || zipLookupLoading}
                    />
                    {/* <button
                        type="button"
                        aria-label="Search ZIP code"
                        onClick={() => lookupZipCode(KycAddress?.zip)}
                        disabled={isDisabled || zipLookupLoading}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            border: "1px solid #d7d7dc",
                            background: "#f5f5f8",
                            padding: "0 10px",
                            height: "34px",
                            minWidth: "72px",
                            width: "72px",
                            lineHeight: 1,
                            borderRadius: "7px",
                            fontSize: "15px",
                            fontWeight: 400,
                            color: "#2a2a2a",
                            cursor: "pointer",
                        }}
                    >
                        {zipLookupLoading ? "Searching" : "Search"}
                    </button> */}
                    {!zipLookupLoading && (KycAddress.zip?.length === 5 && zipCodeBillingValids === true) && <AppImage src={images.common.successIcon} className="errorsuccessicon" alt={"success icon"} width={18} height={18} style={{ right: "15px", top: "50%", transform: "translateY(-50%)" }} />}
                    {!zipLookupLoading && (KycAddress.zip?.length === 5 && zipCodeBillingValids === false) && <AppImage src={images.common.errorIcon} className="errorsuccessicon" alt={"success icon"} width={18} height={18} style={{ right: "15px", top: "50%", transform: "translateY(-50%)" }} />}
                    {!zipLookupLoading && zipError !== "" && <div className="danger-color">{zipError}</div>}
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
                        disabled={isDisabled || zipLookupLoading}
                    />
                    {CustomError && KycAddress.street2 === "" && <CustomMendotoryMsg value={KycAddress.street2} label={"Billing Address"} />}
                </div>
            </div>
        </div>
    </React.Fragment>)
}

export default CommonBillingAddressForm;
