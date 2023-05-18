import { ReactComponent as Player1 } from './../../assets/images/player-one.svg'
import { ReactComponent as Player2 } from './../../assets/images/player-two.svg'

import css from './playerScoreBoard.module.css'

interface PlayerScoreBoardProps {
  player: string
  score: number
}

const PlayerScoreBoard = ({ player, score }: PlayerScoreBoardProps) => {
  return (
    <div className={css['player-board']}>
      {player === '1' ? (
        <Player1 className={css['player-board-img']} />
      ) : (
        <Player2 className={`${css['player-board-img']} ${css.player2}`} />
      )}
      <p>player {player}</p>
      <p>{score}</p>
    </div>
  )
}

export default PlayerScoreBoard
