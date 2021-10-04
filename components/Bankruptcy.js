import { useRouter } from "next/dist/client/router";
import { Button } from "react-bootstrap";
import styles from '../styles/Bankruptcy.module.css';

const Bankruptcy = (props) => {

    const router = useRouter();
    const pageReloader = () => {
        router.reload();
    }

    return (
        <div className={styles.wrapper}>
            <p>チップが無くなりました。新しくゲームを始める場合はページをリロードしてください。</p>
            <Button onClick={pageReloader}>次のゲームを始める</Button>
        </div>
    )
}

export default Bankruptcy;