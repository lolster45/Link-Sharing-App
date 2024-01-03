//React...
import { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";

//Firebase...
import {auth, provider} from "../../firebase.js"
import {useAuthState} from "react-firebase-hooks/auth"
import {signInWithPopup} from "firebase/auth"

//React icons...
import {FcGoogle} from "react-icons/fc"
import {IoArrowBackCircleSharp} from "react-icons/io5"

//Styles...
import "./SignUp.scss"


const SignUp = () => {
    const navigate = useNavigate()
    const [user] = useAuthState(auth)

    useEffect(() => {
        if(user) navigate("/")
    }, [])

    //Creates user account on firebase...
    const signUpWithGoogle = async (e: any) => {
        e.preventDefault()
        try {
            await signInWithPopup(auth, provider);
            navigate("/")
        } 
        catch (error) {
            console.log("failed to login")
        }
    }

    return (
        <div id="sign-up-bg">
            <form>
                <Link id="back-btn" to="/">
                    <IoArrowBackCircleSharp/>
                </Link>
                <button onClick={signUpWithGoogle}>
                    <FcGoogle/>
                    <span>Continue with Google</span>
                </button>
            </form>
        </div>
    );
};

export default SignUp;