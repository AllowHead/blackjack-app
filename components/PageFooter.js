import { useEffect, useState } from 'react';
import { Mention } from 'react-twitter-widgets';
import styles from '../styles/PageFooter.module.css'

const PageFooter = (props) => {

    const [browserLanguage, setBrowserLanguage] = useState('jp');

    useEffect(() => {
        setBrowserLanguage(window.navigator.language);
    }, []);

    return (
        <>
            <footer className={styles.wrapper}>
                <p className={styles.inText}>このサイトは、next.jsとsocket.io、Firebaseの学習のために、@allowerosがテストで作ったものです。なのでバグが存在したり、あるいは何らかのエラーによって突然アクセスできなくなったり、といった不具合が発生する可能性があります。</p>
                <p className={styles.inText}>もし質問がございましたり、不具合が発生したりしましたら、製作者のTwitterまでご連絡ください。絶対に対応しますと約束はできませんが、対応可能な範囲であれば対応します。</p>
                <div className={styles.twitterButton}>
                    <Mention username='alloweros' options={{ lang: browserLanguage || 'jp' }} />
                </div>
            </footer>
            <div className={styles.bottom}></div>
        </>
    )
}

export default PageFooter;