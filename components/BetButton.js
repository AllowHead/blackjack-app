import { useState } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import styles from '../styles/BetButton.module.css';
import BetDisplay from "./parts/BetDisplay";

const BetButton = (props) => {
    const [betChipS, setBetChipS] = useState(0);

    const betset = (e) => {
        const bet = Number(e.target.value);
        if (betChipS + bet > props.chip) {
            setBetChipS(props.chip);
        } else {
            setBetChipS(betChipS + bet);
        }
    }
    const reset = () => {
        setBetChipS(0);
    }
    const confirm = () => {
        if (betChipS === 0) {
            return;
        } else {
            props.confirm(betChipS)
        }
    }

    return (
        <div className={styles.wrapper}>
            <BetDisplay bet={betChipS} chip={props.chip} isBetting={true} />
            <div className={styles.buttons}>
                <ButtonToolbar onClick={betset}>
                    <ButtonGroup>
                        <Button variant='primary' value='1'>1</Button>
                        <Button variant='primary' value='5'>5</Button>
                        <Button variant='primary' value='10'>10</Button>
                        <Button variant='primary' value='50'>50</Button>
                        <Button variant='primary' value='100'>100</Button>
                        <Button variant='primary' value='500'>500</Button>
                        <Button variant='primary' value='1000'>1000</Button>
                        <Button variant='primary' value='5000'>5000</Button>
                        <Button variant='primary' value='10000'>10000</Button>
                        <Button variant='primary' value='50000'>50000</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
            <p>※必ず1以上のチップを賭けてください</p>
            <div className={styles.confirm}>
                <ButtonToolbar>
                    <ButtonGroup>
                        <Button variant='info' onClick={confirm}>決定</Button>
                        <Button variant='secondary' onClick={reset}>リセット</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        </div>
    )
}

export default BetButton;