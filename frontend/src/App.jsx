import './sass/main.scss'
import StoryboardSelector from './components/StoryboardSelector'
import Form from './components/Form'
import { useEffect, useState } from 'react'
import Loader from './components/utilsComponents/Loader';
import RouterComponent from './components/utilsComponents/RouterComponent';
import Player from './components/Player';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router } from 'react-router-dom';



function App() {
  // states
  const [selectedSB, setSelectedSB] = useState(null);
  const [storyboardParams, setStoryboardParams] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  const [isLoadingTransition, setIsLoadingTransition] =useState(false);
  const [videoTitle, setVideoTitle] = useState("your personalized video")


  // to enable using query param to change videos
  useEffect(() => {
    if (videoUrl) {
      setIsVideoAvailable(true);
    } else {
      setIsVideoAvailable(false);
    }
  }, [videoUrl]);

  // Gets a list of SB for the account to be used in the StotryboardSelector component
  useEffect(() => {
    if (selectedSB) {
      setIsLoadingTransition(true);
      fetchStoryboardParams(selectedSB);
    }
  }, [selectedSB]);

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
    }
  }
  // toast/snackbar envoke function
  const notify = (error)=>{
    toast.error(error,{
        position:"bottom-center",
        autoClose:5000,
        theme:"light",
        hideProgressBar: false,
        closeButton:true
    } )
  }
  const handleDropdownSelection = (storyBoardId) =>{
    setIsLoadingTransition(true)
    console.log(`Storyboard ${storyBoardId} was selected!`)
    setSelectedSB(storyBoardId);
  }

  // Sends data taken from Form component to backend to generate a video
  const handleFormData= async (data)=>{
    setIsLoadingTransition(true)
      try{
        console.log(`Generating video from SB:${selectedSB} using format:${data.params.format} and height:${data.params.height}`)
        const response = await fetch(`/api/${selectedSB}?height=${data.params.height}&format=${data.params.format.toLowerCase()}`,{
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(data.body)
        })
        console.log(JSON.stringify(data.body))
        const responseData = await response.json()
        if (!response.ok){
          console.error(`Request to generate video failed:${responseData.error.message[0].error_description}`)
          notify(responseData.error.message[0].error_description)
          setIsLoadingTransition(false)
        }
        setVideoUrl(responseData.output.video[0].links.url)
        console.log(`Linked recieved in response: ${responseData.output.video[0].links.url}`)
        checkVideoStatus(responseData.check_status_url)
        return responseData
        }catch(e){
        notify(e)
      }
    }

  // Checks the status of the video every 3 seconds (Up to 40 time
  const checkVideoStatus = async(url, attempts = 1)=>{
    try{
      const response = await fetch(url);
      const data = await response.json();
      console.log(`Checking VIDEO_AVAILABLE status in 3 seconds interval`)
      if (data.status ==="VIDEO_AVAILABLE"){
        console.log("VIDEO AVAILABLE!!")
        setIsVideoAvailable(true);
        setIsLoadingTransition(false);
      }
      if(attempts < 40){
        console.log(`Video status: ${data.status}, attempt: ${attempts}... running again`)
        setTimeout(()=> checkVideoStatus(url, attempts + 1), 3000);
      }
      else{
        console.log(`Final status after 2 minutes: ${data.status}`)
        notify(`Final status after 2 minutes ${data.status})`)
        setIsLoadingTransition(false);
      }
    }catch(e){
      console.error(`Failed to retrieve video:${e}`)
      notify(`Failed to retrieve video${e.message}`)
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
            setVideoTitle={setVideoTitle}
           ></Form>
        </div>
      )
    }
    function renderPlayer() {
      return isVideoAvailable && (<>
        <div className="section__player">
          <Player url={videoUrl} title={videoTitle}></Player>
        </div>
        <footer className="section__player--footer">
              <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Aliquam aut asperiores adipisci ex obcaecati, delectus officiis incidunt illum tenetur eaque explicabo provident 
              perspiciatis earum, quisquam nesciunt ipsa sequi blanditiis voluptates?
              Pariatur facilis ex veritatis, quo nam atque, amet corrupti harum ipsa possimus, 
              saepe cupiditate blanditiis? Ratione reiciendis ab dolores laudantium error molestias commodi aliquam hic cum, 
              fugiat numquam quam voluptatem.
              </p>
        </footer>
       
     
        </>
      );
    }


    return (
      <Router>
    
        {/* Router used here to enable to change the video using query params */}
        <RouterComponent videoUrl={videoUrl} setVideoUrl={setVideoUrl}/>
        <div className="blobs-container"></div>
          {isLoadingTransition && 
            <div className="flex-center abs-center">
              <Loader size="large" color="black"></Loader>  
            </div>
          }
          
          <div className="app-content">
          
            <ToastContainer/>
            {renderDropdown()}
            {renderForm()}
            {renderPlayer()}
          </div>

      
      </Router>
    );
  }
  
  export default App;
