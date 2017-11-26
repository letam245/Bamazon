var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        console.log("Database connection failed");
        throw err;
    }
    start();
});

function start() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.log("\n====================================================================\n")
        console.table(res);
        console.log("====================================================================\n")
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Which item would you like to order? (item_id)",
            validate: function (value) {
                for (var i = 0; i < res.length; i++) {
                    if (value == res[i].item_id) {
                        return true;
                    }
                }
                return "Sorry this item is not in the inventory. Please enter a valid item_id!";
            }

        }, {
            name: "quantity",
            type: "input",
            message: "how many would you like to order?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) >= 1) {
                    return true;
                }
                else {
                    return "Please enter a whole number of 1 or greater"
                }
            }

        }

        ]).then(function (answer) {
            console.log("\n==================================================")            
            console.log("Answer item: " + answer.item + ". Answer quantity: " + answer.quantity)  
            console.log("==================================================\n")
            order(answer.item, answer.quantity)
            
        })
    })
};

function order(itemOrdered, quantityOrdered) {
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, { item_id: itemOrdered }, function (err, res) {
        if (err) throw err;
        console.log("\nHere is what send back from database\n", res)
        console.log("\n==================================================")                    
        console.log("item ordered: " + itemOrdered + ". Quantity ordered: " + quantityOrdered)
        console.log("==================================================\n")
        if (res[0].stock_quantity >= quantityOrdered) {
            successOrder(itemOrdered, quantityOrdered);
        }
        else {
            failOrder(res[0].product_name, quantityOrdered, res[0].stock_quantity);
        }

    })
};

function failOrder(productOrdered, quantityOrdered, quantityAvailable) {

    console.log("\n+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=")
    console.log("Sorry! Not enough in inventory. Only", quantityAvailable, productOrdered + "s", "available.");
    console.log("+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=\n")


    start();
};


function successOrder(itemOrdered, quantityOrdered) {
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, { item_id: itemOrdered }, function (err, res) {
        if (err) throw err;

        var unitPrice = res[0].price;

        var itemName = res[0].product_name;

        var newQuantity = res[0].stock_quantity - quantityOrdered;

        connection.query('UPDATE products SET ? WHERE ?', [{ stock_quantity: newQuantity }, { item_id: itemOrdered }], function (err, res) {
            if (err) throw err;

            console.log("\n~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=")
            console.log("Here is your ordered summary:");
            console.log(quantityOrdered, itemName + "s at $" + unitPrice + " each");
            console.log("Your total is : $" + unitPrice * quantityOrdered);
            console.log("~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=\n")


            start();
        })
    })
}
