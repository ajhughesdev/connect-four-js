import React from 'react'
import css from './../../pages/ConnectFour/connectFour.module.css'

interface GamePieceProps {
  player: string
  row: number
  highlight?: boolean
}

const GamePiece: React.FC<GamePieceProps> = ({ player, row, highlight }) => {
  const boardHeight = 5
  const rowHeight = 34
  const gap = 12.5
  const bottom = (boardHeight - row) * (rowHeight + gap)
  return (
    <div
      className={`${css['game-piece']} ${highlight ? css.highlight : ''}`}
      data-type={player}
      style={{ bottom, transition: 'bottom 450ms ease-in' }}
    ></div>
  )
}

export default GamePiece
