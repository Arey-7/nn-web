import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitter, faLinkedin, faFacebook,faBehance,faDribbble } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-400">
      <div className="mx-auto w-3/5 grid grid-flow-col p-5">
          <ul className="flex space-x-4">
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/contacts">Contacts</Link>
          </ul>
          <ul className="flex space-x-4">
            <li>
              <Link href="#"><FontAwesomeIcon icon={faBehance}/></Link>
            
            </li>
            <li>
            <Link href="#"><FontAwesomeIcon icon={faDribbble}/></Link>
            </li>
            <li>
            <Link href="#"><FontAwesomeIcon icon={faFacebook}/></Link>
            </li>
            <li>
            <Link href="#"><FontAwesomeIcon icon={faInstagram}/></Link>
            </li>
            <li>
            <Link href="#"><FontAwesomeIcon icon={faLinkedin}/></Link>
            </li>
            <li>
            <Link href="#"><FontAwesomeIcon icon={faTwitter}/></Link>
            </li>
          </ul>
          <button>Sign In</button>
      </div>
      <div className=" bg-slate-500 text-sm p-3 flex justify-between">
        <div>ar3y</div>
        <div>&copy; 2023. All rights reserved.</div>
      </div>
    </footer>
  );
}
