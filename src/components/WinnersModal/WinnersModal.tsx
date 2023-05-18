import css from './winnersModal.module.css'

interface WinnersModalProps {
  winner: string
  playAgain: () => void
}

const WinnersModal = ({ winner, playAgain }: WinnersModalProps) => {
  return (
    <div className={css['winning-message-container']}>
      <div className={css['winning-message']}>
        <span className={css.winner}>PLAYER {winner}</span>
        <span>wins</span>
      </div>
      <button className={css['reset-button']} onClick={playAgain}>
        play again
      </button>
    </div>
  )
}

export default WinnersModal
