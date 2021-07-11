const express = require('express')
const app = express()
const port = 3000

//body parser

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');
// app.use(express.static('/public'));

//firebase 

const firebase = require("firebase");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyAlQz8HnnV5zMUrl8jjMTr6vILaooSgAZ8",
    authDomain: "todoappexpress-72e33.firebaseapp.com",
    projectId: "todoappexpress-72e33",
    storageBucket: "todoappexpress-72e33.appspot.com",
    messagingSenderId: "301761864746",
    appId: "1:301761864746:web:2b888cc840ba837ddc0f53",
    measurementId: "G-R0MBMXYXWP"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//MAIN

//get to do list

var todoList = [];

function getTodoList() {
    todoList = [];
    var counter = 0;
    db.collection("todocollection").get().then((snap) => {
        snap.forEach((doc) => {
            todoList.push(doc.data());
            todoList[counter].id = doc.id;
            counter++;
        });
        // console.log(todoList);
    })
}

//get to do list for first load

app.get('/',(req,res) => {
  res.render("index",{todos:todoList});
})

// fake to do list for calling in other method - promise type

function getTodoListFake(callback) {
    todoList = [];
    var counter = 0;
    db.collection("todocollection").get().then((snap) => {
        snap.forEach((doc) => {
            todoList.push(doc.data());
            todoList[counter].id = doc.id;
            counter++;
        });
        // console.log(todoList);
    }).then(() => {
        callback();
    })
    
}

// add, update, delete function

getTodoList();

app.post("/delete",(req,res) => {
    db.collection("todocollection").doc(req.body.todoId).delete()
    .then(() => {
        getTodoListFake(() => {
            res.redirect("/")
        })
    })
})

app.post("/update",(req,res) => {
    db.collection("todocollection").doc(req.body.todoId).update({
        status: !JSON.parse(req.body.todoStatus),
    })
    .then(() => {
        getTodoListFake(() => {
            res.redirect("/")
        })
    })
})

app.post('/',(req,res) => {
    db.collection("todocollection").add({
        status: true,
        todo: req.body.content
    })
    .then(() => {
        getTodoListFake(() => {
            res.redirect("/")
        })
    })
})

//listen port

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})