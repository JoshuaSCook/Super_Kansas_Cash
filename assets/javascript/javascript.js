function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var winRules = [
    "5 Balls + PB: JACKPOT! (Odds: 1 in 2,517,200)",
    "5 Balls: $2000 (Odds: 1 in 104,883)",
    "4 Balls + PB: $250 (Odds: 1 in 18,646)",
    "4 Balls: $25 (Odds: 1 in 777)",
    "3 Balls + PB: $25 (Odds: 1 in 717)",
    "3 Balls: $2 (Odds: 1 in 30)",
    "2 Balls + PB: $2 (Odds: 1 in 86)",
    "1 Balls + PB: $1 (Odds: 1 in 29)"
];

var winElement = $("#win-rules");
for (i = 0; i < winRules.length; i++) {
    var winRule = $("<li>" + winRules[i] + "</li>");
    winElement.append(winRule);
}

// Game logic
// ================
var userNumbers = [];
var userPB = 0;
var buttonsElement = $("#numbers");
var lottoElement = $("#lotto-numbers");
var pbElement = $("#pb-number");
var jackpot = 4000000;

for (i = 1; i <= 31; i++) {
    var btn = $("<button>" + i + "</button>");
    btn.attr("id", "btn-" + i);
    btn.attr("class", "button");
    btn.attr("value", i);            
    buttonsElement.append(btn);
};

for (i = 1; i <= 31; i++) {
    // For the first 5 buttons clicked, the coorisponding value is added
    // to the user's number array
    $("#btn-" + i).on("click", function () {
        if (userNumbers.length < 5) {
            var btnValue = $(this).attr("value");
            userNumbers.push(Number(btnValue));
            $(this).prop("disabled", true);
            $(this).css("background-color", "lime");
            $(this).css("color", "white");
            $(this).css("text-shadow", "1px 1px black");
        }

        // For the 6th button clicked, the coorisponding value is set as
        // the user PB
        else if (userNumbers.length === 5) {
            if (userPB === 0) {
                var btnValue = $(this).attr("value");
                userPB = btnValue;
                $(this).prop("disabled", true);
                $(this).css("background-color", "red");
                $(this).css("color", "white");
                $(this).css("text-shadow", "1px 1px black");
                $("#play").prop("disabled", false);
            };
        };
    });
};

// Choose random numbers
$("#random-numbers").on("click", function () {
    while (userNumbers.length < 5) {
        var randomNumber = Math.floor(Math.random() * 31) + 1;
        while (userNumbers.includes(randomNumber) === true) {
            randomNumber = Math.floor(Math.random() * 31) + 1;
        };
        while (randomNumber === userPB) {
            randomNumber = Math.floor(Math.random() * 31) + 1;
        };
        userNumbers.push(randomNumber);

        if (userPB !== 0) {
            $("#play").prop("disabled", false);
        };

        $("#btn-" + randomNumber).prop("disabled", true);
        $("#btn-" + randomNumber).css("background-color", "lime");
        $("#btn-" + randomNumber).css("color", "white"); 
        $("#btn-" + randomNumber).css("text-shadow", "1px 1px black");
    };
});

// Choose random powerball
$("#random-pb").on("click", function () {
    var randomNumber = Math.floor(Math.random() * 31) + 1;
        while (userNumbers.includes(randomNumber) === true) {
            randomNumber = Math.floor(Math.random() * 31) + 1;
        };

    if (userPB === 0) {
        userPB = randomNumber;
        $("#btn-" + randomNumber).prop("disabled", true);
        $("#btn-" + randomNumber).css("background-color", "red");
        $("#btn-" + randomNumber).css("color", "white");
        $("#btn-" + randomNumber).css("text-shadow", "1px 1px black");
        if (userNumbers.length === 5) {
            $("#play").prop("disabled", false);
        };
    };
});

// On reset, change multiple objects back to original state
$("#reset").on("click", function () {
    userNumbers = [];
    userPB = 0;
    $("#reward").empty();
    $("#lotto-numbers").empty();
    $("#pb-number").empty();
    $(".button").prop("disabled", false);
    $(".button").css("background-color", "");
    $(".button").css("color", "");
    $(".button").css("text-shadow", "");
    $("#play").prop("disabled", true);
});

// When play button is avalible and clicked, run the simulation
$("#play").on("click", function () {
    $("#reward").empty();
    $("#lotto-numbers").empty();
    $("#pb-number").empty();
    userNumbers.sort(function(a, b){return a-b});
    console.log("User: " + userNumbers + " PB:" + userPB);

    // Generate 5 lotto numbers + PB
    var lottoNumbers = [];
    for (i = 0; i < 6; i++) {
        var randomNumber = Math.floor(Math.random() * 31) + 1;
        while (lottoNumbers.includes(randomNumber) === true) {
            randomNumber = Math.floor(Math.random() * 31) + 1;
        };
        lottoNumbers.push(randomNumber);
    };           
    var lottoPB = lottoNumbers[5];
    lottoNumbers.pop();
    lottoNumbers.sort(function(a, b){return a-b});
    console.log("Lotto: " + lottoNumbers + " PB:" + lottoPB);

    // Compute matches
    var numberMatches = 0;
    for (i = 0; i < userNumbers.length; i++) {
        if (lottoNumbers.includes(userNumbers[i]) === true) {
            numberMatches += 1;
        };
    };
    console.log("matches: " + numberMatches);

    // Compute reward
    if (userPB === lottoPB) {
        if (numberMatches === 0) {
            $("#reward").append("You Lose, Better Luck Next Time");
        }
        else if (numberMatches === 1) {
            $("#reward").append("You Win $1");
        }
        else if (numberMatches === 2) {
            $("#reward").append("You Win $2");
        }
        else if (numberMatches === 3) {
            $("#reward").append("You Win $25");
        }
        else if (numberMatches === 4) {
            $("#reward").append("You Win $250");
        }
        else if (numberMatches === 5) {
            $("#reward").append("JACKPOT!!!!! $4,000,000");
        }
    }
    else {
        if (numberMatches === 0) {
            $("#reward").append("You Lose, Better Luck Next Time");
        }
        else if (numberMatches === 1) {
            $("#reward").append("You Lose, Better Luck Next Time");
        }
        else if (numberMatches === 2) {
            $("#reward").append("You Lose, Better Luck Next Time");
        }
        if (numberMatches === 3) {
            $("#reward").append("You Win $2");
        }
        else if (numberMatches === 4) {
            $("#reward").append("You Win $25");
        }
        else if (numberMatches === 5) {
            $("#reward").append("You Win $2000");
        }
    }

    // Add to Jackpot if not won
    if (userPB === lottoPB) {
        if (numberMatches === 5) {
            jackpot = 4000000;
        }
    }
    else {
        jackpot += parseInt(jackpot * 0.001)
        console.log(jackpot);
    }
    $("#cash").empty();
    $("#cash").append("$" + numberWithCommas(jackpot));

    for (i = 0; i < 4; i++) {
        lottoElement.append(lottoNumbers[i] + "&nbsp;&nbsp;&nbsp;");
    }    
    lottoElement.append(lottoNumbers[4]);
    pbElement.append("&nbsp;&nbsp;&nbsp;" + lottoPB);
});