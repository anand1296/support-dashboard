import CryptoJS from "crypto-js";

const useEncryption = () => {

    const encrypt = (id) => {
        return encodeURIComponent(CryptoJS.AES.encrypt(id, ""))
    }

    const decrypt = (encryptedId) => {
        // console.log(encryptedId, decodeURIComponent(encryptedId));
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), "")
        return bytes.toString(CryptoJS.enc.Utf8);
        
    }

    return { encrypt, decrypt }
}

export default useEncryption;