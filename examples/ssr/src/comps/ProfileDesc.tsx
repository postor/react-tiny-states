import { selectedProfileDesc } from "./stores"

const ProfileDesc = () => {
  let [desc, pending] = selectedProfileDesc.use()
  return (<div>
    <p>{pending ? `desc loading....` : `desc: ${desc}`}</p>
  </div>)
}

export default ProfileDesc