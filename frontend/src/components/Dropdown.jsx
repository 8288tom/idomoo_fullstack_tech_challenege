/* eslint-disable react/prop-types */
import { useEffect,useState } from "react"
import "../sass/components/_dropdown.scss"

export default function Dropdown({onSelectionChange}){
    const [storyboardList, setStoryboardList] = useState([]);

    const handleItemClick = (storyBoardId) =>{
        onSelectionChange(storyBoardId)
    }
    
    useEffect(()=>{
        const fetchStoryboards = async()=>{
            try{
                const response = await fetch("/api/list_storyboards")
                if (!response.ok){
                    console.log("Could not fetch Storyboard list")
                }
                const data = await response.json()
                setStoryboardList(data)
            }
            catch(e){
                console.error("Something went wrong", e)
            }
        }
        fetchStoryboards()
    },[])

    const dropdownContent = storyboardList.map((storyboard)=>
        <li className="storyboard" key={storyboard.storyboard_id}>{storyboard.name} ({storyboard.storyboard_id})
        <a href="#" className="dropdown__title" onClick={(e)=>{
            e.preventDefault();
            handleItemClick(storyboard.storyboard_id);
        }}>&nbsp;
        <img src={storyboard.thumbnail} alt="image thumbnail" className="dropdown__img"/>
        </a>
        </li>
    )

    return (<>
        <div className="dropdown">
        <button className="dropdown__button">Choose a Storyboard</button>
            <div className="dropdown__menu">
            <ul className="list">
            {dropdownContent}
            </ul>
            </div>
        </div>
    
        </>
    )
}