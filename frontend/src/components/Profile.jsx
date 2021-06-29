import React, {useState, useEffect} from 'react'
import AppContext from './AppContext';
const Profile = () => {
  const { user } = React.useContext(AppContext);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    user!=null
    &&

    <div>
      {console.log(user)}
      {
      user.details === undefined || user.details.profilePictureLink === undefined
      ?
      <p>Loading...</p>
      :
      <div style={{margin: "2% 10%", width:"500px", height:"500px"
      }}>
      <img style={{width: "500px", height: "400px",objectFit: "contain"}} loading="eager" alt="userImage" src={user.details.profilePictureLink} />

      </div>
    }
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent porta elementum arcu. Duis convallis rutrum eros, a cursus elit vehicula in. Vivamus ullamcorper venenatis aliquet. Quisque tempor massa sem, quis pellentesque sem ultrices nec. Sed in ligula dolor. Maecenas sed ex lacus. Duis nec maximus nibh. In ligula leo, pellentesque non erat sit amet, mattis sollicitudin sem. Aenean accumsan nulla et mattis semper.</p>
    </div>
  )
}

export default Profile
