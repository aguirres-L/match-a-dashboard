import { useState } from "react";
import MatchUI from "./components/MatchUI";
import LoginComponent from "./pages/LoginComponent.jsx";
export default function Main() {

    const [isUserVerification, setIsUserVerification] = useState(null)

    return (
        <>
            {!isUserVerification
                ? <LoginComponent setIsUserVerification={setIsUserVerification} />
                : <MatchUI />
            }

        </>
    )
}