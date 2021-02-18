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

	async function fetchData(){
	var currentDate=new Date(Date.now());//testing purpose

	var previous=new Date();
	previous.setDate(currentDate.getDate()-1);

	// var currentDate=new Date(Date.now()).toDateString();
	currentDate.setDate(currentDate.getDate()+1);//testing purpose

	var orders=[];

	let ordersRef = await db.collection("Orders")
	.where("status", "==", 'pending')
	.where("dateTime", ">", previous).where("dateTime", "<", currentDate)
	.orderBy("dateTime").limit(5)
	.get();
	for (doc of ordersRef.docs){
		// console.log(`${doc.id} => ${doc.data()}`);
		var orderDoc = doc.data();

		var orderObj=new Order(doc.id,orderDoc['orderNo']);

		let itemsRef = await db.collection("Orders").doc(doc.id).collection("Items").get();
			// console.log(querySnapshot2.size);
			for (doc2 of itemsRef.docs){
				// console.log(`${doc2.id} => ${doc2.data()}`);
				var ItemDataFB=doc2.data();
				var qty=ItemDataFB['quantity'];
				var docRef = await  db.collection("Food Menu").doc("All").collection("Foods").doc(doc2.id);
				await docRef.get().then(function(doc) {
					if (doc.exists) {
						var foodData=doc.data();
						// console.log(foodData['name']+' '+orderDoc['orderNo']);
						var foodObj=new FoodItem(foodData['name'],qty);
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

	function createTableHeaders(){
		var tableHeader="<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th><th>Action</th></tr>";
		return tableHeader;
	}

	function createOrderNoRow(start,itemsCount,orderNo,end){
		var orderNo=start+"<td rowspan='"+itemsCount +"'>"+orderNo+"</td>"+end;
		return orderNo;
	}

	function createNameAndQty(start,text,end){
		var text1=start+"<td>"+text+"</td>"+end;
		return text1;
	}

	function createTableButton(start,itemsCount,id,end){
		var button=start+"<td rowspan='"+itemsCount +"'>"+"<button type='button' data-id7='"+id+"'  class='btn btn-success prepareBtn'>Prepared</button>"+"</td>"+end;
		return button;
	}

	function createTable(orders){
		var tableStart="<table>";
		var tableHeader=createTableHeaders();
		var tableContent=''
		tableContent+= tableStart+tableHeader;
		var rowsData="";
		for (var i =0 ; i< orders.length; i++) {
			var itemsCount=orders[i].foodItems.length;
			var orderNo=createOrderNoRow("<tr>",itemsCount,orders[i].orderNo,'');
			tableContent+=orderNo;
			for (var j = 0; j <orders[i].foodItems.length; j++) {

				var item=orders[i].foodItems[j];
				var itemName=createNameAndQty('',item.name,'');
				var itemQty=createNameAndQty('',item.quantity,'');
				if(j==0){
					tableContent+=itemName+itemQty;

					tableContent+=createTableButton('',itemsCount,orders[i].id,'</tr>');
				}
				else{
					tableContent+="<tr>"+itemName+itemQty+"</tr>"
				}
			}
			
		}
		var tableEnd="</table>";
		tableContent+=tableEnd;
		$('#content').html(tableContent);
	}
	function loadData(){
		var currentDate=new Date(Date.now());//testing purpose

		var previous=new Date();
		previous.setDate(currentDate.getDate()-1);

		currentDate.setDate(currentDate.getDate()+1);//testing purpose


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

	$(document).on('click', '.prepareBtn', async function(){  
		var id=$(this).data("id7");  
		var db = firebase.firestore();

		await db.collection("Orders").doc(id).update({status: "prepared"});

		fetchData();
		// if(confirm("Are you sure you want to delete this?"))  
		// {  
		// 	$.ajax({  
		// 		url:"../php/deleteBus.php",  
		// 		method:"POST",  
		// 		data:{id:id},  
		// 		dataType:"text",  
		// 		success:function(data){  
		// 			// alert(data);  
		// 			fetch_data();  
		// 		}  
		// 	});  
		// }  
	});  

	fetchData();
	loadData();
});