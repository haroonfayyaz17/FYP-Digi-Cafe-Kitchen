class Table {

    createTableHeaders() {
        return "<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th><th>Delivery/Pick Up</th><th>Prepare</th><th>Cancel</th></tr>";
    }

    createOrderNoRow(start, itemsCount, orderNo, end) {
        return start + "<td class='firstCol' rowspan='" + itemsCount + "'>" + orderNo + "</td>" + end;
    }

    createNameAndQty(start, cssClass, rowSpan, text, end) {
        if (rowSpan != '')
            return start + "<td class ='" + cssClass + "'rowspan='" + rowSpan + "'>" + text + "</td>" + end;
        else
            return start + "<td class ='" + cssClass + "'>" + text + "</td>" + end;

    }


    createPrepareButton(start, itemsCount, id, end, cusID, time, deliveryType) {
        return start + "<td class='firstCol' rowspan='" + itemsCount + "'>" + "<button type='button' id='prepareButton' data-id='" + id + "' data-cusid='" + cusID + "' data-time='" + time + "' data-type='" + deliveryType + "'  class='btn btn-success prepareBtn'>Prepared</button>" + "</td>" + end;
    }

    createCancelButton(start, itemsCount, id, end, amount) {
        return start + "<td class='firstCol' rowspan='" + itemsCount + "'>" + "<button type='button' id='cancelButton' data-id='" + id + "' data-amount='" + amount + "'  class='btn btn-danger prepareBtn'>Cancel</button>" + "</td>" + end;
    }

    createTable(orders) {
        var tableStart = "<table>";
        var tableHeader = this.createTableHeaders();
        var tableContent = ''
        tableContent += tableStart + tableHeader;
        for (let order of orders) {
            var itemsCount = order.foodItems.length;
            var orderNo = this.createOrderNoRow("<tr>", itemsCount, order.orderNo, '');
            tableContent += orderNo;
            for (var j = 0; j < order.foodItems.length; j++) {

                var item = order.foodItems[j];
                var cssClass = '';
                if (j == 0)
                    cssClass = 'headT';
                else if (j == order.foodItems.length - 1)
                    cssClass = 'footT';
                else
                    cssClass = 'midT';
                var itemName = this.createNameAndQty('', cssClass, '', item.name, '');
                var itemQty = this.createNameAndQty('', cssClass, '', item.quantity, '');
                if (j == 0) {
                    tableContent += itemName + itemQty;
                    tableContent += this.createNameAndQty('', cssClass, itemsCount, order.delivery, '');
                    tableContent += this.createPrepareButton('', itemsCount, order.id, '', order.cusID, order.orderTime, order.delivery);
                    tableContent += this.createCancelButton('', itemsCount, order.id, '</tr>', order.amount);

                } else {
                    tableContent += "<tr>" + itemName + itemQty + "</tr>"
                }
            }

        }
        var tableEnd = "</table>";
        tableContent += tableEnd;
        $('#content').html(tableContent);
    }
}