class OrderDBController {

    constructor() {
        var config = new FirebaseConfig();
        this.db = config.getFirebaseInstance();
    }


    async addVoucher(orderAmount, date, personID) {
        var done = false;
        var obj = this;
        await obj.db.collection('Voucher').add({
                "title": 'Order Cancellation Voucher',
                "validity": date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
                'discount': orderAmount,
                'minimumSpend': 0,
            })
            .then(async function(docRef) {
                var id = docRef.id;
                await obj.db.collection('Person').doc(personID).collection('Voucher').doc(id).set({
                    'usedOn': 'null',
                });
                done = true;
            })
            .catch(function(error) {

                done = false;
            });
        return done;

    }


    async fetchData() {
        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        var previous = new Date();
        previous.setHours(0, 0, 0);
        previous.setDate(currentDate.getDate());

        currentDate.setDate(currentDate.getDate() + 1);

        var orders = [];

        let ordersRef = await this.db.collection("Orders")
            .where("status", "==", 'pending')
            .where("dateTime", ">=", previous).where("dateTime", "<", currentDate)
            .orderBy("dateTime").limit(5)
            .get();
        for (var doc of ordersRef.docs) {
            var orderDoc = doc.data();

            var orderObj = new Order(doc.id, orderDoc['orderNo'], orderDoc['amount'], orderDoc['uid']);

            let itemsRef = await this.db.collection("Orders").doc(doc.id).collection("Items").get();
            for (var doc2 of itemsRef.docs) {
                var ItemDataFB = doc2.data();
                var qty = ItemDataFB['quantity'];
                var docRef = await this.db.collection("Food Menu").doc(doc2.id);
                await docRef.get().then(function(doc1) {
                    if (doc1.exists) {
                        var foodData = doc1.data();
                        var foodObj = new FoodItem(foodData['name'], qty);
                        orderObj.addOrderItem(foodObj);
                    }
                });
            }
            orders.push(orderObj);

        }
        var table = new Table();
        table.createTable(orders);

    }



    loadData() {
        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        var previous = new Date();
        previous.setHours(0, 0, 0);
        previous.setDate(currentDate.getDate());
        currentDate.setDate(currentDate.getDate() + 1);
        var obj = this;

        this.db.collection("Orders")
            .where("status", "==", 'pending')
            .where("dateTime", ">", previous).where("dateTime", "<", currentDate)
            .orderBy("dateTime")
            .onSnapshot(function(snapshot) {
                snapshot.docChanges().forEach(function(change) {
                    obj.fetchData();
                    // if (change.type === "added") {
                    //     this.fetchData();
                    // } else if (change.type === "modified") {
                    //     this.fetchData();
                    // } else if (change.type === "removed") {
                    //     this.fetchData();
                    // }
                });
            });
    }

    async sendNotificationToUser(id, msg, title, cusID) {

        var personName, tokenID;
        var docRef1 = await this.db.collection("Person").doc(cusID);
        await docRef1.get().then(function(doc) {
            if (doc.exists) {
                var personData = doc.data();
                if (personData != null) {
                    personName = personData['Name'];
                    tokenID = personData['tokenID'];
                }
            }

        });
        if (tokenID != null && personName != null) {
            var api = new Firebase_Messaging();
            var body = "Hi! " + personName + ". " + msg;
            api.sendMsg(title, body, tokenID);
        }

        this.fetchData();
    }

    async changeOrderStatus(id, oStatus) {
        await this.db.collection("Orders").doc(id).update({ status: oStatus });

    }

}