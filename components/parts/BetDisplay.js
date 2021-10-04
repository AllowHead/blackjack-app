import styles from '../../styles/BetDisplay.module.css';

const BetDisplay = (props) => {
    return (
        <div className={styles.wrapper}>
            <p>{props.isBetting ? 'ベット額を選んでください' : 'ベット額'}: <span className={styles.number}>{props.bet}</span></p>
            <p>現在のチップ枚数: <span className={styles.number}>{props.chip}</span></p>
        </div>
    )
}

export default BetDisplay;