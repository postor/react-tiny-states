import { useEffect } from "react"
import { useStore } from "../lib"
import { selectedProfileAD } from "./stores"

const ProfileAD = () => {
  useEffect(() => {
    console.log('ProfileAD mounted')
    return () => console.log('ProfileAD unmounted')
  }, [])
  let [ad, pending] = useStore(selectedProfileAD)
  return (<div>{pending ? 'loading AD ...' : ad}</div>)
}

export default ProfileAD