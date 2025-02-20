import ProfileAD from "./ProfileAD"
import ProfileDesc from "./ProfileDesc"
import ProfileFriends from "./ProfileFriends"
import { selectedProfile } from "./stores"

const Profile = () => {
  let [profile] = selectedProfile.use()
  return (<div>
    <h1>{profile}</h1>
    <ProfileDesc />
    <ProfileFriends />
    <ProfileAD />
  </div>)
}

export default Profile