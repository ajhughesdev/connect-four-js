import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Header from '../../components/Header/Header'
import PlayerScoreBoard from '../../components/PlayerScoreBoard/PlayerScoreBoard'
import WinnersModal from '../../components/WinnersModal/WinnersModal'
import GamePiece from '../../components/GamePiece/GamePiece'

import { ReactComponent as BlackBoard } from './../../assets/images/board-layer-black-small.svg'
import { ReactComponent as BlackBoardLarge } from './../../assets/images/board-layer-black-large.svg'
import { ReactComponent as WhiteBoard } from './../../assets/images/board-layer-white-small.svg'
import { ReactComponent as WhiteBoardLarge } from './../../assets/images/board-layer-white-large.svg'
import { ReactComponent as WinnersBar } from './../../assets/images/winners-bar-small.svg'

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
  const [timer, setTimer] = useState<number>(15)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const timerRef = useRef<number>()
  const [winner, setWinner] = useState<string | null>(null)
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)

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
    setTimer(15)
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
          setTimer(15)
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
    setTimer(15)
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
      <Header toggleMenu={toggleMenu} restartGame={restartGame} />
      <div className={css.scoreboards}>
        <PlayerScoreBoard player={'1'} score={player1Score} />
        <PlayerScoreBoard player={'2'} score={player2Score} />
      </div>
      {menuVisible && (
        <div className={css['modal-main']}>
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
      )}

      <div className={css['board-container']}>
        {window.matchMedia('(min-width: 640px)').matches && <BlackBoardLarge className={css['black-board-large']} />}
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
                  {window.matchMedia('(min-width: 960px)').matches &&
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
        {window.matchMedia('(min-width: 640px)').matches && (<WhiteBoardLarge className={css['white-board-large']} />)}
        <WhiteBoard className={css['white-board']} width={335} height={310} />
        {winner && <WinnersModal winner={winner} playAgain={playAgain} />}
        <div className={css['your-turn']}>
          <svg
            width='197'
            height='165'
            viewBox='0 0 197 165'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g filter='url(#filter0_d_5_5704)'>
              <path
                className={
                  currentPlayer === '1' ? css['your-turn1'] : css['your-turn2']
                }
                fillRule='evenodd'
                clipRule='evenodd'
                d='M3 55.2795C3 47.2326 7.82258 39.9694 15.2389 36.8468L90.2793 5.25082C95.2186 3.17114 100.786 3.16075 105.733 5.22198L181.692 36.8718C189.145 39.9772 194 47.2593 194 55.3333V132C194 143.046 185.046 152 174 152H23C11.9543 152 3 143.046 3 132V55.2795Z'
              />
              <path
                d='M14.6568 35.4643C6.68427 38.8212 1.5 46.6291 1.5 55.2795V132C1.5 143.874 11.1259 153.5 23 153.5H174C185.874 153.5 195.5 143.874 195.5 132V55.3333C195.5 46.6538 190.281 38.8255 182.269 35.4872L106.31 3.83737C100.992 1.62154 95.0069 1.63271 89.6972 3.86836L14.6568 35.4643Z'
                stroke='black'
                strokeWidth='3'
              />
            </g>
            <defs>
              <filter
                id='filter0_d_5_5704'
                x='0'
                y='0.683517'
                width='197'
                height='164.316'
                filterUnits='userSpaceOnUse'
                colorInterpolationFilters='sRGB'
              >
                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                <feColorMatrix
                  in='SourceAlpha'
                  type='matrix'
                  values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                  result='hardAlpha'
                />
                <feOffset dy='10' />
                <feColorMatrix
                  type='matrix'
                  values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
                />
                <feBlend
                  mode='normal'
                  in2='BackgroundImageFix'
                  result='effect1_dropShadow_5_5704'
                />
                <feBlend
                  mode='normal'
                  in='SourceGraphic'
                  in2='effect1_dropShadow_5_5704'
                  result='shape'
                />
              </filter>
            </defs>
            <g
              className={`${css['your-turn-text']} ${currentPlayer === '1' ? css['your-turng1'] : css['your-turng2']
                }`}
              fontFamily='Space Grotesk, Space Grotesk-fallback, sans-serif'
              fontWeight='700'
            >
              <text fontSize='16' transform='translate(31 41)'>
                <tspan x='1.64' y='16'>
                  PLAYER {currentPlayer}'s TURN
                </tspan>
              </text>
              <text fontSize='56' transform='translate(51 41)'>
                <tspan x='.872' y='77'>
                  {timer?.toString().padStart(2, '0')}s
                </tspan>
              </text>
            </g>
          </svg>
        </div>
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
      ></div>
    </div>
  )
}
export default ConnectFour
