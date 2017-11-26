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
    managerStart();
});

function managerStart() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "what would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function (answer) {
        switch (answer.options) {
            case "View Products for Sale":
                viewProduct();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    })
};

function viewProduct() {
    connection.query("SELECT * FROM products ORDER BY department_name", function (err, res) {
        if (err) throw err;
        console.log("\n====================================================================\n")
        console.table(res);
        console.log("====================================================================\n")
        managerStart();
    })
};

function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        console.log("\n====================================================================\n")
        console.table(res);
        console.log("====================================================================\n")
        managerStart();
    })
}

function addToInventory(answer) {
    // bid was high enough, so update db, let the user know, and start over
    connection.query('SELECT * FROM products ORDER BY department_name', function (err, res) {
        if (err) throw err;
        console.log("\n====================================================================\n")
        console.table(res);
        console.log("====================================================================\n")

        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "which item would you like to add to inventory? (enter item_id)",
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
                message: "how many would you like to add in the inventory?",
                validate: function (value) {
                    if (isNaN(value) === false && parseInt(value) >= 1) {
                        return true;
                    }
                    else {
                        return "Please enter a whole number of 1 or greater"
                    }
                }

            }]).then(function (answer) {
                var oldQuantity = 0;
                var itemName;
                console.log(res)
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id == answer.item) {
                        oldQuantity = res[i].stock_quantity;
                        itemName = res[i].product_name;
                    }
                }

                var newQuantity = parseInt(answer.quantity) + parseInt(oldQuantity)
                var itemAddedID = answer.item;

                connection.query(
                    'UPDATE products SET ? WHERE ?',
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            item_id: itemAddedID
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("\n--------------------------------------------------------")
                        console.log("Added", answer.quantity, itemName + "s to inventory successfully");
                        console.log("--------------------------------------------------------\n")
                        viewProduct();
                        //managerStart();

                    });
            });
    }
    );
};


function addNewProduct(answer) {

    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "What is the name of the product you would like to add?",
        },
        {
            name: "department",
            type: "input",
            message: "Which department this product belong to?"

        },
        {
            name: "price",
            type: "input",
            message: "How much this product cost?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0) {
                    return true;
                }
                else {
                    return "Please enter valid price!"
                }
            }

        },
        {
            name: "quantity",
            type: "input",
            message: "What quantity would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) >= 1) {
                    return true;
                }
                else {
                    return "Please enter valid price!"
                }
            }

        }
    ]).then(function (answer) {
        connection.query(
            'INSERT INTO products SET ?',

            {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log("\n--------------------------------------------------------")
                console.log("New product added: ", answer.quantity, "|", answer.product + " | " + " Department: " + answer.department + " | $" + answer.price + " each");
                console.log("--------------------------------------------------------\n")
                viewProduct();
                // managerStart();

            });
    });
};
