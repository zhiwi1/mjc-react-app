import axios from "axios";
import axiosInstance from "../security/requestInterceptor";
function isEmpty(str) {
    return (!str || str.length === 0);
}
export  function findAllCertificates(page, size, name = null, description = null, tagNames = null) {
    let apiUrl = `https://localhost:8443/v3/certificates?page=${page}&size=${size}&sortType=DESC&orderType=CREATE_DATE`;

    if (!isEmpty(name)) {
        apiUrl += `&name=${name}`
    }
    if (!isEmpty(description)) {
        apiUrl += `&description=${description}`
    }
    if (!isEmpty(tagNames)) {
        apiUrl += `&tagNames=${tagNames}`
    }

    const response = axios.get(apiUrl);
    console.log(response.data);
    return response.data;
}
const deleteCertificate = (id) => {

    axiosInstance
        .delete(`https://localhost:8443/v3/certificates/${id}`, result)
        .then((response) => {
          
            handleClose();
            window.location.reload();
        });

}
const editCertificate = (id) => {
    axiosInstance
        .put(`https://localhost:8443/v3/certificates/${id}`, result)
        .then((response) => {
          
            handleClose();
            window.location.reload();
        });
}
// async function deleteCertificate(){
//     axiosPost(result) {
//         axiosInstance
//           .post("http://localhost:8080/application/v3/certificates", result)
//           .then((response) => {
//             this.setState({ isOpen: false });
//             window.location.reload();
//           });
//       }
// }
// async function editCertificate(){

// }