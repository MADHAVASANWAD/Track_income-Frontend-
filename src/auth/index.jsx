// islogedin
export const islogedin = () => {
  let data = localStorage.getItem("data");
  return data != null;
};

//dologin
export const dologin = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
};

//dologout
export const dologout = ()=>{
    localStorage.removeItem("data");
}


export const getToken = ()=>{
  if(islogedin()){
      return JSON.parse(localStorage.getItem("data")).token;
  }else{
    return null;
  }
}