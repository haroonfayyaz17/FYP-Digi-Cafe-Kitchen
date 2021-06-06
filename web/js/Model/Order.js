class Order {
    constructor(id, orderNo, amount, orderTime, cusID) {
        this.id = id;
        this.orderNo = orderNo;
        this.amount = amount;
        this.cusID = cusID;
        this.orderTime = orderTime;
        this.foodItems = [];
    }

    addOrderItem(foodItem) {
        this.foodItems.push(foodItem);
    }
}