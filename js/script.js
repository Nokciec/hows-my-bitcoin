var BITCOIN_PRICE_HISTORY_URL = 'https://api.coindesk.com/v1/bpi/historical/close.json?';
// use it like this: BITCOIN_PRICE_HISTORY_URL + 'start=2015-01-01&end=2015-01-01'

var BITCOIN_PRICE_CURRENT_URL = 'https://api.coindesk.com/v1/bpi/currentprice.json';
/*
    Local Storage naming conventions

    dataIsSaved - true/undefined - tells me if the user has filled the cash data

    startDate - string with date - the date at which a user has invested in crypto
    startCashBTC - float - how much has the user invested (in bitcoins)
*/

function getBitcoinHistoryPrice(date, callback){

    url = BITCOIN_PRICE_HISTORY_URL + 'start=' + date + '&end=' + date;

    $.ajax( url )
      .done(function(response) {
          response = JSON.parse(response);

          for (key in response.bpi)
          {
            //console.log("price for " + date + " "+ response.bpi[key]);
            callback(response.bpi[key]);
          }
      })
      .fail(function() {
        alert( "Failed to download data.." );
      })
}

function getBitcoinCurrentPrice(callback)
{
    $.ajax( BITCOIN_PRICE_CURRENT_URL )
      .done(function(response) {
        response = JSON.parse(response);

        //console.log("price for today: " + response.bpi.USD.rate_float);
        callback( response.bpi.USD.rate_float);
      })
      .fail(function() {
        alert( "Failed to download data.." );
      })
}

function prepareHomePage()
{
    var startDate = localStorage.getItem('startDate');
    var startCashBTC = localStorage.getItem('startCashBTC');

    getBitcoinCurrentPrice(function(bitcoinCurrentPrice){
        getBitcoinHistoryPrice(startDate, function(bitcoinHistoryPrice){

            bitcoinCurrentPrice = parseFloat(bitcoinCurrentPrice);
            bitcoinHistoryPrice = parseFloat(bitcoinHistoryPrice);
            var percentageChange = (bitcoinCurrentPrice / bitcoinHistoryPrice - 1 ) * 100;
            percentageChange = Math.round(percentageChange * 100) / 100;
            var realCashValueChange = (startCashBTC * bitcoinCurrentPrice) -  (startCashBTC * bitcoinHistoryPrice);
            realCashValueChange = Math.round(realCashValueChange * 100) / 100;

            console.log("BTC current price:       " + bitcoinCurrentPrice);
            console.log("BTC price at " + startDate + ": " + bitcoinHistoryPrice);
            console.log("BTC price change:        " + percentageChange + "%");
            console.log("investment in BTC:       "+ startCashBTC);
            //Baczek, z tej linijki nizej nie korzystamy, co z nia robimy, to jest to co ja chcialam ale Ty nie xd
            console.log("investment in USD:       " + startCashBTC * bitcoinHistoryPrice);
            console.log("currently in USD:        " + startCashBTC * bitcoinCurrentPrice);
            console.log("You have gained:         " + realCashValueChange + " USD");


            //filling the website
            $("#investmentDate").html(startDate);
            $("#investedCashHistory").html(startCashBTC+ " BTC");
            $("#bitcoinHistoryPrice").html(Math.round(bitcoinHistoryPrice * 100) / 100 + " USD");
            $("#bitcoinCurrentPrice").html(Math.round(bitcoinCurrentPrice * 100) / 100 + " USD");
            $("#investedCashBTC").html(startCashBTC + " BTC");
            $("#investedCashCurrent").html(Math.round(startCashBTC * bitcoinCurrentPrice * 100) / 100 + " USD");
            $("#percentageChange").html(percentageChange + "%");
            $("#realCashValueChange").html(realCashValueChange + " USD");

        });
    });
}

function saveNewInvestmentData(date, cash)
{
    localStorage.setItem("startDate", date);
    localStorage.setItem("startCashBTC", cash);

    localStorage.setItem("dataIsSaved", "saved");
}


$(document).ready(function(){

    $('.modal').modal();

     var $input = $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: true, // Close upon selecting a date,
        format: 'yyyy-mm-dd',
      });


    if( localStorage.getItem("dataIsSaved") == "saved" )
    {
        prepareHomePage();
    }else{
        $("#investmentDataForm").removeClass("hide");
    }


    $("#getHistory").submit(function(event){
        event.preventDefault();

        getBitcoinHistoryPrice($("#date").val(), null);
    });

    $( "#investmentFormSubmit" ).click(function() {

        $("#investmentDataForm").addClass("hide");
        saveNewInvestmentData($("#startDate").val(), parseFloat($("#startCashBTC").val()));
        prepareHomePage();
                 $('.tap-target').tapTarget('open');
    });

    $("#investmentDataEditButton").click(function(){
        $("#investmentDataForm").removeClass("hide");
    });
});
