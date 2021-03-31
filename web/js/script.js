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

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    const db = firebase.firestore();

    async function fetchData() {
        // var currentDate=new Date(Date.now()).setHours( 0,0,0,0 );
        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        var previous = new Date();
        previous.setHours(0, 0, 0);
        // console.log(currentDate);
        previous.setDate(currentDate.getDate());
        // console.log(previous);

        // var currentDate=new Date(Date.now()).toDateString();
        currentDate.setDate(currentDate.getDate() + 1);

        var orders = [];
        // console.log(previous);
        // console.log(currentDate);
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
            // console.log(querySnapshot2.size);
            for (var doc2 of itemsRef.docs) {
                // console.log(`${doc2.id} => ${doc2.data()}`);
                var ItemDataFB = doc2.data();
                var qty = ItemDataFB['quantity'];
                var docRef = await db.collection("Food Menu").doc("All").collection("Foods").doc(doc2.id);
                await docRef.get().then(function(doc) {
                    if (doc.exists) {
                        var foodData = doc.data();
                        // console.log(foodData['name']+' '+orderDoc['orderNo']);
                        var foodObj = new FoodItem(foodData['name'], qty);
                        orderObj.addOrderItem(foodObj);
                    } else {
                        // doc.data() will be undefined in this ca
                        console.log("No such document!");
                    }
                });
            }
            orders.push(orderObj);
            // console.log(order['dateTime']+' '+order['status']);

        }
        // console.log('6');
        createTable(orders);

    }

    function createTableHeaders() {
        var tableHeader = "<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th><th>Action</th></tr>";
        return tableHeader;
    }

    function createOrderNoRow(start, itemsCount, orderNo, end) {
        var orderNo = start + "<td rowspan='" + itemsCount + "'>" + orderNo + "</td>" + end;
        return orderNo;
    }

    function createNameAndQty(start, text, end) {
        var text1 = start + "<td>" + text + "</td>" + end;
        return text1;
    }

    function createTableButton(start, itemsCount, id, end) {
        var button = start + "<td rowspan='" + itemsCount + "'>" + "<button type='button' data-id7='" + id + "'  class='btn btn-success prepareBtn'>Prepared</button>" + "</td>" + end;
        return button;
    }

    function createTable(orders) {
        var tableStart = "<table>";
        var tableHeader = createTableHeaders();
        var tableContent = ''
        tableContent += tableStart + tableHeader;
        var rowsData = "";
        for (var i = 0; i < orders.length; i++) {
            var itemsCount = orders[i].foodItems.length;
            var orderNo = createOrderNoRow("<tr>", itemsCount, orders[i].orderNo, '');
            tableContent += orderNo;
            for (var j = 0; j < orders[i].foodItems.length; j++) {

                var item = orders[i].foodItems[j];
                var itemName = createNameAndQty('', item.name, '');
                var itemQty = createNameAndQty('', item.quantity, '');
                if (j == 0) {
                    tableContent += itemName + itemQty;

                    tableContent += createTableButton('', itemsCount, orders[i].id, '</tr>');
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
        // console.log(currentDate);
        previous.setDate(currentDate.getDate());
        // console.log(previous);

        // var currentDate=new Date(Date.now()).toDateString();
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

    $(document).on('click', '.prepareBtn', async function() {
        var id = $(this).data("id7");
        var db = firebase.firestore();

        await db.collection("Orders").doc(id).update({ status: "prepared" });
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
        console.log(tokenID+" "+personName);
        if (tokenID != null && personName != null) {
            console.log('sent');
            var api = new Firebase_Messaging();
            var body = "Hi! " + personName + ". Feeling Hungry!\nYour wait is over\nHead towards the counter to get your meal.";
            api.sendMsg("Order Prepared!", body, "eFjShBqRQ9OdbuZMXFQp1d:APA91bHoPzstd6Yxu6WF_SNzG8HOfF3siWm5zEAmoDlu89_RoV_UzwAK19gQA2YrQc1fAPUAPs3aabPwvu8ixonDfEjGPLKbWikFEKnH9mXoGmjnMCjf8ExGBorJE2z9tEqg_MnRyEMZ");
        }

        fetchData();
    });

    fetchData();
    loadData();
});