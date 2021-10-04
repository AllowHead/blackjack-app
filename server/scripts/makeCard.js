
const makeCard = () => {
    const [min, max] = [1, 13];
    const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    let numMark;
    if (targetNumber !== 1 && targetNumber <= 10) {
        numMark = targetNumber;
    } else {
        switch (targetNumber) {
            case 1:
                numMark = 'A';
                break;
            case 11:
                numMark = 10;
                break;
            case 12:
                numMark = 10;
                break;
            case 13:
                numMark = 10;
                break;
            default: break;
        }
    }

    return numMark;
}
module.exports = makeCard;

