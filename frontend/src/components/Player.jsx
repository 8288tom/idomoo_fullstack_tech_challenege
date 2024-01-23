import { useEffect } from "react"
import "../sass/components/_player.scss";

export default function Player({url}){

    useEffect(()=>{
        var player_options = {
            interactive:true,
            size:"hd",
            src:url,
            idm_logo:false,
            autoplay:true,
            mute:true
        }
        idmPlayerCreate(player_options, "idm-player")
    },[url])


    return <>
    <div id="idm-player"></div>
    </>
}