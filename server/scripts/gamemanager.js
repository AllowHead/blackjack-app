class gamemanager {
    constructor(firstchip, actionList) {
        this.actions = actionList;
        this.chip = firstchip;
        this.bet = 0;
        this.player = {
            card: [],
            includeA: [],
        };
        this.dealer = {
            card: [],
            includeA: [],
        };
        this.game = 0;
        this.phase = 'none';
        this.isWin = 'draw';
    }

    requestAllStates() {
        const tempObject = {
            phase: this.phase,
            player: this.player,
            dealer: this.dealer,
            bet: this.bet,
            chip: this.chip,
            win: this.isWin,
            actions: this.actions,
            canDouble: this.canDouble(),
            game: this.game,
        }
        return tempObject;
    }

    makeCard() {
        const [min, max] = [1, 13];
        const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        let numMark;
        if (targetNumber !== 1 && targetNumber <= 10) {
            numMark = targetNumber;
        } else {
            if (targetNumber === 1) {
                numMark = 'A';
            } else {
                numMark = 10;
            }
        }
        return numMark;//通常設定

        // return Math.floor(Math.random() * 2) === 0 ? 'A' : 10;//Aか10しか出さない設定
    }

    newGameSetter() {
        this.bet = 0;
        this.player = {
            card: [],
            includeA: [],
        };
        this.dealer = {
            card: [],
            includeA: [],
        };
        this.game++;
        this.phase = 'bet';
    }

    betConfirm(bet) {
        this.phase = 'call';
        this.bet = bet;
        this.cardDrawPlayer();
        this.cardDrawDealer();
    }

    cardDrawPlayer() {
        const pushNum = this.makeCard();
        if (pushNum === 'A') {
            const tempCardIndex = Number(this.player.card.length + this.player.includeA.length);
            this.player.includeA.push(tempCardIndex);
        } else {
            this.player.card.push(pushNum);
        }
    }
    cardDrawDealer() {
        const pushNum = this.makeCard();
        if (pushNum === 'A') {
            const tempCardIndex = Number(this.dealer.card.length + this.dealer.includeA.length);
            this.dealer.includeA.push(tempCardIndex);
        } else {
            this.dealer.card.push(pushNum);
        }
    }

    numberCheck(cardListObject) {
        const AcardNum = cardListObject.includeA.length;
        const AnotNum = (cardListObject.card.length === 0) ? 0 : cardListObject.card.reduce((acc, value) => { return acc + value });
        let reducerNumber = AnotNum;
        for (let i = 0; i < AcardNum; i++) {
            if (reducerNumber <= 10) {
                reducerNumber += 11;
            } else {
                reducerNumber += 1;
            }
        }
        return reducerNumber;
    }

    confirmPlayerCard() {
        this.phase = 'battle';
        while (this.numberCheck(this.dealer) < 17) {
            this.cardDrawDealer();
        }
        const playerNum = this.numberCheck(this.player);
        const dealerNum = this.numberCheck(this.dealer);
        if (playerNum > 21) {
            this.resultConfirm('lose');
            this.isWin = 'lose';
        } else if (dealerNum > 21) {
            this.resultConfirm('win');
            this.isWin = 'win';
        } else if (this.isBlackjack(this.dealer) && this.isBlackjack(this.player)) {
            this.resultConfirm('draw');
            this.isWin = 'draw';
        } else if (this.isBlackjack(this.dealer)) {
            this.resultConfirm('lose');
            this.isWin = 'lose';
        } else if (this.isBlackjack(this.player)) {
            this.resultConfirm('win');
            this.isWin = 'win';
        } else if (playerNum === dealerNum) {
            this.resultConfirm('draw');
            this.isWin = 'draw';
        } else if (playerNum < dealerNum) {
            this.resultConfirm('lose');
            this.isWin = 'lose';
        } else if (playerNum > dealerNum) {
            this.resultConfirm('win');
            this.isWin = 'win';
        }
    }

    resultConfirm(result) {
        switch (result) {
            case 'win':
                if (this.isBlackjack(this.player)) {
                    this.chip += Math.ceil(this.bet * 1.5);
                } else {
                    this.chip += this.bet;
                }
                break;
            case 'draw':
                break;
            case 'lose':
                this.chip -= this.bet;
                break;
            default: break;
        }
    }

    isBlackjack(target) {
        return (target.card.length === 1 && target.card[0] === 10 && target.includeA.length === 1);
    }

    canDouble() {
        return this.chip >= this.bet * 2;
    }

    double() {
        if (this.canDouble()) {
            this.cardDrawPlayer();
            this.bet *= 2;
            this.confirmPlayerCard();
        }
    }

    fold() {
        this.phase = 'fold';
        const minusChip = Math.ceil(this.bet / 2);
        this.chip -= minusChip;
    }
}

module.exports = gamemanager;