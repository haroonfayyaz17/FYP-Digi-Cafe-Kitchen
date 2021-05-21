class Order {
    constructor(id, orderNo, amount, cusID) {
        this.id = id;
        this.orderNo = orderNo;
        this.amount = amount;
        this.cusID = cusID;
        this.foodItems = [];
    }

    addOrderItem(foodItem) {
        this.foodItems.push(foodItem);
    }
}