import './sass/main.scss'
import Dropdown from './components/Dropdown'
import { useEffect, useState } from 'react'

function App() {
  const [selectedSB, setSelectedSB] = useState(null);
  const [formData, setFormData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);



  const handleDropdownSelection = (storyBoardId) =>{
    setSelectedSB(storyBoardId);
  }
  useEffect(()=>{
    const fetchStoryboardParams = async ()=>{
      try{
        const response = await fetch(`/api/${selectedSB}`)
        if (!response.ok){
            console.log("Could not fetch Storyboard list")
        }
        const data = await response.json()
        console.log(data)
    }
    catch(e){
        console.error("Something went wrong", e)
    }}
    selectedSB ? fetchStoryboardParams(): null},[selectedSB])

  return (
    <>
      {!selectedSB &&
      <div className="section__dropdown">
      <Dropdown onSelectionChange={handleDropdownSelection}/>
      </div>
      }
     

      
      {selectedSB && 
      <div className="section__form">
        <h1>The Selected Storyboard ID is: {selectedSB}</h1>
      </div>
      }
      {/* {formData &&
      
      <div className="section__player">
        
      </div>
      } */}
    </>
  )
}

export default App
