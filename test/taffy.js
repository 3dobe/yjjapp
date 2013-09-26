
var taffy = require('taffydb').taffy;

// Create DB and fill it with records
var friends = taffy([
	{"id":1,"gender":"M","first":"John","last":"Smith","city":"Seattle, WA","status":"Active"},
	{"id":2,"gender":"F","first":"Kelly","last":"Ruth","city":"Dallas, TX","status":"Active"},
	{"id":3,"gender":"M","first":"Jeff","last":"Stevenson","city":"Washington, D.C.","status":"Active"},
	{"id":4,"gender":"F","first":"Jennifer","last":"Gill","city":"Seattle, WA","status":"Active"}	
]);

// Kelly's record
var kelly = friends({id:2}).first();
console.log(kelly);

// Kelly's last name
var kellyslastname = kelly.last;

// Get an array of record ids
var ids = friends().select("id");
console.log(ids);

// Get an array of distinct cities
var cities = friends().distinct("city");
console.log(cities);

// Apply a function to all the male friends
friends({gender:"M"}).each(function (r) {
	console.log(r.last + "!");
});

// Move John Smith to Las Vegas
friends({first:"John",last:"Smith"}).update({city:"Las Vegas, NV:"});

// Remove Jennifer Gill as a friend
friends({id:4}).remove();

// insert a new friend
friends.insert({"id":5,"gender":"F","first":"Jennifer","last":"Gill","city":"Seattle, WA","status":"Active"});

console.log(friends({}).get());

console.log(friends({}))
