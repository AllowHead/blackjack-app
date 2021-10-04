import styles from '../styles/Help.module.css';
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import { Nav } from 'react-bootstrap';

export default function Help() {
    const helpsID = 'iThinkWeDidAPrettyGoodJobSoFar';
    const topID = 'wearexcom';
    const [blackjackiswhat, gameflow, whatisblackjack, uploaddata] = [`${helpsID}blackjackiswhat`, `${helpsID}gameflow`, `${helpsID}whatisblackjack`, `${helpsID}uploaddata`];
    return (
        <>
            <PageHeader />
            <div className={styles.wrapper} id={`${topID}`}>
                <div className={styles.navbars}>
                    <Nav
                    // onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
                    >
                        <Nav.Item>
                            <Nav.Link href={`#${blackjackiswhat}`}>ブラックジャックとは</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href={`#${gameflow}`}>ゲームの流れ</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href={`#${whatisblackjack}`}>『ブラックジャック』って何？</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href={`#${uploaddata}`}>アップロードされるデータについて</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <section className={styles.cases} id={`${blackjackiswhat}`}>
                    <h3>ブラックジャックとは</h3>
                    <p>ブラックジャックは、ゲームマスターであるディーラーと、プレイヤーとの間で、どちらの方が手札のカードの数値の合計が高いかを競うゲームです。ただし数値の合計が22以上になると『バースト』になり、負けになります。ですので、数値の合計が22以上にならず、かつディーラーの数値よりは高くなるように手札にカードを足していく戦略眼がプレイヤーに求められます。</p>
                    <p>このサイト上のブラックジャックは処理の簡単のために、実際のブラックジャックとは少しルールが異なります。具体的に言うと、スプリット、インシュランス、イーブンマネー、ホールカードの四つがありません。また、一度でもヒットを行った後のダブルダウンも不可能です。様々な要素が削られているので、物足りないなと思った方は他のブラックジャックを試してみてください。</p>
                </section>
                <section className={styles.cases} id={`${gameflow}`}>
                    <h3>ゲームの流れ</h3>
                    <p>まず最初に、プレイヤーとディーラーにそれぞれ1枚だけカードが配られます。どちらのカードの数字もこの段階で確認できます。その後、プレイヤーが取る行動を選択します。スタンド、フォールド、ヒット、ダブルダウンの四つの中から選択します。</p>
                    <div>
                        <h4>スタンド</h4>
                        <p>カードを引かず、現在の手札で勝負します。バースト状態の場合、スタンド以外の行動を選ぶことはできません。</p>
                    </div>
                    <div>
                        <h4>フォールド</h4>
                        <p>現在のゲームを終了します。ディーラーの手札の内容、実際に勝負した場合の勝敗に関わらず、ベット額の半分だけが戻ってきます。</p>
                    </div>
                    <div>
                        <h4>ヒット</h4>
                        <p>カードを追加で1枚引きます。引いた後にもう一度、ダブルダウン以外の行動を行うことができます。</p>
                    </div>
                    <div>
                        <h4>ダブルダウン</h4>
                        <p>そのゲーム中に一度もヒットをしておらず、かつ手持ちのチップがベット額の2倍以上ある場合にのみ行えます。ベット額を2倍にし、その上で1枚だけカードを引いてそのまま勝負します。</p>
                    </div>
                    <p>上記4つの行動の中からスタンドかダブルダウンを選択すると、ディーラーとの勝負が行われます。この勝負の結果に応じて配当が返ってきます。自分がバーストしているなら問答無用で負け。自分の数字がディーラーよりも大きいなら勝ち、小さいなら負け。同じなら引き分けになります。</p>
                    <p>勝負がついた後、次のゲームを始めるか、それともゲームの結果をランキングにアップロードするかを選択できます。アップロードを選んだ場合、次のゲームを開始することはできません。ページがリロードされ、チップ枚数や遊んだゲーム数などの情報がリセットされます。アップロードされたデータはチップ数の上位30人分だけタイトル画面から確認できます。より多くのチップを獲得して、ランキングの上位を目指しましょう。なお上位に入ったとしても何も報酬はないので、煽っておいてなんですが暇つぶしとしてマイペースに遊んでいってください。</p>
                </section>
                <section className={styles.cases} id={`${whatisblackjack}`}>
                    <h3>『ブラックジャック』って何？</h3>
                    <p>最初の二枚のカードが、10として扱われるカードとAのカードの組み合わせだった場合、ブラックジャックという手役になります。ブラックジャックは通常の21、つまり3枚以上のカードを用いて作られた21よりも強く、どんな状況になっても引き分けることはあっても負けることはありえません。ついでに通常の勝利よりも返ってくる配当が少し高いです。この時の配当の倍率は1.2倍か1.5倍が一般的で、このサイトでは1.5倍を採用しています。</p>
                </section>
                <section className={styles.cases} id={`${uploaddata}`}>
                    <h3>アップロードされるデータについて</h3>
                    <p>ランキングへのアップロードを行うと、入力したニックネーム、最終的なチップ枚数、遊んだゲーム数、アップロードを行った時間の4つのデータがサーバーにアップロードされます。チップ枚数で降順に並べた際の上位30人のデータは、ランキングという形で閲覧できます。不特定多数の人物が閲覧可能な状態にあるので、個人の特定が可能な情報は入力しないでください。発見したら断りなく削除します。</p>
                </section>
            </div>
            <PageFooter />
        </>
    )
}