import axios from "axios";

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export const addPayPalScript = async (setCallBack)=>{
  const { data : clientId } = await axios.get("/api/config/paypal");
  
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `http://localhost:5000/sdk/js?client-id=${clientId}`;
  script.async = true;
  script.onload = ()=>{
    setCallBack(true);
  }
  document.body.appendChild(script);
}


// generate fake paypal payment id
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}