import { ReactComponent as Logo } from './../../assets/images/logo.svg'
import css from './header.module.css'

interface HeaderProps {
  toggleMenu: () => void
  restartGame: () => void
  sound: boolean
  toggleSound: () => void
}

const Header = ({ toggleMenu, restartGame, sound, toggleSound }: HeaderProps) => {
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
      <button onClick={toggleSound} className={css['sound-button']} aria-label='sound-toggle'>
        {sound ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z" fill='#5C2DD5' /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 7.358v15.642l-8-5v-.785l8-9.857zm3-6.094l-1.548-1.264-3.446 4.247-6.006 3.753v3.646l-2 2.464v-6.11h-4v10h.843l-3.843 4.736 1.548 1.264 18.452-22.736z" fill="#5C2DD5" /></svg>
        )}
      </button>
    </header>
  )
}

export default Header
