// @ts-nocheck
const GetRequest = async (apiurl, access_token, data, pdf) => {
    const headers = {
      'Accept':"application/json",
      'Content-Type':"application/json",
    }
  
    if(access_token){
      headers.Authorization = `Bearer ${access_token}`
    }
    if(pdf){
      headers.Accept = "application/pdf"
    }
    const header = {
      headers:headers
    }
    if(data){
      header.params = data
    }
    
    const getResponse = window.axios.get(`${apiurl}`,header).then(function (result) {
    return result;
    }).catch((e)=>e.response)
    return getResponse;
}
export default GetRequest;
