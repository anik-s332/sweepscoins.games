// @ts-nocheck
/*eslint-disable */
import { useEffect, useState } from "react";
import { images } from "@/content";
import CaretDown from "../../../assets/img/caret-down.svg";
import AppImage from "../AppImage";
import Countries from "./CountryCodes.json";

const CountryMobileInput = (props) => {
    const { setMobileNo, MobileNo, id,isPointer,disabled } = props;
    const [ countryselect, setCountryselect] = useState("");
    const [ SelectFlag, setSelectFlag ] = useState("US");
    const FlagsUrl = "https://purecatamphetamine.github.io/country-flag-icons/3x2/";

    useEffect(() => {
        Countries.filter((elm) => {
            if(elm?.phone_code === parseInt(MobileNo?.countrycode)) {
                return setSelectFlag(elm?.country_code);
            }
        })
    }, [ MobileNo ]);

    
    // select country code & image
    const SelectCountryCode = (flags) => {
        setSelectFlag(flags.country_code);
        setMobileNo({...MobileNo, countrycode: flags.phone_code});
        setCountryselect("");
        document.getElementById(id)?.classList?.remove("active");
    };

    // open cuntry dropdwon function
    const OpenCountryDrop = (e) => {
        e.preventDefault();
        document.getElementById(id)?.classList?.toggle("active");
    }
    
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    
    // onChange effect 
    const OnchangeNoGet = (e) => {
        if(e.target.value.length <= 10) {
            setMobileNo({...MobileNo, number: e.target.value})
        }
    };

    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };
    
    document.addEventListener("wheel", function(event){
        if(document.activeElement.type === "number" && document.activeElement.classList.contains("inputBoxs")) {
            document.activeElement.blur();
        }
    });    

    return (<div className={`selectNoInputField ${isPointer ? "new_disable_class":""} ${disabled}`} >
        <div className="inputBoxSelect">
            <button className="selectEmojis" onClick={(e) => OpenCountryDrop(e)} disabled={isPointer}>
                {SelectFlag !== "" && <AppImage src={FlagsUrl + SelectFlag + ".svg"} className="flagsimg" alt="call image" width={24} height={18} />}
                <div className="countselet">+{MobileNo.countrycode}</div>
                <AppImage src={images.common.caretDown} className="arrowdownimg" alt="caret down" width={16} height={16} />
            </button>
            <div className="flagsDropdown" id={id}>
                <ul>
                    {Countries.filter((elm) => {
                        if(countryselect === "") {
                            return elm;
                        } else if(elm?.country_en.toLowerCase()?.includes(countryselect && countryselect?.toLowerCase())) {
                            return elm;
                        } 
                    }).map((flags, index) => {
                    return(<li key={index} onClick={() => SelectCountryCode(flags)}>
                        <AppImage src={FlagsUrl + flags.country_code + ".svg"} alt={flags?.country_en} width={24} height={18} />
                        <span>{flags?.country_en} (+{flags.phone_code})</span>
                    </li>)
                    })}
                </ul>
                <input type="text" id="flagsearchBox" value={countryselect} onChange={(e) => setCountryselect(e.target.value)} placeholder="Search Country..." />
            </div>
        </div>
        <input 
            type="number" 
            className={`${isPointer?"new_disable_class":""} inputBoxs`}  
            value={MobileNo.number}
            placeholder="Enter phone number"
            onChange={(e) => OnchangeNoGet(e)}
            onKeyPress={(e) => preventMinus(e)}
            min="0"
            onKeyDown={(e) =>
                exceptThisSymbols.includes(e.key) && e.preventDefault()
            }
            disabled={isPointer ? true : false}
        />
    </div>)
}

export default CountryMobileInput;
