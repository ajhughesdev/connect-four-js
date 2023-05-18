import { ReactComponent as Logo } from './../../assets/images/logo.svg'
import css from './header.module.css'

interface HeaderProps {
  toggleMenu: () => void
  restartGame: () => void
}

const Header = ({ toggleMenu, restartGame }: HeaderProps) => {
  return (
    <header className={css.header}>
      <nav className={css['nav-menu']}>
        <button onClick={toggleMenu} className={css.button}>
          menu
        </button>
        <Logo className={css.logo} width={46} />
        <button onClick={restartGame} className={css.button}>
          restart
        </button>
      </nav>
    </header>
  )
}

export default Header
