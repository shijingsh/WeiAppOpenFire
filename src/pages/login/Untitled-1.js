
const btoa = require('../../sdk/base64.min').btoa
var username = 'fizz'
var password = '123456'
var to = "win10-2020bwunu";
var temp = username + "@" + to + " " + password;
//Base64编码
// var token = temp;
var token = btoa(temp);
console.log(token)

// Zml6ekB3aW4xMC0yMDIwYnd1bnUAMTIzNDU2
// Zml6ekB3aW4xMC0yMDIwYnd1bnUgMTIzNDU2