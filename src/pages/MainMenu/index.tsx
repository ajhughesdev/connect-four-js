import MainMenuBtn from '../../components/MainMenuBtn/MainMenuBtn'
import { ReactComponent as Logo } from './../../assets/images/logo.svg'

import css from './mainMenu.module.css'

const MainMenu = () => {
  return (
    <nav className={css.nav}>
        <Logo width={58} height={61} />
        <div className={css['nav-links']}>
          <MainMenuBtn />
        </div>
    </nav>
  )
}
export default MainMenu