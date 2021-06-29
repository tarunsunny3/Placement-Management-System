import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from './AppContext';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const { user } = React.useContext(AppContext);
  return (
    <Route {...rest} render={
      props => {
        //This means the App.js is still setting the cookie value into the user
        if(user.id==="1" || user.id===undefined){
          return <p>Loading....</p>;
        }
        if (user.id !== null && (role === "both" || user.role === role)) {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={
            {
              pathname: '/unauthorized',
              state: {
                from: props.location
              }
            }
          } />
        }
      }
    } />
  )
}

export default ProtectedRoute;
