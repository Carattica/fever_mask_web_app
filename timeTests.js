function dateToString(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
}

var today = new Date();

if (today.getDay() == 0) {
    console.log('Sunday...');
    var upperLimit = new Date();
    console.log(dateToString(upperLimit));

    var lowerLimit = new Date();
    lowerLimit.setDate(lowerLimit.getDate() - 7);
    console.log(dateToString(lowerLimit));
}
else {
    console.log('Not Sunday...');
    console.log(today.getDay());

    var upperLimit = new Date();
    upperLimit.setDate(upperLimit.getDate() - today.getDay());
    var Saturday = new Date();
    Saturday.setDate(upperLimit.getDate() - 1);
    
    var lowerLimit = new Date();
    lowerLimit.setDate(lowerLimit.getDate() - (7 + today.getDay()));
}

console.log(`[${dateToString(lowerLimit)}, ${dateToString(Saturday)})`);