class Order {
  constructor(id,orderNo) {
  	this.id=id;
  	this.orderNo=orderNo;
    this.foodItems = [];
  }

  addOrderItem(foodItem){
  	this.foodItems.push(foodItem);
  }
}