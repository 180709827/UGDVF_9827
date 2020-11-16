import firebase from 'firebase/app'
import 'firebase/database'

export const db = firebase
    .initializeApp({ databaseURL: 'https://guidedvuefire9827.firebaseio.com' })
    .database()

    export const dessRef = db.ref('desserts')
    export const bevRef = db.ref('beverage')