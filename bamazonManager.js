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
    connection.query("SELECT * FROM products", function (err, res) {
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

function addToInventory(){
    
}