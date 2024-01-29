/* eslint-disable react/prop-types */
import "../../sass/components/_input.scss"
import "../../sass/layout/_loader.scss"
import { useState, } from "react";
import Loader from "./Loader";



export default function Input({type, placeholder, register, errors, handleFileUpload,snackBar, onChange}){
    const [thumbnailSrc, setThumbnailSrc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const emptyFieldMessage ='*This field is required'

    const resetThumbnail = ()=>{
        setThumbnailSrc('');
        setIsHovered(false);
        handleFileUpload(placeholder, '')
    } 
    
    const handleChange = async (event) => {
        if (onChange) {
            onChange(event.target.value)
        }
        if (type === "media") {
            const file = event.target.files[0];
            const fileSizeMb = file.size / (1024 * 1024); // Convert to MB
            //Regex to test for english letters, numbers, spaces, underscores,hyphens and period
            const englishFilenameRegex = /^[A-Za-z0-9() _.-]+$/;

            //Checks if file exists & runs regex text on filename and checks if file is of type image
            if (file && englishFilenameRegex.test(file.name) &&
            ["image/jpg", "image/jpeg", "image/png"].includes(file.type)) {
                if (fileSizeMb <= 5) {
                    await uploadFile(file);
                } 
                else {
                    snackBar("Image can't be larger than 5 MB");
                }
            } else {
                snackBar("Invalid filename, filename must be in English");
            }
        }
    };
    
    const uploadFile = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('media', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            snackBar(`Upload failed, check network`);
        }
        const data = await response.json();
        setThumbnailSrc(data.url);
        handleFileUpload(placeholder, data.url)
        return data;
    } catch (error) {
        snackBar(`Error uploading file: ${error.message}`);
        setThumbnailSrc('');
    } finally {
        setIsLoading(false);
    }
};




    return (
        <> 
            <div className={`input ${placeholder ==="Video Title" ? "no-margin-bottom" : ""}`}>   
                {type ==="media" &&(
                <div className="input__container">
                    <input 
                    type="file" 
                    className="input--media" 
                    accept="image/jpg,image/jpeg,image/png" 
                    {...register(placeholder, {required:true})}
                    onChange={(event)=>{
                        handleChange(event)
                    }}
                    name={placeholder}
                    />
                    <label htmlFor="media">{placeholder}</label>
                    {errors[placeholder] && <small className="input__container--small-danger">{emptyFieldMessage}</small>}
                    {isLoading &&
                    <div className="loader__position--media"> 
                        <Loader size="small" color="pink" className=""/>
                    </div>
                    }
                    
                    {(thumbnailSrc && !isLoading) &&
                    <img src={thumbnailSrc} 
                    className="input__image" 
                    alt="Uploaded image" 
                    onClick={resetThumbnail}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    />
                    }
                    {isHovered && <small className="input--hovertext">Click to remove</small>}
                </div>
                )}
        
                {type === "text" &&(
                <div className="input__container">
                    <input 
                    type="text" 
                    className="input--text" 
                    maxLength={placeholder === "Video Title" ? 15 : 100}
                    {...(typeof register === 'function' ? register(placeholder, { required: true }) : {})}
                    onChange={(event)=>{
                        handleChange(event)
                    }} 
                    name={placeholder}                    />
                    <label htmlFor="text">{placeholder}</label>
                    {typeof register === 'function' && errors[placeholder] && 
                    <small className="input__container--small-danger">{emptyFieldMessage}</small>
                    }
                </div>
            )}
            </div>
        </>

    )
}
