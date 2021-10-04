const express = require('express');
const next = require('next');
const socketio = require('socket.io')();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

const startChip = 500;
const gamemanager = require('./scripts/gamemanager');
const actionsList = ['ダブルダウン', 'ヒット', 'スタンド', 'フォールド'];

const rankingLength = 30;

const firebase = require('firebase');

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};

const db = require('./scripts/fire')(firebaseConfig);

const blackjackDB = db.collection('users_blackjack');

app.prepare().then(() => {
    const server = express();

    server.post('/chat', (req, res) => {
        console.log('body', req.body)
        postIO(req.body)
        res.status(200).json({ message: 'success' })
    });

    server.all('*', async (req, res) => {
        return handle(req, res)
    });

    const httpServer = server.listen(port, (err) => {
        if (err) throw err
        console.log(`> ローカルホスト、ポート${port}番にサーバーを作成しました - env ${process.env.NODE_ENV}`);
    });

    const io = socketio.listen(httpServer);

    let clients = [];
    let clientOnUpload = [];

    io.on('connection', (socket) => {
        console.log('クライアントid:' + socket.id + 'が接続しました');
        console.log(`現在の接続人数 :`, io.eio.clientsCount);
        clients[socket.id] = new gamemanager(startChip, actionsList);
        clientOnUpload[socket.id] = false;


        socket.on('request_start', () => {
            if (clients[socket.id].phase === 'none' || clients[socket.id].phase === 'battle' || clients[socket.id].phase === 'fold') {
                clients[socket.id].newGameSetter();
                io.to(socket.id).emit('please_bet', clients[socket.id].requestAllStates())
            }
        });

        socket.on('request_game', (bet, ack) => {
            if (clients[socket.id].phase !== 'bet') {
                ack(true);
                return;
            }
            if (clients[socket.id].chip < bet) {
                ack(true);
                return;
            } else {
                clients[socket.id].betConfirm(bet);
                io.to(socket.id).emit('please_call', clients[socket.id].requestAllStates())
            }
        });

        socket.on('request_nextstep', (action) => {
            if (clients[socket.id].phase !== 'call') {
                return;
            }
            if (actionsList.includes(action)) {
                switch (action) {
                    case actionsList[0]:
                        //ダブルダウン
                        if (clients[socket.id].canDouble()) {
                            clients[socket.id].double();
                            io.to(socket.id).emit('confirm_result', clients[socket.id].requestAllStates());
                        }
                        break;
                    case actionsList[1]:
                        //ヒット
                        clients[socket.id].cardDrawPlayer();
                        io.to(socket.id).emit('please_call', clients[socket.id].requestAllStates());
                        break;
                    case actionsList[2]:
                        //スタンド
                        clients[socket.id].confirmPlayerCard();
                        io.to(socket.id).emit('confirm_result', clients[socket.id].requestAllStates());
                        break;
                    case actionsList[3]:
                        //フォールド
                        clients[socket.id].fold();
                        io.to(socket.id).emit('confirm_result', clients[socket.id].requestAllStates())
                        break;
                }
            }
        });

        socket.on('please_upload', (name, ack) => {
            const targetName = String(name);
            const filteringRegEXP = /[\uFF61-\uFF9F]|[\u30A0-\u30FF]|[\u3040-\u309F]|[０-９]|\d|\w/g;
            const tempFilter = targetName.match(filteringRegEXP);
            if (tempFilter === null || clientOnUpload[socket.id] === true) {
                ack(false);
                return;
            }
            if (tempFilter.length !== 0) {
                const uploadData = {
                    time: firebase.firestore.Timestamp.now(),
                    name: (tempFilter.length === 1) ? tempFilter[0] : tempFilter.join(''),
                    game: clients[socket.id].game,
                    chip: clients[socket.id].chip
                }
                blackjackDB.add(uploadData)
                    .then((docRef) => {
                        clientOnUpload[socket.id] = true;
                        console.log(`${socket.id}からのアップロードのリクエスト成功しました。データ:`, uploadData, 'ID:', docRef.id);
                        blackjackDB.doc(docRef.id).get()
                            .then((document) => {
                                if (document.exists) {
                                    console.log(`${socket.id}からの${docRef.id}へのドキュメントのリクエストに成功しました。`);
                                    ack(document.data());
                                } else {
                                    console.warn(`${socket.id}から${docRef.id}へドキュメントをリクエストしましたが、IDが${docRef.id}のドキュメントは存在しませんでした。`,);
                                    ack(false);
                                }
                            }).catch((error) => {
                                console.warn(`${socket.id}からの${docRef.id}へのドキュメントのリクエストに失敗しました。エラー:`, error);
                                ack(false);
                            })
                    })
                    .catch((error) => {
                        console.warn(`${socket.id}からのアップロードのリクエストに失敗しました。データ:`, uploadData, 'エラー:', error);
                        ack(false);
                    })
                return;
            } else {
                ack(false);
                return;
            }
        });

        socket.on('request_ranking', (none, ack) => {
            blackjackDB.orderBy('chip', 'desc').limit(rankingLength).get()
                .then((docQ) => {
                    const extractingData = [];
                    docQ.forEach((inData) => {
                        extractingData.push(inData.data());
                    });
                    ack(extractingData);
                })
                .catch((error) => {
                    ack(false);
                })
        })

        socket.on("disconnect", (reason) => {
            console.log(`${socket.id}が退出しました`, reason);
            console.log(`現在の接続人数 :`, io.eio.clientsCount);
            delete clients[socket.id];
        });

    });

    const postIO = (data) => {
        io.emit('update-data', data)
    };
})
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    });