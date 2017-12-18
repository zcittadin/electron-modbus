var { ipcRenderer } = require('electron');
var Sequelize = require("sequelize");
var sequelize = new Sequelize('mysql://root:root@localhost:3306/electron');
var List = require('list.js');

var values = [];

btnSave.addEventListener('click', saveData);

var $ = function (selector) {
    return document.querySelector(selector);
};

sequelize.authenticate().then(() => {
    console.log('Connection successfully made.');
}).catch(err => {
    console.error('Error connecting to database', err);
});

var Book = sequelize.define('book', {
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.DOUBLE
    }
});

findAll();

var tableOptions = {
    valueNames: ['name', 'price'],
    item: `<tr><td class="name"></td><td class="price"></td><td><button type="button" class="btn btn-success">Edit</button>
            <button type="button" class="btn btn-danger">Delete</button></td><tr>`
};

function findAll() {
    values = [];
    Book.findAll().then(books => {
        books.forEach(book => {
            values.push(book.dataValues);
        });
        var bookTable = new List('bookTable', tableOptions, values);

        var btEdit = $('#bookTable').getElementsByClassName('btn-success');
        for (var i = 0; i < btEdit.length; i++) {
            var btn = btEdit[i];
            btn.addEventListener('click', editItem);
        }
        var btDelete = $('#bookTable').getElementsByClassName('btn-danger');
        for (var i = 0; i < btDelete.length; i++) {
            var btn = btDelete[i];
            btn.addEventListener('click', deleteItem);
        }

    });
}

function saveData() {
    var name;
    var price;
    name = $(".modal-body #name").val();
    price = $(".modal-body #price").val();
    Book.sync().then(() => {
        $("#exampleModal").modal("hide");
        return Book.create({
            name: name,
            price: price
        });
    });
    findAll();
}

function editItem() {
    console.log("EDIT");
}

function deleteItem() {
    console.log("DELETE");
}