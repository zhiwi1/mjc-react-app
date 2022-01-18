import axiosInstance from "../security/requestInterceptor";

async function findAllCertificates(page, size, name = null, description = null, tagNames = null) {
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
    const response = await axiosInstance.get(apiUrl);
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
    }
    return response;
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