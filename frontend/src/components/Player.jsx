import { useEffect, useState } from "react"
import "../sass/components/_player.scss";

export default function Player({url, title}){
    const [buttonClicked, setButtonClicked] = useState(false);
    const handleClick = () =>{
        setButtonClicked(true);
    }
    useEffect(()=>{
        var player_options = {
            interactive:true,
            size:"hd",
            src:url,
            idm_logo:false,
            autoplay:false,
            mute:true,
            cta_analytics:[
                ["idm-cta-btn1", "Like"],
                ["idm-cta-btn2", "Dislike"]
            ]
        }
        idmPlayerCreate(player_options, "idm-player")
    },[url])


    return <>
    <header className="header">
        <h2>{title}</h2>
    </header>
    <div id="idm-player"></div>
   
    <div className="btn__container">
    {!buttonClicked &&
    <> 
        <button className="idm-cta-btn1" onClick={handleClick}>
            <img  src="../../public/thumbsup.svg" alt="like button"/>
        </button>
        <button className="idm-cta-btn2" onClick={handleClick}>
            <img src="../../public/thumbsdown.svg" alt="dislike button"/>
        </button>
    </>
        }
        {buttonClicked &&
        <p>Thank you for your input!</p>
        }
    </div>
    
    
    </>
}