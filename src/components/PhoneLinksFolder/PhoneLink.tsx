//React icons...
import {AiOutlineArrowRight, AiFillLinkedin} from "react-icons/ai"
import {PiGithubLogoFill} from "react-icons/pi"
import { BsYoutube } from 'react-icons/bs';

//Styles...
import "./PhoneLink.scss"

interface PhoneLinkProps {
    i: number;
    item: {
        URL: string;
        userInput: string;
        linkType: string
    }
}


const PhoneLink = ({i, item}: PhoneLinkProps) => {

    const LogoMatch = (linkType: string) => {
        if(linkType === "GitHub") return <PiGithubLogoFill/>
    
        if(linkType === "Youtube") return <BsYoutube/>
    
        if(linkType === "Linkedin") return <AiFillLinkedin/>

        return <></>
    }
    
    return (
        <a 
            key={i} 
            href={item.URL + item.userInput} 
            target='_blank'
            className={`link-btn ${item.linkType === "GitHub" ? "github" : item.linkType == "Youtube" ? "youtube" : "linkedin"}`}
            //style={{backgroundColor: colorMatch(item.linkType)}}
        >
            <span>
              {LogoMatch(item.linkType)}
              {item.linkType}
            </span>
            <AiOutlineArrowRight/>
        </a>
    );
};

export default PhoneLink;