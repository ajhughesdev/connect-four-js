import { Link } from 'react-router-dom'

import css from './ingameMenu.module.css'

interface IngameMenuProps {
  toggleMenu: () => void
  restartGame: () => void
}

const IngameMenu = ({ restartGame, toggleMenu }: IngameMenuProps) => {
  return (
    <div className={css.modal}>
      <div className={css['modal-content']}>
        <h3 className={css.pause}>pause</h3>
        <div className={css.buttons}>
          <button onClick={toggleMenu}>continue game</button>
          <button onClick={restartGame}>restart</button>
          <Link to='/' className={css['back-to-main']}>
            Quit Game
          </Link>
        </div>
      </div>
    </div>
  )
}

export default IngameMenu
