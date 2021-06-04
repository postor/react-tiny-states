import { useEffect } from "react"
import { selectedProfileAD } from "./stores"

const ProfileAD = () => {
  useEffect(() => {
    console.log('ProfileAD mounted')
    return () => console.log('ProfileAD unmounted')
  }, [])
  let [ad, pending] = selectedProfileAD.use()
  return (<div>{pending ? 'loading AD ...' : ad}</div>)
}

export default ProfileAD