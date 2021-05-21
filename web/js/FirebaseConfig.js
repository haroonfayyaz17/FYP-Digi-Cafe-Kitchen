class FirebaseConfig {
    constructor() {
        var firebaseConfig = {
            apiKey: "AIzaSyDtGSEeL5misb5sC1_UFcwY4lO7eUf-GNg",
            authDomain: "digi-cafe-2.firebaseapp.com",
            projectId: "digi-cafe-2",
            storageBucket: "digi-cafe-2.appspot.com",
            messagingSenderId: "384720655745",
            appId: "1:384720655745:web:3f66a2f1f03e1b59808480",
            measurementId: "G-D72VM43NBK"
        };

        firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore();
    }

    getFirebaseInstance() {
        return this.db;
    }
}