// import firebase from 'firebase/app';
// import 'firebase/firestore';
// document.addEventListener('DOMContentLoaded', event => {
$(document).ready(function() {

    $(document).on('click', '#cancelButton', async function() {
        var id = $(this).data("id8");
        var amount = $(this).data("id9");

        var cusID = $('#prepareButton').data("id6");
        var time = $('#prepareButton').data("id5");

        var currentDate = new Date(Date.now());

        currentDate.setHours(0, 0, 0);
        currentDate.setMonth(currentDate.getMonth() + 6);
        await oDB.changeOrderStatus(id, "cancelled");
        oDB.sendNotificationToUser(id, 'We are extremely sorry that we had to cancel your order due to some reasons. We appologise for any inconvenience caused to you.\nThe amount of this order will be refuned as a voucher to you and you can utilize it within 6 months on your future orders', 'Order Cancelled!', cusID);
        await oDB.addVoucher(amount, currentDate, cusID);
    });

    $(document).on('click', '#prepareButton', async function() {
        var id = $(this).data("id7");
        var cusID = $(this).data('id6');
        var time = $(this).data("id5");
        var amount = $('#cancelButton').data("id9");


        await oDB.changeOrderStatus(id, "prepared");
        oDB.sendNotificationToUser(id, 'Feeling Hungry!\nYour wait is over\nHead towards the counter to get your meal.', 'Order Prepared!', cusID);
        await oDB.updateSale(time, parseInt(amount));
    });

    var oDB = new OrderDBController();

    oDB.fetchData();
    oDB.loadData();
});