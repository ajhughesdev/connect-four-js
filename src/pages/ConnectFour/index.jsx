import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ReactComponent as Logo } from './../../assets/images/logo.svg'

// import GamePiece from './../../components/GamePiece/GamePiece'

import { ReactComponent as BlackBoard } from './../../assets/images/board-layer-black-small.svg'
import { ReactComponent as WhiteBoard } from './../../assets/images/board-layer-white-small.svg'

import css from './connectFour.module.css'

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

const ConnectFour = () => {
  const [board, setBoard] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState('first')
  const [pauseMenu, setPauseMenu] = useState(false)
  const [hoveredColumn, setHoveredColumn] = useState(null)

  const toggleMenu = () => {
    setPauseMenu(!pauseMenu)
  }

  const restartGame = () => {
    setBoard(initializeBoard())
    setCurrentPlayer('first')
    setPauseMenu(false)
  }

  const initializeBoard = () => {
    const newBoard = []
    for (let row = 0; row < 6; row++) {
      newBoard.push([])
      for (let col = 0; col < 7; col++) {
        newBoard[row].push('')
      }
    }
    return newBoard
  }

  const handleClick = (col) => {
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === '') {
        const newBoard = [...board]
        newBoard[row][col] = { player: currentPlayer, animate: true }
        setBoard(newBoard)
        setTimeout(() => {
          newBoard[row][col] = { player: currentPlayer, animate: false }
          setBoard(newBoard)
          setCurrentPlayer(currentPlayer === 'first' ? 'second' : 'first')
        }, 150)
        break
      }
    }
  }

  const handleMouseEnter = (col) => {
    setHoveredColumn(col)
  }

  const handleMouseLeave = () => {
    setHoveredColumn(null)
  }

  const isColumnFull = (col) => {
    return board[0][col] !== ''
  }

  useEffect(() => {
    setBoard(initializeBoard())
  }, [])

  return (
    <div className={css.game}>
      <nav className={css['nav-btns']}>
        <button onClick={toggleMenu}>menu</button>
        <Logo className={css.logo} width={40} height={40} />
        <button onClick={restartGame}>restart</button>
      </nav>
      {pauseMenu && (
        <div className={css.modal}>
          <div className={css['modal-content']}>
            <h3>pause</h3>
            <button onClick={toggleMenu}>continue game</button>
            <button onClick={restartGame}>restart</button>
            <Link to='/' className={css['back-to-main']}>
              Quit
            </Link>
          </div>
        </div>
      )}

      <div className={css['board-container']}>
        <BlackBoard className={css['black-board']} width={335} height={320} />
        <div className={css.board}>
          {board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={css.row}
              data-type={`row${rowIndex}`}
            >
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={css.cell}
                  onClick={() => handleClick(colIndex)}
                  onMouseEnter={() => handleMouseEnter(colIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  {rowIndex === 0 &&
                    hoveredColumn === colIndex &&
                    !isColumnFull(colIndex) && (
                      <div className='arrow'>
                        <span role='img' aria-label='arrow'>
                          ⬇️
                        </span>
                      </div>
                    )}
                  {cell.player && (
                    <GamePiece
                      player={cell.player}
                      row={cell.animate ? -1 : rowIndex}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <WhiteBoard className={css['white-board']} width={335} height={310} />
      </div>
    </div>
  )
}
export default ConnectFour
