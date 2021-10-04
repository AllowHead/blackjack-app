import { Button } from "react-bootstrap";

const CallButton = (props) => {
    if (props.burst || props.blackjack) {
        return (
            <div>
                <Button onClick={props.onClick} disabled value={props.action[0]}>{props.action[0]}</Button>
                <Button onClick={props.onClick} disabled value={props.action[1]}>{props.action[1]}</Button>
                <Button onClick={props.onClick} value={props.action[2]}>{props.action[2]}</Button>
                <Button onClick={props.onClick} disabled value={props.action[3]}>{props.action[3]}</Button>
            </div>
        )
    } else {
        return (
            <div>
                {props.double ?
                    <Button onClick={props.onClick} value={props.action[0]}>{props.action[0]}</Button>
                    :
                    <Button onClick={props.onClick} disabled value={props.action[0]}>{props.action[0]}</Button>
                }
                <Button onClick={props.onClick} value={props.action[1]}>{props.action[1]}</Button>
                <Button onClick={props.onClick} value={props.action[2]}>{props.action[2]}</Button>
                <Button onClick={props.onClick} value={props.action[3]}>{props.action[3]}</Button>
            </div>
        )
    }
}
export default CallButton;