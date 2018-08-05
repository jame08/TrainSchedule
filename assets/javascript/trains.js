
var config = {
    apiKey: "AIzaSyBk7wihOV0MlALO8xNMWmNdxPGBIkceVio",
    authDomain: "first-29c2e.firebaseapp.com",
    databaseURL: "https://first-29c2e.firebaseio.com",
    projectId: "first-29c2e",
    storageBucket: "first-29c2e.appspot.com",
    messagingSenderId: "566528707162"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrain = 0;
  var freq = 0;

  //Get the current time and display it on the HTML
  function currentTime() {
    var current = moment().format('LT');
    $("#current-time").html(current);
    setTimeout(currentTime, 1000);
  };


  //store form data on session storage 
  
$(".form-data").on("keyup", function () {
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    freq = $("#frequency").val().trim();
    sessionStorage.setItem("trainName", trainName);
    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("firstTrain", firstTrain);
    sessionStorage.setItem("frequency", freq);

})

$("#train-name").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));


database.ref().on("child_added", function(snap) {
    var startTimeConverted = moment(snap.val().startTime, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = (timeDiff % snap.val().frequency) - 1;
    var minToArrival = snap.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var newListItem = $("<tr>");
    newListItem.append($("<td>" + snap.val().trainName + "</td>"));
    newListItem.append($("<td>" + snap.val().destination + "</td>"));
    newListItem.append($("<td class='text-center font-weight-bold'>" + snap.val().frequency + "</td>"));
    newListItem.append($("<td class='text-center font-weight-bold'>" + moment(nextTrain).format("LT") + "</td>"));
    newListItem.append($("<td class='text-center font-weight-bold'>" + minToArrival + "</td>"));
    newListItem.append($("<td class='text-center font-weight-bold'><button class='arrival btn btn-danger btn-xs' data-key='" + snap.key + "'>X</button></td>"));
     if (minToArrival < 3) {
      newListItem.addClass("danger");
    }
     $("#table-body").append(newListItem);
   });
   $(document).on("click", ".arrival", function() {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
});

    $(".submit").on("click", function(event) {
        event.preventDefault();
         if ($("#train-name").val().trim() === "" ||
          $("#destination").val().trim() === "" ||
          $("#first-train").val().trim() === "" ||
          $("#frequency").val().trim() === "") {
           alert("All field must be filled.");
         } else {
          trainName = $("#train-name").val().trim();
          destination = $("#destination").val().trim();
          startTime = $("#first-train").val().trim();
          frequency = $("#frequency").val().trim();
           $(".form-data").val("");
           database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            startTime: startTime,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
          });
           sessionStorage.clear();
        }
       });


   currentTime();
   setInterval(function() {
    window.location.reload();
  }, 57000);


