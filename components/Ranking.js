import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styles from '../styles/Ranking.module.css';

const Ranking = (props) => {
    const [dataTableS, setDataTableS] = useState(null);

    useEffect(() => {
        if (props.data !== false) {
            const rankingData = props.data;
            const tempDOM = rankingData.map((value, index) => {
                return (
                    <tr key={`${value.time}${value.name}${value.chip * value.game}`}>
                        <td>{index + 1}</td>
                        <td>{value.name}</td>
                        <td>{value.chip}</td>
                        <td>{value.game}</td>
                    </tr>
                )
            })
            setDataTableS(tempDOM);
        } else {
            setDataTableS(null);
        }
    }, [props.data]);

    return (
        <div className={styles.wrapper}>
            <Table striped bordered hover >
                <thead className={styles.backgrounder}>
                    <tr>
                        <th>順位</th>
                        <th>名前</th>
                        <th>チップ数</th>
                        <th>ゲーム数</th>
                    </tr>
                </thead>
                <tbody className={styles.backgrounder}>
                    {dataTableS}
                </tbody>
            </Table>
        </div>
    )
}

export default Ranking;