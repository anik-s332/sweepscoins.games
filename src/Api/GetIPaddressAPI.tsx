const GetIPaddressAPI = async () => {
    const responce = window.axios.get(`https://mv.appristine.in/ip.php`).then(function (result) {
        return {
          ...result.data
        };
    }).catch(function (result) {
        return {
          ...result?.response?.data
        }
    });
    return responce;
};
  
export default GetIPaddressAPI;