// Initialize Firebase
var config = {
  apiKey: "AIzaSyD1FRK8r-CeYIFsEJ16h2pV7GQtwY4gKWQ",
  authDomain: "train-schedule2.firebaseapp.com",
  databaseURL: "https://train-schedule2.firebaseio.com",
  storageBucket: "train-schedule2.appspot.com",
  messagingSenderId: "1016117392378"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Click Button changes what is stored in firebase
$("#submit-button").on("click", function() {

	// Get inputs
	trainName = $("#inputTrainName").val().trim();
	destination = $("#inputDestination").val().trim();
	firstTrainTime = $("#inputFirstTrainTime").val().trim();
	frequency = $("#inputFrequency").val().trim();

  //Change what is saved in firebase
  //database.ref().set({
  var newTrain = database.ref().push();
  newTrain.set({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency 
  });

  //clear forms
  $("#inputTrainName").val("");
  $("#inputDestination").val("");
  $("#inputFirstTrainTime").val("");
  $("#inputFrequency").val("");

  // Prevent the page from refreshing
  return false;

}); //end click event function

database.ref().on("child_added", function(snapshot) {

  // Log everything that's coming out of snapshot
  console.log(snapshot.val().trainName);
  console.log(snapshot.val().destination);
  //console.log(snapshot.val().email);
  console.log(snapshot.val().firstTrainTime);
  console.log(snapshot.val().frequency );
  //console.log(snapshot.val().joinDate);

  //figuure out minutes until next train arrival 
  var firstTrain = moment(snapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTrain), "minutes");
  var tRemainder = diffTime % snapshot.val().frequency;
  var minutesAway = snapshot.val().frequency - tRemainder;
  var nextArrival = moment().add(minutesAway, "minutes");
  
  //console log for debug purposes   
  console.log("first train math " + firstTrain);  
  console.log("diffTime is" + diffTime);
  console.log("remainder is " + tRemainder);
  console.log("minutesAway is " + minutesAway);
  console.log("current time is " + moment());
  console.log("next Arrival is " + nextArrival);

  // append train data to the table 
  $("#trainTableData").append("<tr><td>" + snapshot.val().trainName +
  "</td><td>" + snapshot.val().destination +
  " </td><td> " + snapshot.val().frequency +
  " </td><td> " + moment(nextArrival).format("hh:mm") + 
  " </td><td> " + minutesAway + 
  "</td></tr>");

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });