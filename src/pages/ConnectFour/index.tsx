import React, { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'

import Header from '../../components/Header/Header'
import PlayerScoreBoard from '../../components/PlayerScoreBoard/PlayerScoreBoard'
import GamePiece from '../../components/GamePiece/GamePiece'

import { ReactComponent as BlackBoard } from './../../assets/images/board-layer-black-small.svg'
import { ReactComponent as BlackBoardLarge } from './../../assets/images/board-layer-black-large.svg'
import { ReactComponent as WhiteBoard } from './../../assets/images/board-layer-white-small.svg'
import { ReactComponent as WhiteBoardLarge } from './../../assets/images/board-layer-white-large.svg'
import winSfx from './../../assets/winner.mp3'

import css from './connectFour.module.css'
import IngameMenu from '../../components/IngameMenu/IngameMenu'
import YourTurn from '../../components/YourTurn/YourTurn'

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
  const [timer, setTimer] = useState<number>(30)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const timerRef = useRef<number>()
  const [winner, setWinner] = useState<string | null>(null)
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [sound, setSound] = useState<boolean>(true)

  const toggleMenu = () => {
    setMenuVisible((prevMenuVisible) => {
      if (prevMenuVisible) {
        if (remainingTime !== null) {
          if (gameStarted) {
            startTimer(remainingTime)
          }
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
    setCurrentPlayer('1')
    setPlayer1Score(0)
    setPlayer2Score(0)
    setWinner(null)
    clearInterval(timerRef.current)
    setTimer(30)
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
          setTimer(30)
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
        })
        clearInterval(timerRef.current)
        startTimer()

        const winningCells = checkWin(row, col, currentPlayer)
        if (winningCells.length > 0 || timer === 0) {
          clearInterval(timerRef.current)
          setWinner(currentPlayer)
          for (const cell of winningCells) {
            const newBoard = [...board]
            newBoard[row][col] = {
              player: currentPlayer,
              animate: true,
              highlight: true,
            }
            newBoard[cell.row][cell.col].highlight = true
            setBoard(newBoard)
            setTimeout(() => {
              newBoard[row][col] = {
                player: currentPlayer,
                animate: false,
                highlight: true,
              }
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
    setTimer(30)
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

  const [play] = useSound(winSfx, { volume: 0.15 })

  const toggleSound = () => {
    setSound(!sound)
  }

  useEffect(() => {
    if (winner && sound) {
      play()
    }
  }, [winner])

  useEffect(() => {
    setBoard(initializeBoard())
  }, [])

  return (
    <div className={css.game}>
      <Header toggleMenu={toggleMenu} restartGame={restartGame} sound={sound} toggleSound={toggleSound} />
      <div className={css.scoreboards}>
        <PlayerScoreBoard player={'1'} score={player1Score} />
        <PlayerScoreBoard player={'2'} score={player2Score} />
      </div>
      {menuVisible && (
        <IngameMenu toggleMenu={toggleMenu} restartGame={restartGame} />
      )}
      <div className={css['board-container']}>
        <div className={css.board}>
          {window.matchMedia('(max-width: 639px)').matches ? (
            <BlackBoard
              className={css['black-board']}
            />
          ) : (
            <BlackBoardLarge
              className={css['black-board-large']}
            />
          )}

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
                  {window.matchMedia('(min-width: 1040px)').matches &&
                    rowIndex === 0 &&
                    hoveredColumn === colIndex &&
                    !isColumnFull(colIndex) && (
                      <div className='arrow'>
                        <span role='img' aria-label='arrow'>
                          <svg viewBox="0 0 38 36" className={css['arrow-svg']}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink">
                            <defs>
                              <path d="m882.01 132.377 10.932-8.157a5 5 0 0 1 5.96-.015l11.068 8.172A5 5 0 0 1 912 136.4v6.6a5 5 0 0 1-5 5h-22a5 5 0 0 1-5-5v-6.616a5 5 0 0 1 2.01-4.007Z" id="b" />
                            </defs>
                            <g transform="matrix(1 0 0 -1 -877 156)" fill="none" fillRule="evenodd">
                              <use fill="#000" filter="url(#a)" xlinkHref="#b" />
                              <path stroke="#000" strokeWidth="3" d="M895.916 121.727a6.49 6.49 0 0 1 3.877 1.271l11.068 8.173a6.5 6.5 0 0 1 2.639 5.229v6.6a6.48 6.48 0 0 1-1.904 4.596A6.48 6.48 0 0 1 907 149.5h-22a6.48 6.48 0 0 1-4.596-1.904A6.48 6.48 0 0 1 878.5 143v-6.616a6.5 6.5 0 0 1 2.613-5.21l10.932-8.157a6.49 6.49 0 0 1 3.87-1.29Z" fill={currentPlayer === '1' ? '#FD6687' : '#FFCE67'} />
                            </g>
                          </svg>
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
          {window.matchMedia('(max-width: 639px)').matches ? (
            <WhiteBoard
              className={css['white-board']}
              style={{ pointerEvents: winner ? 'auto' : 'none' }}
            />
          ) : (
            <WhiteBoardLarge
              className={css['white-board-large']}
              style={{ pointerEvents: winner ? 'auto' : 'none' }}
            />
          )}
        </div>
        <YourTurn
          currentPlayer={currentPlayer}
          timer={timer}
          winner={winner}
          playAgain={playAgain}
        />
      </div>
      <div
        className={css['winners-bar']}
        style={{
          backgroundColor: winner
            ? winner === '1'
              ? '#fd6687'
              : '#ffce67'
            : '#5c2dd5',
        }}
      >
      </div>
    </div >
  )
}
export default ConnectFour
