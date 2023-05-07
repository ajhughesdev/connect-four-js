import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { ReactComponent as Logo } from './../../assets/images/logo.svg'
import { ReactComponent as BlackBoard } from './../../assets/images/board-layer-black-small.svg'
import { ReactComponent as WhiteBoard } from './../../assets/images/board-layer-white-small.svg'

import GamePiece from '../../components/GamePiece/GamePiece'

import css from './connectFour.module.css'

interface Cell {
  player: string
  animate?: boolean
  highlight?: boolean
}

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<string>('1')
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)
  const [player1Score, setPlayer1Score] = useState<number>(0)
  const [player2Score, setPlayer2Score] = useState<number>(0)
  const [timer, setTimer] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const timerRef = useRef<number>()
  const [winner, setWinner] = useState<string | null>(null)
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)


  const toggleMenu = () => {
    setMenuVisible((prevMenuVisible) => {
      if (prevMenuVisible) {
        if (remainingTime !== null) {
          startTimer(remainingTime)
        }
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          setRemainingTime(timer)
        }
      }
      return !prevMenuVisible
    })
  }

  const restartGame = () => {
    setBoard(initializeBoard())
    setCurrentPlayer('red')
    setPlayer1Score(0)
    setPlayer2Score(0)
    setWinner(null)
    clearInterval(timerRef.current)
    setTimer(null)
    setGameStarted(false)
    setMenuVisible(false)
  }

  const initializeBoard = (): Cell[][] => {
    const newBoard: Cell[][] = []
    for (let row = 0; row < 6; row++) {
      newBoard.push([])
      for (let col = 0; col < 7; col++) {
        newBoard[row].push({ player: '', animate: false })
      }
    }
    return newBoard
  }

  const startTimer = (startTime: number = 15) => {
    setTimer(startTime)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = window.setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerRef.current)
          if (currentPlayer === '1') {
            setPlayer2Score(player2Score + 1)
          } else {
            setPlayer1Score(player1Score + 1)
          }
          setBoard(initializeBoard())
          setCurrentPlayer(currentPlayer === '1' ? '2' : '1')
          setTimer(null)
        }
        return (prevTime ?? 0) - 1
      })
    }, 1000)
  }

  const handleClick = (col: number): void => {
    if (!gameStarted) {
      setGameStarted(true)
      startTimer()
    }

    for (let row = 5; row >= 0; row--) {
      if (board[row][col].player === '') {
        const newBoard = [...board]
        newBoard[row][col] = { player: currentPlayer, animate: true }
        setBoard(newBoard)
        setTimeout(() => {
          newBoard[row][col] = { player: currentPlayer, animate: false }
          setBoard(newBoard)
          setCurrentPlayer(currentPlayer === '1' ? '2' : '1')
        }, 150)
        clearInterval(timerRef.current)
        startTimer()

        const winningCells = checkWin(row, col, currentPlayer)
        if (winningCells.length > 0 || timer === 0) {
          clearInterval(timerRef.current)
          setWinner(currentPlayer)
          for (const cell of winningCells) {
            newBoard[row][col] = { player: currentPlayer, animate: true, highlight: true }
            newBoard[cell.row][cell.col].highlight = true
            setBoard(newBoard)
            setTimeout(() => {
              newBoard[row][col] = { player: currentPlayer, animate: false, highlight: true }
              newBoard[cell.row][cell.col].highlight = true
              setBoard(newBoard)
              setCurrentPlayer(currentPlayer === '1' ? '2' : '1')
            }, 150)

          }
          setBoard(newBoard)
          if (currentPlayer === '1') {
            setPlayer1Score(player1Score + 1)
          } else {
            setPlayer2Score(player2Score + 1)
          }
          setGameStarted(false)
        }

        setCurrentPlayer(currentPlayer === '1' ? '2' : '1')
        break
      }
    }
  }

  const playAgain = (): void => {
    setBoard(initializeBoard())
    setCurrentPlayer('1')
    setWinner(null)
    setTimer(null)
  }

  const checkWin = (
    row: number,
    col: number,
    player: string
  ): { row: number; col: number }[] => {
    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ]

    for (const direction of directions) {
      let count = 0
      let winningCells: { row: number; col: number }[] = []
      for (let i = -3; i <= 3; i++) {
        const newRow = row + i * direction.y
        const newCol = col + i * direction.x

        if (
          newRow >= 0 &&
          newRow < 6 &&
          newCol >= 0 &&
          newCol < 7 &&
          board[newRow][newCol].player === player
        ) {
          count++
          winningCells.push({ row: newRow, col: newCol })
          if (count === 4) {
            return winningCells
          }
        } else {
          count = 0
          winningCells = []
        }
      }
    }

    return []
  }

  const handleMouseEnter = (col: number): void => {
    setHoveredColumn(col)
  }

  const handleMouseLeave = (): void => {
    setHoveredColumn(null)
  }

  const isColumnFull = (col: number): boolean => {
    return board[0][col].player !== ''
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
      {winner && (
        <div className="modal">
          <div className="modal-content">
            <h3>{winner} wins!</h3>
            <button onClick={playAgain}>Play Again</button>
          </div>
        </div>
      )}
      {menuVisible && (
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
                  {window.matchMedia('(min-width: 768px)').matches &&
                    rowIndex === 0 &&
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
                      highlight={cell.highlight}
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
