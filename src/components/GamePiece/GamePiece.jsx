import css from './../../pages/ConnectFour/connectFour.module.css'

const GamePiece = ({ player, row }) => {
  const boardHeight = 5
  const rowHeight = 34
  const gap = 12.5
  const bottom = (boardHeight - row) * (rowHeight + gap)
  return (
    <div
      className={css['game-piece']}
      data-type={player}
      style={{ bottom, transition: 'bottom 450ms ease-in' }}
    ></div>
  )
}

export default GamePiece
