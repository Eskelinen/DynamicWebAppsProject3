//Enabling event listeners when page is loaded.
$(document).ready(function () {
    //These are for the input field. User input is sent with either a click or by pressing the 'Enter' key.
    $("#add").on("click", addToTable);
    $("#textfield").on("keypress", function (event) {
        if (event.key === "Enter") {
            $("#add").click();
        }
    });
    //These are for the buttons in the table.
    $("#table").on("click", "#remove", removeFromTable);
    $("#table").on("click", "#done", markAsDone);
    $("#table").on("click", "#notDone", notDone);
    //The table also has to be loaded right away on page load.
    loadTable();
});
//Function to count the number of tasks left, number is displayed below the table.
function countTasks() {
    //If count of tasks is 1, counter should say 'thing' instead of 'things'.
    var rowCount = $("#table tr").length;
    if (rowCount - doneCount == 1) {
        $("#howMany").html("You have " + (rowCount - doneCount) + " thing to do");
    } else {
        $("#howMany").html("You have " + (rowCount - doneCount) + " things to do");
    }
}
//Function to save the entire HTML table and count of tasks to localStorage.
function saveToStorage() {
    localStorage.setItem("thingsToDo", $("#table").html());
    localStorage.setItem("thingsDone", doneCount);
}
//Function to add tasks to table.
function addToTable() {
    //Validating user input, if text isn't between 1-20 characters user will be notified by a red message.
    var chara = $("#textfield").val();
    if (chara.length < 1 || chara.length > 20) {
        $("#textfield").css("border-color", "red").val("");
        $("#error").html("The length of your input must be between 1-20 characters!").css("color", "red");
    }
    else {
        //Creating new row with all the required buttons and text input by user.
        $("#table").prepend("<tr style=\"opacity:0;\"><td></td><td>" + $("#textfield").val() + "</td><td><button class=\"button-small pure-button\" id=\"done\">Done</button></td><td><button class=\"button-small pure-button\" id=\"remove\">Remove</button></td></tr>");
        /*Fade effect when new row is added. 
        Saving to localStorage has to be done as a callback function or table will be saved with wrong opacity settings.*/
        $("#table tr:first").fadeTo("slow", 1, function () {
            saveToStorage();
        });
        //Textfield is cleared and returns to initial colours. Possible error message disappears.
        $("#textfield").val("").css("border-color", "black");
        $("#error").html("");
        countTasks();
    }
}
//Function to remove row from table.
function removeFromTable() {
    //Going through the element tree and finding the correct row to delete.
    var rowIndex = $(this).parent().parent().index();
    //If task is marked done, doneCounter is ignored.
    if ($("#table tr:eq(" + rowIndex + ") td:eq(0)").html() != "✓") {
        //Because of fadeOut effect, saving and displaying the task count are done inside the callback function.
        $(this).parent().parent().fadeOut("slow", function () {
            $("#table tr:eq(" + rowIndex + ")").remove();
            saveToStorage();
            countTasks();
        });
        //If task is not marked as done, it will be counted into the doneCounter.
    } else {
        $(this).parent().parent().fadeOut("slow", function () {
            doneCount = doneCount - 1;
            $("#table tr:eq(" + rowIndex + ")").remove();
            saveToStorage();
            countTasks();
        });
    }
}
//Making sure doneCounter comes back from localStorage as a integer and not a string.
var newDoneCount = Number(localStorage.getItem("thingsDone"));
var doneCount = 0 + newDoneCount;
//Function to mark task as done.
function markAsDone() {
    //Adding to the doneCounter.
    doneCount = doneCount + 1;
    //Green checkmark appears and text is styled with line-through. Button id is changed to enable notDone() function.
    var rowIndex = $(this).parent().parent().index();
    $("#table tr:eq(" + rowIndex + ") td:eq(0)").html("✓").css("color", "green");
    $("#table tr:eq(" + rowIndex + ") td:eq(1)").css("text-decoration", "line-through");
    $("#table tr:eq(" + rowIndex + ") td:eq(2)").html("<button class=\"button-small pure-button\" id=\"notDone\">Done</button>");
    saveToStorage();
    countTasks();
}
//Function to undo a task that has already been marked as done.
function notDone() {
    //Making sure doneCounter is correct.
    doneCount = doneCount - 1;
    //Cells are changed back to their initial form.
    var rowIndex = $(this).parent().parent().index();
    $("#table tr:eq(" + rowIndex + ") td:eq(0)").html("");
    $("#table tr:eq(" + rowIndex + ") td:eq(1)").css("text-decoration", "initial");
    $("#table tr:eq(" + rowIndex + ") td:eq(2)").html("<button class=\"button-small pure-button\" id=\"done\">Done</button>");
    saveToStorage();
    countTasks();
}
//Function to load table on page load.
function loadTable() {
    $("#table").html(localStorage.getItem("thingsToDo"));
    countTasks();
}