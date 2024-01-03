//React...
import { useState } from 'react';

//Data...
import {platformsAvailable} from "../../data.js"

//React icons...
import {AiOutlineLink, AiOutlineDown} from "react-icons/ai"
import {LiaAngleUpSolid} from "react-icons/lia"

//Styles...
import "./UserInput.scss"


interface UserInputBlockProps {
    linkType: string;
    URL: string;
    setUserLinks: (value: any) => void; // Replace 'any' with a more specific type if possible
    index: number;
    LogoMatch: (linkType: string) => JSX.Element; // Assuming it returns a JSX element
    addedLinks: number;
    setAddedLinks: React.Dispatch<React.SetStateAction<number>>;
    userInput: string;
}

interface LinkTypeBlock {
    firstName: "";
    lastName: "";
    email: "";
    image: "";
    userInput?: ""
}

const UserInputBlock = (
    {
        linkType, 
        URL, 
        setUserLinks, 
        index, 
        LogoMatch, 
        addedLinks, 
        setAddedLinks, 
        userInput
    }: UserInputBlockProps) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);


    const handleFakeMenuClick = () => {
        setShowDropDown(prev => !prev)
    }

    const handleMenuClick = (newLinkType: string) => {
        setShowDropDown(false);
        const url = UrlMatch(newLinkType);

        setUserLinks((prevUserLinks: any) => {
            const updatedLinks = [...prevUserLinks];

            updatedLinks[index] = {
                ...prevUserLinks[index],
                linkType: newLinkType,
                URL: url
            };  
            return updatedLinks;
        });
        
    }

    const UrlMatch = (newLinkType: string) => {
        if(newLinkType === "GitHub") {
            console.log("github activated")
            return "https://github.com/"
        }

        if(newLinkType === "Youtube") {
            console.log("youtube activated")
            return "https://www.youtube.com/@"
        }

        if(newLinkType === "Linkedin") {
            console.log("linkedin activated")
            return "https://www.linkedin.com/in//"
        }
    }

    const removeInputBlock = () => {
        setUserLinks((prev: LinkTypeBlock[]) => {
            const newArr = [...prev];

            newArr.splice(index, 1)

            return newArr;
        })

        if(addedLinks > 0) {    
            const newAddedLinks = addedLinks - 1;
            setAddedLinks(newAddedLinks);
        }
    }

    const handleInputChange = (e:any) => {
        console.log(index)

        setUserLinks((prev: LinkTypeBlock[]) => {
            const arr = [...prev];
            arr[index].userInput = e.target.value;
            return arr
        })
    }

    return (
        <div className='single-user-input-block'>
            <div className='intro-input-block'>
                <h2>Link #{index + 1}</h2>
                <span onClick={removeInputBlock}>Remove</span>
            </div>
            <div id='first-label'>
                Platform
                <div className='dropdown-wrap'>
                    <div 
                        className='fake-dropdown' 
                        onClick={(handleFakeMenuClick)}
                    >
                        <div>
                            {LogoMatch(linkType)}{linkType}  
                        </div>
                        {!showDropDown && <AiOutlineDown/>}
                        {showDropDown && <LiaAngleUpSolid/>}
                    </div>
                    <div className={`real-dropdown ${showDropDown ? "active" : ""}`}>
                        {
                            Object.keys(platformsAvailable).map(media => {
                                return (
                                    <div 
                                        key={media} 
                                        onClick={() => handleMenuClick(media)}
                                    >
                                        {media}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div> 
            <div id='second-label'>
                Link 
                <div className='user-link-input'>
                    <AiOutlineLink/>
                    <span>{URL}</span>
                    <input placeholder={userInput} onChange={handleInputChange}/>
                </div>
            </div>
        </div>
    );
};

export default UserInputBlock;