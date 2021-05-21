class Table {

    createTableHeaders() {
        return "<tr><th>Order Number</th><th>Ordered Items</th><th>Order Quantity</th><th>Prepare</th><th>Cancel</th></tr>";
    }

    createOrderNoRow(start, itemsCount, orderNo, end) {
        return start + "<td rowspan='" + itemsCount + "'>" + orderNo + "</td>" + end;
    }

    createNameAndQty(start, text, end) {
        return start + "<td>" + text + "</td>" + end;
    }

    createPrepareButton(start, itemsCount, id, end, cusID) {
        return start + "<td rowspan='" + itemsCount + "'>" + "<button type='button' id='prepareButton' data-id7='" + id + "' data-id6='" + cusID + "'  class='btn btn-success prepareBtn'>Prepared</button>" + "</td>" + end;
    }

    createCancelButton(start, itemsCount, id, end, amount) {
        return start + "<td rowspan='" + itemsCount + "'>" + "<button type='button' id='cancelButton' data-id8='" + id + "' data-id9='" + amount + "'  class='btn btn-danger prepareBtn'>Cancel</button>" + "</td>" + end;
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
                var itemName = this.createNameAndQty('', item.name, '');
                var itemQty = this.createNameAndQty('', item.quantity, '');
                if (j == 0) {
                    tableContent += itemName + itemQty;

                    tableContent += this.createPrepareButton('', itemsCount, order.id, '', order.cusID);
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