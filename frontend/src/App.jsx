import './sass/main.scss'
import StoryboardSelector from './components/StoryboardSelector'
import Form from './components/Form'
import { useEffect, useState } from 'react'
import Loader from './components/utilsComponents/Loader';
import Player from './components/Player';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [selectedSB, setSelectedSB] = useState(null);
  const [storyboardParams, setStoryboardParams] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  const [isLoadingTransition, setIsLoadingTransition] =useState(false);


  // Gets a list of SB for the account to be used in the StotryboardSelector component
  useEffect(()=>{
    const fetchStoryboardParams = async ()=>{
      try{
        const response = await fetch(`/api/${selectedSB}`)
        if (!response.ok){
            notify(response)
        }
        const data = await response.json()
        setStoryboardParams(data);
        setIsLoadingTransition(false)
    }
    catch(e){
        console.error(e.message)
        notify(e.message)
    }}
    selectedSB ? fetchStoryboardParams(): null},[selectedSB])

  const notify = (error)=>{
    toast.error(error,{
        position:"bottom-center",
        autoClose:5000,
        closeOnClick:true,
        theme:"light",
        hideProgressBar: false,
        closeButton:true
    } )
}
  

  const handleDropdownSelection = (storyBoardId) =>{
    setIsLoadingTransition(true)
    setSelectedSB(storyBoardId);
  }

  // To generate a video
 const handleFormData= async (data)=>{
  setIsLoadingTransition(true)
    try{
      const response = await fetch(`/api/${selectedSB}?height=${data.params.height}&format=${data.params.format.toLowerCase()}`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(data.body)
      })
      const responseData = await response.json()
      if (response.ok && responseData && responseData.check_status_url){
        setVideoUrl(responseData.output.video[0].links.url)
        checkVideoStatus(responseData.check_status_url)
        return responseData
      }
      else{
        notify(responseData.error.message[0].error_description)
        setIsLoadingTransition(false)
      }
    }catch(e){
      notify(e)
    }
  }

  // Checks the status of the video every 3 seconds (Up to 40 time
  const checkVideoStatus = async(url, attempts = 0)=>{
    try{
      const response = await fetch(url);
      const data = await response.json();
      if (data.status ==="VIDEO_AVAILABLE"){
        setIsVideoAvailable(true);
        setIsLoadingTransition(false);
      }
      else if(attempts < 40){
        setTimeout(()=> checkVideoStatus(url, attempts + 1), 3000);
      }
      else{
        notify(`Final status after 2 minutes ${data.status})`)
        setIsLoadingTransition(false);
      }
    }catch(e){
      notify(`Error generating video ${e.message}`)
      setIsLoadingTransition(false);
    }
  }


    function renderDropdown(){
      return (!selectedSB && !isVideoAvailable) && (
        <div className="section__dropdown">
          <StoryboardSelector
           onSelectionChange={handleDropdownSelection} 
           loadingTransition={[isLoadingTransition,setIsLoadingTransition]}
           snackBar={notify}
           />
        </div>
      )
    }
    
    function renderForm (){
      return storyboardParams && !isLoadingTransition && !isVideoAvailable &&(
        <div className="section__form">
          <Form 
            onFormSubmission={handleFormData}
            storyboardParams={storyboardParams}
            snackBar={notify}
           ></Form>
        </div>
      )
    }
    function renderPlayer() {
      return isVideoAvailable && (
        <div className="section__player">
          <Player url={videoUrl}></Player>
        </div>
      );
    }

  return (
    <>
      {isLoadingTransition && 
      <div className="flex-center abs-center">
        <Loader size="large" color="black"></Loader>  
      </div>
      }
      <ToastContainer/>

      {renderDropdown()}
      {renderForm()}
      {renderPlayer()}
      
 
   
    </>
  )
}

export default App
