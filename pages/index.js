import { useEffect, useRef, useState } from "react";
import { Alert, Button, FormControl, InputGroup } from "react-bootstrap";
import { io } from "socket.io-client";
import Ranking from "../components/Ranking";
import BetButton from "../components/BetButton";
import CallButton from "../components/CallButton";
import styles from '../styles/Home.module.css';
import BetDisplay from "../components/parts/BetDisplay";
import Bankruptcy from "../components/Bankruptcy";
import { useRouter } from 'next/router'
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";

const socket = io();

export default function Home() {

    const uniqueKeyListRef = useRef([]);
    const randomGenerator = () => {
        for (let i = 0; i < 1; i++) {
            const _S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            const _N = 16
            const target = Array.from(Array(_N)).map(() => _S[Math.floor(Math.random() * _S.length)]).join('')
            if (uniqueKeyListRef.current.includes(target)) {
                i--;
            } else {
                uniqueKeyListRef.current = uniqueKeyListRef.current.concat([target]);
                return target;
            }
        }
    }

    const router = useRouter();

    const [phaseS, setPhaseS] = useState('none');
    const [chipS, setChipS] = useState(0);
    const [betS, setBetS] = useState(0);

    const [cardDataHolderS, setCardDataHolderS] = useState([null, null]);
    const [displayCardsS, setDisplayCardsS] = useState([<div key={`${randomGenerator()}`}></div>, <div key={`${randomGenerator()}`}></div>]);

    const [canCallListS, setCanCallListS] = useState([]);

    const [resultS, setResultS] = useState('none');

    const [nicknameS, setNicknameS] = useState('');
    const [notfilterNameS, setNotfilterNameS] = useState('');

    const [gameS, setGameS] = useState(0);

    const [rankingS, setRankingS] = useState(false);

    useEffect(() => {
        socket.on('please_bet', (datas) => {
            setChipS(datas.chip);
            setPhaseS(datas.phase);
            setGameS(datas.game);
        })
        socket.on('please_call', (datas) => {
            setPhaseS(datas.phase);
            setCanCallListS(datas.actions);
            setBetS(datas.bet);
            setCardDataHolderS([datas.player, datas.dealer]);
        })
        socket.on('confirm_result', (datas) => {
            setResultS(datas.win);
            setPhaseS(datas.phase);
            setChipS(datas.chip);
            setBetS(datas.bet);
            setCardDataHolderS([datas.player, datas.dealer]);
        })
        rankingDataReq();
    }, [])


    useEffect(() => {
        if (cardDataHolderS[0] !== null && cardDataHolderS[1] !== null) {
            let tempDOM = [[], []];
            let playerCard = cardDataHolderS[0].card.map((value) => { return value });
            let dealerCard = cardDataHolderS[1].card.map((value) => { return value });
            let [Aplayer, Adealer] = [cardDataHolderS[0].includeA, cardDataHolderS[1].includeA];

            for (let i = 0; i < Aplayer.length; i++) {
                playerCard.splice(Aplayer[i], 0, 'A');
            }
            playerCard.forEach((value) => {
                const tempKey = randomGenerator();
                tempDOM[0].push(<p className={styles.number} key={tempKey}>{value}</p>);
            });
            for (let i = 0; i < Adealer.length; i++) {
                dealerCard.splice(Adealer[i], 0, 'A');
            }
            dealerCard.forEach((value) => {
                const tempKey = randomGenerator();
                tempDOM[1].push(<p className={styles.number} key={tempKey}>{value}</p>);
            });

            setDisplayCardsS([tempDOM[0], tempDOM[1]]);
        }
    }, [cardDataHolderS])

    const numberCheck = (cardListObject) => {
        if (cardListObject.card.length + cardListObject.includeA.length === 0) {
            return 0;
        }
        const AnotNum = (cardListObject.card.length === 0) ? 0 : cardListObject.card.reduce((acc, value) => { return acc + value });
        let reducerNumber = AnotNum;
        for (let i = 0; i < cardListObject.includeA.length; i++) {
            if (reducerNumber <= 10) {
                reducerNumber += 11;
            } else {
                reducerNumber += 1;
            }
        }
        return reducerNumber;
    }

    const confirmCall = (e) => {
        socket.emit('request_nextstep', e.target.value);
    }

    const startCall = () => {
        socket.emit('request_start', null);
    }

    const confirmBet = (bet) => {
        socket.emit('request_game', bet);
    }

    const rankingDataReq = () => {
        socket.emit('request_ranking', null, (data) => {
            setRankingS(data);
        })
    }

    const gameend = () => {
        if ((nicknameS === notfilterNameS) && nicknameS !== null && nicknameS !== '') {
            socket.emit('please_upload', nicknameS, (data) => {
                if (data !== false) {
                    router.reload();
                } else {
                    console.log('アップロードに失敗しました');
                }
            });
        } else {
        }
    }

    const nullchecker = (target) => {
        return target === null;
    }
    const isLength = (target) => {
        return target.card.length + target.includeA.length;
    }
    const isBlackjack = (target) => {
        return (numberCheck(cardDataHolderS[0]) === 21 && isLength(target) === 2);
    }

    const nameSetter = (e) => {
        const targetName = String(e.target.value);
        setNotfilterNameS(targetName);
        const filteringRegEXP = /[\uFF61-\uFF9F]|[\u30A0-\u30FF]|[\u3040-\u309F]|[０-９]|\d|\w/g;
        const tempFilter = targetName.match(filteringRegEXP);
        if (tempFilter === null) {
            setNicknameS('');
            return;
        }
        if (tempFilter.length !== 0) {
            const filteringName = tempFilter.join('');
            setNicknameS(String(filteringName));
        }
    }

    return (
        <>
            <PageHeader />
            <div className={styles.wrapper}>
                {phaseS !== 'none' ?
                    <div className={styles.game}><p>{gameS}ゲーム目</p></div>
                    : null}
                {phaseS === 'bet' ?
                    <div >
                        <BetButton chip={chipS} confirm={confirmBet} />
                    </div>
                    : null}
                {phaseS === 'battle' || phaseS === 'fold' || phaseS === 'call' ?
                    <div>
                        <p className={styles.total}>dealer: <span className={styles.cardnumber}>{cardDataHolderS[1] === null ? null : numberCheck(cardDataHolderS[1])}</span></p>
                        <div className={styles.cards}>
                            {displayCardsS[1]}
                        </div>
                        <hr />
                        <div className={styles.alerts}>
                            <p className={styles.total}>player: <span className={styles.cardnumber}>{cardDataHolderS[1] === null ? null : numberCheck(cardDataHolderS[0])}</span></p>
                        </div>
                        <div className={styles.cards}>
                            {displayCardsS[0]}
                        </div>
                        <hr />
                    </div>
                    : null}
                {phaseS === 'call' ?
                    <>
                        <div className={styles.call}>
                            <CallButton action={canCallListS} onClick={confirmCall} burst={nullchecker(cardDataHolderS[0]) ? false : numberCheck(cardDataHolderS[0]) > 21} blackjack={nullchecker(cardDataHolderS[0]) ? false : isBlackjack(cardDataHolderS[0])} double={nullchecker(cardDataHolderS[0]) ? false : (isLength(cardDataHolderS[0]) === 1 && chipS >= betS * 2)} />
                        </div>
                        <div className={styles.infos}>
                            {nullchecker(cardDataHolderS[0]) ?
                                false
                                : numberCheck(cardDataHolderS[0]) > 21 ?
                                    <Alert variant='danger'>バースト！</Alert>
                                    : null}
                            {nullchecker(cardDataHolderS[0]) ?
                                false
                                : isBlackjack(cardDataHolderS[0]) ?
                                    <Alert variant='success'>ブラックジャック！</Alert>
                                    : null}
                        </div>
                    </>
                    : null}
                {phaseS === 'battle' || phaseS === 'fold' ?
                    <div className={styles.action}>
                        <div className={styles.result}>
                            {phaseS === 'fold' ?
                                <>
                                    <p>フォールドしました。ベットの半分が返還されます。</p>
                                    <p>ベットしていた枚数:{betS} 返還後の手持ちチップ:{chipS}</p>
                                </>
                                : null}
                            {phaseS === 'battle' ?
                                <>
                                    {resultS === 'win' ?
                                        <>
                                            <p>あなたの勝利です。{isBlackjack(cardDataHolderS[0]) ? 'ブラックジャックのため、配当が1.5倍になります。' : `勝利額は${betS}です。`}</p>
                                            <p>ベットしていた枚数:{betS} 手持ちチップ:{chipS}</p>
                                        </>
                                        : null}
                                    {resultS === 'draw' ?
                                        <>
                                            <p>引き分けになりました。ベットがそのまま返還されます。</p>
                                            <p>ベットしていた枚数:{betS} 返還後の手持ちチップ:{chipS}</p>
                                        </>
                                        : null}
                                    {resultS === 'lose' ?
                                        <>
                                            <p>ディーラーの勝利です。ベットが没収されます。</p>
                                            <p>ベットしていた枚数:{betS} 没収後の手持ちチップ:{chipS}</p>
                                        </>
                                        : null}
                                </>
                                : null}
                        </div>

                        {chipS > 0 ?
                            <>
                                <div>
                                    <Button onClick={startCall}>次のゲーム</Button>
                                </div>
                                <div className={styles.confirmer}>
                                    <hr />
                                    <p>ゲームを終了し、結果を送信する</p>
                                    <p>※送信すると現在の手持ちチップ数とゲーム数がリセットされます</p>
                                    <p>※<strong><b>絶対に</b>個人情報を入力しないでください</strong></p>
                                    <InputGroup>
                                        <InputGroup.Text>ニックネーム</InputGroup.Text>
                                        <FormControl
                                            placeholder="ひらがなカタカナ英字数字のみ"
                                            onChange={nameSetter}
                                        />
                                        {(nicknameS === notfilterNameS) ?
                                            <Button variant="secondary" onClick={gameend}>送信する</Button>
                                            :
                                            <Button variant="secondary" onClick={gameend} disabled>送信する</Button>
                                        }
                                    </InputGroup>
                                    {(nicknameS === notfilterNameS) ?
                                        null
                                        :
                                        <Alert variant='danger'>名前に使用できるのはひらがなカタカナと半角の英字数字のみです</Alert>
                                    }
                                </div>
                            </>
                            :
                            <Bankruptcy />
                        }
                    </div>
                    : null}
                {(phaseS !== 'bet' && phaseS !== 'none' && phaseS !== 'battle') ?
                    <div className={styles.display}>
                        <BetDisplay chip={chipS} bet={betS} isBetting={false} />
                    </div>
                    : null}
                {phaseS === 'none' ?
                    <div className={styles.title}>
                        <div className={styles.title_text}>
                            <h2>BLACK JACK PAYS 3 TO 2<br />Dealer must stand on 17 and must draw to 16</h2>
                            <hr />
                            <h3>INSURANCE PAYS 2 TO 1</h3>
                            <hr />
                        </div>
                        <div className={styles.start}>
                            <Button onClick={startCall} variant='success'>ゲームスタート</Button>
                        </div>
                        <h4 className={styles.ranking}>#ランキング</h4>
                        <Ranking data={rankingS} />
                    </div>
                    : null}
            </div>
            <PageFooter />
        </>
    )
}