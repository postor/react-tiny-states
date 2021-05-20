import { useStore } from "../lib"
import { selectedProfileFriends } from "./stores"

const ProfileFriends = () => {
  let [friends = [], pending] = useStore(selectedProfileFriends)
  return (<div>
    <p>{pending ? `friends loading....` : `friends: ${friends.join(',')}`}</p>
  </div>)
}

export default ProfileFriends