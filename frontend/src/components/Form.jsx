/* eslint-disable react/prop-types */
import "../sass/components/_form.scss"
import "../sass/components/_button.scss"
import Input from "./utilsComponents/Input"
import { useState } from "react";
import Radio from "./utilsComponents/Radio";
import { useForm } from "react-hook-form"


export default function Form({onFormSubmission, storyboardParams, snackBar, setVideoTitle}){
    const [baseApiCall,setBaseApiCall] = useState({
        body:{},
        params:{"height":720, "format":"hls"}
        });
    //Form validation hook
    const {register,handleSubmit,formState: { errors }} = useForm({mode:"onChange"})
    const [fileUrls, setFileUrls] = useState({});
    
    //Used to save the uploaded images url
    const handleFileUpload = (name, url) => {
        setFileUrls((prevUrls) => ({
          ...prevUrls,
          [name]: url,
        }));
      };

    const handleRadioChange=(name, value)=> {
        setBaseApiCall(prevState => ({
            ...prevState,
            params: {
                ...prevState.params,
                [name]: value
            }
        }));
    }
      
    const onSubmit = (data) =>{
        let submissionData={...baseApiCall};
        //turn the data object into a key-pair array and filter out all the FileList objects.
        // personal note: Object.entries => convert object to Array
        // Object.fromEntries => convert array back into Object.
        submissionData.body = Object.fromEntries(
            Object.entries(data).filter(([key,value])=>{!(value instanceof FileList)})
        )
        for (let key in fileUrls){
            submissionData.body[key]=fileUrls[key];
        }
        onFormSubmission(submissionData)
    }
    
    //mutate the parameters of the Storyboard to lowecase 
    const lowerCasedParams = storyboardParams.data.map(obj=>{
        const lowerCasedObj = Object.fromEntries(
            Object.entries(obj).map(([key,value])=>
            [key, typeof value ==="string"? value.toLowerCase() : value])
        )
        return lowerCasedObj
    })

    //Storting the inputs: first all text params then media params 
    const sortedInputs = [...lowerCasedParams].sort((a,b)=>{
        if (a.description==="text" && b.description!=="text"){
            return -1;
        }
        if (a.description !=="text" && b.description =="text"){
            return 1;
        }
        return 0;
    })

    const storyboardInputs = sortedInputs.map((placeholder, index)=>(
        <Input
        key={index}
        type={placeholder.description}
        placeholder={placeholder.key}
        register={register}
        errors={errors}
        handleFileUpload={handleFileUpload}
        snackBar={snackBar}
        />
    ));

    return (<>
    <form onSubmit={handleSubmit(onSubmit)} className="container">
        <h2 className="h2">Generate your personalized video</h2>
        <Radio numOfButtons={2} text={["720p","1080p"]} name={"height"} onRadioChange={handleRadioChange}></Radio>
        <Radio numOfButtons={2} text={["HLS","MP4"]} name={"format"} onRadioChange={handleRadioChange}></Radio>
        <Input type={"text"} placeholder={"Video Title"} onChange={setVideoTitle}/>
        <div className="container__inputs">
            {storyboardInputs}
        </div>
        <div className="container__button">
        <button type="submit" className="btn flex-center btn--light-blue">Generate!</button>
        </div>
    </form>
    </>)
}