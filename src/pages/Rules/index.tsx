import { Link } from 'react-router-dom'

import { ReactComponent as IconCheck } from './../../assets/images/icon-check.svg'
import css from './rules.module.css'

const Rules = () => {
  return (
    <section className={css.section}>
      <article className={css.article}>
        <h2 className={` ${css.rules} ${css.headings}`}>Rules</h2>
        <h3 className={css.headings}>Objective</h3>
        <p>
          Be the first player to connect 4 of the same colored discs in a row
          (either vertically, horizontally, or diagonally).
        </p>
        <h4 className={css.headings}>How to play</h4>
        <ul className={css['how-to-play']}>
          <li className={css['first-rule']}>Red goes first in the game.</li>
          <li>
            Players must alternate turns, and only one disc can be dropped in
            each turn.
          </li>
          <li>The game ends when there is a 4-in-a-row or a stalemate.</li>
          <li>
            The starter of the previous game goes second on the next game.
          </li>
        </ul>
        <Link to='/' className={css['back-to-main']}>
          <IconCheck width={64} height={64} />
        </Link>
      </article>
    </section>
  )
}
export default Rules
