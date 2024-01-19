import "../../sass/components/_radio.scss"
import { useState } from "react"

export default function Radio({name, numOfButtons = 2, text, onRadioChange}){
    const [selectedValue, setSelectedValue] = useState(text[0])

    const handleChange = (e)=>{
        setSelectedValue(e.target.value);
        let valueToSend = name;
        // to remove the p from 1080p/720p
        name.endsWith("p") ? valueToSend = name.slice(0,-1) : valueToSend=name;
        onRadioChange(valueToSend, e.target.value)
    }



    return (
    <>
    <div className="radio-inputs">
            {text.slice(0, numOfButtons).map((item, index) => (
                <label key={index} className="radio-inputs__label">
                    <input 
                        type="radio" 
                        name={name} 
                        value={item} 
                        onChange={handleChange} 
                        checked={selectedValue === item} 
                    />
                    <span className="radio-inputs__label--name">{item}</span>
                </label>
            ))}
        </div>
    </>
    )
}