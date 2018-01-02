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

function round2(number)
{
  number = Math.round(number * 100) / 100;
  return number;
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
            percentageChange = round2(percentageChange);
            var realCashValueChange = (startCashBTC * bitcoinCurrentPrice) -  (startCashBTC * bitcoinHistoryPrice);
            realCashValueChange = round2(realCashValueChange);
            var bitcoinHistoryPrice;
            bitcoinHistoryPrice = round2(bitcoinHistoryPrice);
            var bitcoinCurrentPrice;
            bitcoinCurrentPrice = round2(bitcoinCurrentPrice);
            


            console.log("BTC current price:       " + bitcoinCurrentPrice);
            console.log("BTC price at " + startDate + ": " + bitcoinHistoryPrice);
            console.log("BTC price change:        " + percentageChange + "%");
            console.log("investment in BTC:       "+ startCashBTC);
            console.log("investment in USD:       " + startCashBTC * bitcoinHistoryPrice);
            console.log("currently in USD:        " + startCashBTC * bitcoinCurrentPrice);
            console.log("You have gained:         " + realCashValueChange + " USD");

            //filling the website
            $("#investmentDate").html(startDate);
            $("#investedCashHistory").html(startCashBTC+ " BTC");
            $("#bitcoinHistoryPrice").html(bitcoinHistoryPrice+ " USD");
            $("#bitcoinCurrentPrice").html(bitcoinCurrentPrice + " USD");
            $("#investedCashBTC").html(startCashBTC + " BTC");
            $("#investedCashCurrent").html(startCashBTC * bitcoinCurrentPrice + " USD");
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
        closeOnSelect: false, // Close upon selecting a date,
        format: 'yyyy-mm-dd'
      });


    if( localStorage.getItem("dataIsSaved") == "saved" )
    {
        prepareHomePage();
    }else{
        alert("PODAJ DANE EJ");
    }

    $("#getHistory").submit(function(event){
        event.preventDefault();

        getBitcoinHistoryPrice($("#date").val(), null);
    });

    $( "#investmentFormSubmit" ).click(function() {

        saveNewInvestmentData($("#startDate").val(), parseFloat($("#startCashBTC").val()));
        prepareHomePage();
    });
});
