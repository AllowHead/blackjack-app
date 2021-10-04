const firebase = require('firebase');
require('firebase/firestore');

const initializeFunc = (setting) => {
    if (firebase.apps.length == 0) {
        firebase.initializeApp(setting);
    }

    return firebase.firestore();
}

module.exports = initializeFunc;