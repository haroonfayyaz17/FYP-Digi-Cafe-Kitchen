// import firebase from 'firebase/app';
// import 'firebase/firestore';
// document.addEventListener('DOMContentLoaded', event => {
$(document).ready(function() {

    $(document).on('click', '#cancelButton', async function() {
        var id = $(this).data("id");
        var amount = $(this).data("amount");


        var cusID = $('#prepareButton').data("cusID");

        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        currentDate.setMonth(currentDate.getMonth() + 6);
        await oDB.changeOrderStatus(id, "cancelled");
        oDB.sendNotificationToUser(id, 'We are extremely sorry that we had to cancel your order due to some reasons. We appologise for any inconvenience caused to you.\nThe amount of this order will be refuned as a voucher to you and you can utilize it within 6 months on your future orders', 'Order Cancelled!', cusID);
        await oDB.addVoucher(amount, currentDate, cusID);
        await oDB.updateStock(id);

    });

    $(document).on('click', '#prepareButton', async function() {
        var id = $(this).data("id");
        var cusID = $(this).data('cusID');
        var time = $(this).data("time");
        var amount = $('#cancelButton').data("amount");
        var dType = $(this).data("type");
        if (dType == 'Pick Up')
            await oDB.changeOrderStatus(id, "prepared");
        else
            await oDB.changeOrderStatus(id, "past");
        oDB.sendNotificationToUser(id, 'Feeling Hungry!\nYour wait is over\nHead towards the counter to get your meal.', 'Order Prepared!', cusID);
        await oDB.updateSale(time, parseInt(amount));
    });

    var oDB = new OrderDBController();

    oDB.fetchData();
    oDB.loadData();
});