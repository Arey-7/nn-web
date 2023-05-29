import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from '@fortawesome/free-solid-svg-icons'

export default function ThemeButton() {
    return(
        <div className="fixed bottom-3 right-3 bg-inherit text-white rounded-full w-10 h-10 p-3 hover:invert">
            <FontAwesomeIcon icon={faSun}/>
        </div>
    );
};