var inquirer = require('inquirer');
var consoleTable = require('console.table');
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  listItems();
});


//This function lists the items that are currently in the database//
function listItems() {
  
  console.log("BAMAZON:  IT'S LIKE AMAZON EXCEPT THERE'S A 'B' IN THE FRONT OF....NEVERMIND.");
  console.log("HERE ARE OUR ITEMS FOR SALE...");
  var query = connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log("============================================================");
  
  
  inquirer.prompt([
    /* Pass your questions in here */

    {
      type: 'input',
      name: 'ID',
      message: 'What is the ID# of the item you would like to buy?',
     },

     {
      type: 'input',
      name: 'Quantity',
      message: 'How many would you like to buy?'
     }

  ]).then(answers => {
            var chosenId = answers.ID - 1
            var chosenQuantity = answers.Quantity
            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answers.Quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price.toFixed(2) * chosenQuantity);
                console.log("===========================================================");
                console.log("YOUR ITEMS WILL BE SHIPPED VIA TELEPORTATION TUBES!");
                console.log("THANK YOU FOR SHOPPING BAMAZON!  IT'S JUST LIKE AMAZON EXCEPT WITH A ......NEVERMIND");
                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            var query = connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: res[chosenId].stock_quantity - chosenQuantity
                },
                {
                    item_id: chosenId + 1
                }
                ], function(err, res) {
                    //console.log(err);
                    listItems();
                });

            } else {
                console.log("===============================================================");
                console.log("Sorry, insufficient Quantity at this time. There are only " + res[chosenId].stock_quantity + " remaining in our INVENTORY!");
                console.log("================================================================")
                listItems();
            };
        })
    });
  };

