var {Console} = 'console'
require([Console], result => Console = result)

//Websocekt variables
const url = "ws://localhost:9876/myWebsocket"
const mywsServer = new WebSocket(url)

//DOM Elements
const loginPage = document.getElementById("loginPage")
const user = document.getElementById("username")
const loginBtn = document.getElementById("login")
let userName
const chatPage = document.getElementById("chatApp")
const userprofile = document.getElementById("userprofile")
const myMessages = document.getElementById("messages")
const myInput = document.getElementById("message")
const sendBtn = document.getElementById("send")

loginBtn.disabled=true
sendBtn.disabled=true
loginBtn.addEventListener("click", userLogin, false)
sendBtn.addEventListener("click", sendMsg, false)

function userLogin(){
    console.log("Login Button Clicked...")
    userName = username.value;
    loginPage.style.display = "none";
    sendBtn.disabled = false
    loginBtn.disabled=true   
    chatPage.style.display = "inline";
    const newUser = document.createElement("h3")
    newUser.innerText = `It's ${userName}!`
    userprofile.appendChild(newUser)

}

//Sending message from client
function sendMsg() {
    const text = myInput.value
    msgGeneration(text, "You", true)
    mywsServer.send(userName.toString().concat("@",text))
}

//Creating DOM element to show received messages on browser page
function msgGeneration(msg, from, is_user_self) {
    
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2) // current date
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2) // current month
    let year = date_ob.getFullYear() // current year
    let hours = date_ob.getHours() // current hours
    let minutes = date_ob.getMinutes() // current minutes
    let seconds = date_ob.getSeconds() // current seconds
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let datetime=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    console.log(datetime)
    const newMessage = document.createElement("h5")    
    newMessage.innerText = `[${datetime}] ${from}: ${msg}`
    if(is_user_self){
        newMessage.style.color="grey"
    }else{
        newMessage.style.color="firebrick"
    }
    myMessages.appendChild(newMessage)
}

//enabling send message when connection is open
mywsServer.onopen = function() {    
    loginBtn.disabled=false
}

//handling message event
mywsServer.onmessage = function(event) {
    const { data } = event
    console.log("Message is received...")
    console.log(data)
    let dataContent=data.split("@")
    let user=dataContent.slice(0, 1)
    console.log(user)
    if (user != userName){
        let dataPart=dataContent.slice(1).join("@")
        msgGeneration(dataPart,user, false)
    }    
}

