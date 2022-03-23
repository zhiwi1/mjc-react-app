import axiosInstance from "../security/requestInterceptor";

function isEmpty(str) {
    return (!str || str.length === 0);
}
function findByCriteria(text) {
    let firstSymbol = text.charAt(0);
    rows = [];
    
    switch (firstSymbol) {
        case '!': {
            let description = text.substring(1, text.length);
            findAllCertificates(0, 100, null, description);
            break;
        }
        case '#': {
            let tagNames = text.split('#');
            let realTags = [];
            for (let i = 1; i < tagNames.length; i++) {
                realTags.push(tagNames[i].slice());
            }
            findAllCertificates(0, 100, null, null, realTags);
            break
        }
        default: {
            findAllCertificates(0, 100, text);
            break;
        }
    }
}
export function findAllCertificates(page, size, name = null, description = null, tagNames = null) {
    let answer = [];

    let apiUrl = `https://localhost:8443/v3/certificates?page=${page}&size=${size}&sortType=DESC&orderType=CREATE_DATE`;

    if (!isEmpty(name)) {
        apiUrl += `&name=${name}`
    }
    if (!isEmpty(description)) {
        apiUrl += `&description=${description}`
    }

    if (!isEmpty(tagNames)) {
        for (let i = 0; i < tagNames.length; i++) {
            let tagName = tagNames[i];
            apiUrl += `&tagNames=${tagName}`
        }
    }
    
    axios.get(apiUrl)
        .then((response) => {
            answer = showCertificates(response.data)

        }).catch(function (error) {
            if (error.response) {

                

            }
        });
    return (answer);
}
export function loadCertificates(page, size) {
    try {
        findAllCertificates(page, size);
    } catch (error) {
        
    }
}



function showCertificates(certificates) {
    let rs = [];
    certificates.forEach((certificate) => {
        
        let tagsFormatString = '';
        certificate.tags.forEach((tag) => {
            tagsFormatString += (tag.name + ' ');
        });
        const row = createData(certificate.id, certificate.name, certificate.create_date, tagsFormatString, certificate.description, certificate.price, certificate.duration);
        
        rs.push(row);

    }
    );
    dispatch(loadAll(rs));
    return rows;
};

function createData(id, name, datetime, tags, description, price, duration) {
    return {
        id,
        name,
        datetime,
        tags,
        description,
        price,
        duration
    };
}