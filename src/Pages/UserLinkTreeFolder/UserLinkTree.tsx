//React...
import {useState, useEffect} from 'react';
import {useLocation, Link} from "react-router-dom"

//Components...
import PhoneLink from '../../components/PhoneLinksFolder/PhoneLink';

//Firebase...
import {database} from "../../firebase.js"
import { doc, getDoc } from 'firebase/firestore';

//Styles...
import "./UserLinkTree.scss"

interface UserLinkLayout {
    email: string,
    firstName: string,
    image: string,
    lastName: string,
    userId: string,
    userLinks: LinkInfo[]
    username: string,
}

interface LinkInfo{
    URL: string, 
    linkType: string, 
    userInput: string
}

const UserLinkTree = () => {
    const location = useLocation();
    const userID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  
    const [userData, setUserData] = useState<UserLinkLayout | null>(null)
    const [loading, setLoading] = useState(true); // Add a loading state


    const [copied, setCopied] = useState(false);

    const copyUrlFunction = () => {
        // Construct the full URL
        const url = `${window.location.origin}${location.pathname}`;
        
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    }

    const getData = async () => {
            if (userID) {
                const docRef = doc(database, "userInfo", `${userID}`)
                const userInfo = await getDoc(docRef)
    
                if (userInfo.exists()) {
                    const userDataFromFirestore = userInfo.data() as UserLinkLayout;
                    setUserData(userDataFromFirestore);
                } 
            }
            setLoading(false)
            console.log(userData)
    }

    useEffect(() => {
       getData()
    }, [userID])

    return (
        <div className='linktree-bg'>
            <nav>
                <Link to="/">Back</Link>
                <button onClick={copyUrlFunction}>
                    {
                        copied ? "Copied!" : "Copy URL"
                    }
                </button>
            </nav>
            <img 
                src={userData?.image || ""}
                alt="profile picture but in the preview page"
            />
            {userData?.firstName && userData?.lastName && (
                <h3>{userData.firstName} {userData.lastName}</h3>
            )}
            <p>{userData?.email}</p>
            {loading ? (
                <div>Loading...</div>
            ) : (
                userData?.userLinks.map((link: any, i: number) => (
                    <PhoneLink
                        key={i}
                        i={i}
                        item={link}
                    />
                ))
            )}
        </div>
    );
};

export default UserLinkTree;