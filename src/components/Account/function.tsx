// @ts-nocheck
export const SsnFormat = (value) => {
  if(value){
    var val = value?.replace(/[^\d-]/g, "");
  
    val = val?.replace(/^(\d{3})-?(\d{1,2})/, "$1-$2");
  
    val = val?.replace(/^(\d{3})-?(\d{2})-?(\d{1,4})/, "$1-$2-$3");
  
    val = val?.split("")?.filter((val, idx) => {
        return val !== "-" || idx === 3 || idx === 6;
      })?.join("");
  
    return val?.substring(0, 11);
  }
};

export function subtractYearsFromDate(years) {
  var today = new Date();
  today?.setFullYear(today?.getFullYear() - years);
  return today;
}

export const SSNRegex =
  /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;

export const ValidSSN = (value, setValue) => {
  if (value === "") {
    setValue("SSN cannot be empty");
  } else if (SSNRegex?.test(value) === false) {
    setValue("Please enter valid SSN");
  } else {
    setValue("");
  }
};

export function callAPI(state) {
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

