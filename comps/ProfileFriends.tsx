import { selectedProfileFriends } from "./stores"

const ProfileFriends = () => {
  let [friends = [], pending] = selectedProfileFriends.use()
  return (<div>
    <p>{pending ? `friends loading....` : `friends: ${friends.join(',')}`}</p>
  </div>)
}

export default ProfileFriends