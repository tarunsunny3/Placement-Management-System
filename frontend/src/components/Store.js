import React, {useState} from  'react';
const initialState = {
  userDetails: {

  }
}
export const Context = React.createContext();

const Store = ({children})=>{
  const [userState, setUserState] = useState(initialState);
  return (
    <Context.Provider value={[userState, setUserState] }>{children}</Context.Provider>
  )
}
export default Store;
