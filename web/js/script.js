// import firebase from 'firebase/app';
// import 'firebase/firestore';
// document.addEventListener('DOMContentLoaded', event => {
$(document).ready(function() {
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
    const db = firebase.firestore();

    async function fetchData() {
        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        var previous = new Date();
        previous.setHours(0, 0, 0);
        previous.setDate(currentDate.getDate());

        currentDate.setDate(currentDate.getDate() + 1);

        var orders = [];

        let ordersRef = await db.collection("Orders")
            .where("status", "==", 'pending')
            .where("dateTime", ">=", previous).where("dateTime", "<", currentDate)
            .orderBy("dateTime").limit(5)
            .get();
        for (var doc of ordersRef.docs) {
            console.log(`${doc.id} => ${doc.data()}`);
            var orderDoc = doc.data();

            var orderObj = new Order(doc.id, orderDoc['orderNo']);

            let itemsRef = await db.collection("Orders").doc(doc.id).collection("Items").get();
            for (var doc2 of itemsRef.docs) {
                var ItemDataFB = doc2.data();
                var qty = ItemDataFB['quantity'];
                console.log(qty);
                var docRef = await db.collection("Food Menu").doc(doc2.id);
                await docRef.get().then(function(doc1) {
                    if (doc1.exists) {
                        var foodData = doc1.data();
                        var foodObj = new FoodItem(foodData['name'], qty);
                        orderObj.addOrderItem(foodObj);
                    } else {
                        console.log("No such document!");
                    }
                });
            }
            orders.push(orderObj);

        }
        createTable(orders);

    }

    function createTableHeaders() {
        return "<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th><th>Prepare</th><th>Cancel</th></tr>";
    }

    function createOrderNoRow(start, itemsCount, orderNo, end) {
        return start + "<td rowspan='" + itemsCount + "'>" + orderNo + "</td>" + end;
    }

    function createNameAndQty(start, text, end) {
        return start + "<td>" + text + "</td>" + end;
    }

    function createPrepareButton(start, itemsCount, id, end) {
        return start + "<td rowspan='" + itemsCount + "'>" + "<button type='button' id='prepareButton' data-id7='" + id + "'  class='btn btn-success prepareBtn'>Prepared</button>" + "</td>" + end;
    }

    function createCancelButton(start, itemsCount, id, end) {
        return start + "<td rowspan='" + itemsCount + "'>" + "<button type='button' id='cancelButton' data-id8='" + id + "'  class='btn btn-danger prepareBtn'>Cancel</button>" + "</td>" + end;
    }

    function createTable(orders) {
        var tableStart = "<table>";
        var tableHeader = createTableHeaders();
        var tableContent = ''
        tableContent += tableStart + tableHeader;
        for (let order of orders) {
            var itemsCount = order.foodItems.length;
            var orderNo = createOrderNoRow("<tr>", itemsCount, order.orderNo, '');
            tableContent += orderNo;
            for (var j = 0; j < order.foodItems.length; j++) {

                var item = order.foodItems[j];
                var itemName = createNameAndQty('', item.name, '');
                var itemQty = createNameAndQty('', item.quantity, '');
                if (j == 0) {
                    tableContent += itemName + itemQty;

                    tableContent += createPrepareButton('', itemsCount, order.id, '');
                    tableContent += createCancelButton('', itemsCount, order.id, '</tr>');

                } else {
                    tableContent += "<tr>" + itemName + itemQty + "</tr>"
                }
            }

        }
        var tableEnd = "</table>";
        tableContent += tableEnd;
        $('#content').html(tableContent);
    }

    function loadData() {
        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        var previous = new Date();
        previous.setHours(0, 0, 0);
        previous.setDate(currentDate.getDate());
        currentDate.setDate(currentDate.getDate() + 1);


        db.collection("Orders")
            .where("status", "==", 'pending')
            .where("dateTime", ">", previous).where("dateTime", "<", currentDate)
            .orderBy("dateTime")
            .onSnapshot(function(snapshot) {
                snapshot.docChanges().forEach(function(change) {
                    if (change.type === "added") {
                        fetchData();
                        return;
                    }
                    if (change.type === "modified") {
                        fetchData();
                        return;
                    }
                    if (change.type === "removed") {
                        fetchData();
                        return;
                    }
                });
            });
    }

    async function sendNotificationToUser(id, msg, title) {

        var cusID;
        var docRef = await db.collection("Orders").doc(id);
        await docRef.get().then(function(doc) {
            if (doc.exists) {
                var orderData = doc.data();
                if (orderData != null) {
                    cusID = orderData['uid'];
                }
            } else {
                // doc.data() will be undefined in this ca
                console.log("cusId");
            }

        });
        var personName, tokenID;
        var docRef1 = await db.collection("Person").doc(cusID);
        await docRef1.get().then(function(doc) {
            if (doc.exists) {
                var personData = doc.data();
                if (personData != null) {
                    personName = personData['Name'];
                    tokenID = personData['tokenID'];
                }
            } else {
                // doc.data() will be undefined in this ca
                console.log("person");
            }

        });
        if (tokenID != null && personName != null) {
            console.log('sent');
            var api = new Firebase_Messaging();
            var body = "Hi! " + personName + ". " + msg;
            api.sendMsg(title, body, tokenID);
        }

        fetchData();
    }

    $(document).on('click', '#cancelButton', async function() {
        var id = $(this).data("id8");

        await db.collection("Orders").doc(id).update({ status: "cancelled" });
        sendNotificationToUser(id, 'We are extremely sorry that we had to cancel your order due to some reasons. We appologise for any inconvenience caused to you.\nThe amount of this order will be refuned as a voucher to you and you can utilize it in your future orders', 'Order Cancelled!');

    });



    $(document).on('click', '#prepareButton', async function() {
        var id = $(this).data("id7");

        await db.collection("Orders").doc(id).update({ status: "prepared" });
        sendNotificationToUser(id, 'Feeling Hungry!\nYour wait is over\nHead towards the counter to get your meal.', 'Order Prepared!');
    });

    fetchData();
    loadData();
});