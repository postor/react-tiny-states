import { useStore } from "react-tiny-states"
import { selectedProfileDesc } from "./stores"

const ProfileDesc = () => {
  let [desc, pending] = useStore(selectedProfileDesc)
  return (<div>
    <p>{pending ? `desc loading....` : `desc: ${desc}`}</p>
  </div>)
}

export default ProfileDesc