import { Link } from 'react-router-dom'

import css from './../../pages/MainMenu/mainMenu.module.css'

const btnLinks = [
    { path: 'connect-four', name: 'play vs player' },
    { path: 'rules', name: 'game rules' },    
]

const MainMenuBtn = () => {
  return (
    <>
        {btnLinks.map((link, index) => (
            <Link key={index} to={link.path} className={css['main-menu-links']}>
                {link.name}  
            </Link>
        ))}
    </>
  )
}
export default MainMenuBtn