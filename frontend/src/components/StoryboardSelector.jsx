import { useEffect,useState } from "react"
import "../sass/components/_dropdown.scss"


export default function StoryboardSelector({onSelectionChange,loadingTransition, snackBar}){
    const [storyboardList, setStoryboardList] = useState([]);
    const [isLoadingTransition, setIsLoadingTransition] = loadingTransition;
    
useEffect(()=>{
        setIsLoadingTransition(true);
        const fetchStoryboards = async()=>{
            try{
                console.log("Listing Storyboards for Dropdown")
                const response = await fetch("/api/list_storyboards")
                if (!response.ok){
                    snackBar("Could not fetch Storyboard list")
                }
                const data = await response.json()
                setStoryboardList(data)
                setIsLoadingTransition(false);
            }
            catch(e){
                setIsLoadingTransition(false);
                snackBar(e.message)
            }
        }
        fetchStoryboards()
    },[])


    const handleDropdownSelection = (storyBoardId) =>{
        onSelectionChange(storyBoardId)
    }
    
    

    const dropdownContent = storyboardList.map((storyboard)=>
        <li className="storyboard" key={storyboard.storyboard_id}>{storyboard.name} ({storyboard.storyboard_id})
        <a href="#" className="dropdown__title" onClick={(e)=>{
            e.preventDefault();
            handleDropdownSelection(storyboard.storyboard_id);
        }}>&nbsp;
        <img src={storyboard.thumbnail} alt="image thumbnail" className="dropdown__img"/>
        </a>
        </li>
    )

    return (<>
        {storyboardList &&
        <div className="dropdown flex-center">
        <button className="dropdown__button" disabled={isLoadingTransition}>Click Here to Select a Storyboard</button>
            <div className="dropdown__menu">
            <ul className="list">
            {dropdownContent}
            </ul>
            </div>
            
        </div>
        }
        </>
    )
}