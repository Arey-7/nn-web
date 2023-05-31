import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeButton(){
    const classStyle = [];
    return(
        <button className="fixed bottom-3 right-3 bg-black text-white flex p-3 rounded-full hover:invert">
            <FontAwesomeIcon icon={faSun}/>
        
        </button>
    );
};