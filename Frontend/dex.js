var web3 = new Web3(Web3.givenProvider);

var dexAddress = "0x32737333C3AA9EC83a205016FC5fC4c5FE65ACb4";

$(document).ready(function(){
 window.ethereum.enable().then(async function(accounts){
 dex = await new web3.eth.Contract(window.abi, dexAddress, {from:accounts[0]});

 prtEthBalance();
 getOrderBookSellSide();
 getOrderBookBuySide();
 prtTokens();


 });

  $("#inputETH").click(depositEth);
  $("#withdrawButton").click(withdrawEth);
  $("#getSellSide").click(reloadPage);
  $("#getBuySide").click(reloadPage);
  $("#placedLimitOrder").click(placeLimitOrder);
  $("#placedMarketOrder").click(placeMarketOrder);
  $("#addTokenButton").click(addToken);
  $("#withdrawTokenButton").click(withDrawToken);


  function reloadPage(){
    location.reload();
  }


  async function depositEth(){
  let addedEth = $("#placedETH").val();
  console.log("the Eth value you put into the input field is: " + addedEth);
  let address = ethereum.selectedAddress;
  console.log("current ETH Address is: " + address);
  let balanceBefore = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
  console.log("Balance before transaction is: " + balanceBefore);
  await dex.methods.depositETH().send({value: web3.utils.toWei(addedEth, "ether")});
  let balanceAfter = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
  console.log("Balance after transaction is: " + balanceAfter);
  reloadPage();
  //$("#theNumber").html(parseInt($("#theNumber").text()) + addedEth);
  }

  async function withdrawEth(){
    let withdrawedEth = $("#wEth").val();
    withdrawedEth = web3.utils.toWei(withdrawedEth, "ether");
    console.log("withdrawed eth val is: " + withdrawedEth);
    let address = ethereum.selectedAddress;
    //console.log(address);
    let balanceBefore = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
    console.log("Balance before transaction is: " + balanceBefore);
    await dex.methods.withdrawETH(withdrawedEth).send({from: ethereum.selectedAddress});
    let balanceAfter = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
    console.log("Balance after transaction is: " + balanceAfter);
    reloadPage();
    //$("#theNumber").html(parseInt($("#theNumber").text()) - withdrawedEth );
    }

  async function getOrderBookSellSide(){
    let orderBookSSide = await dex.methods.getOrderBook(web3.utils.fromUtf8("LINK"), 1).call();
    console.log(orderBookSSide);

    for(let i = 0; i < orderBookSSide; i ++){
      let ticker = orderBookSSide[i]["ticker"];
      let amount = orderBookSSide[i]["amount"];
      let priceBuy = web3.utils.toWei(orderBookSSide[i]["price"]);
      console.log(ticker,amount, priceBuy);
      $('<tr / > ').appendTo(".OrderbookSellOutPut");
      $('<td / > ').text("Ticker: " + web3.utils.toUtf8(ticker).toString().appendTo(".OrderbookSellOutPut"));
      $('<td / > ').text("Amount: " + amount).appendTo(".OrderbookSellOutPut");
      $('<td / > ').text("priceBuy: " + web3.utils.fromEth(priceBuy).toString().appendTo(".OrderbookSellOutPut"));
    }

    }

  async function getOrderBookBuySide(){
    let orderBookBSide = await dex.methods.getOrderBook(web3.utils.fromUtf8("LINK"), 0).call();
    console.log(orderBookBSide);

    for(let i = 0; i < orderBookBSide; i++){
      let tickerSell = orderBookBSide[i]["ticker"];
      let amountSell = orderbookBSide[i]["amount"];
      let priceSell =  web3.utils.toEth(orderbookBSide[i]["price"]);
      console.log(ticker, amount, price);
      $('<tr / >').appendTo(".OrderbookBuyOutPut");
      $('<td / >').text("Ticker: " + web3.utils.toUtf8(tickerSell).toString()).appendTo(".OrderbookBuyOutPut");
      $('<td / >').text("Amount: " + amountSell).appendTo(".OrderbookBuyOutPut");
      $('<td / >').text("Price: " + web3.utils.fromEth(priceSell).toString()).appendTo(".OrderbookBuyOutPut");
    }
  }

  async function placeLimitOrder(){
    let enum1 = $("#placedEnumLimitOrder").val();
    console.log(enum1);
    let token1 = web3.utils.fromUtf8($("#placedTokenLimitOrder").val());
    console.log(token1);
    let amount1 = $("#placedAmountLimitOrder").val();
    console.log(amount1);
    let price = $("#placedPriceLimitOrder").val();
    console.log(price);
    await dex.methods.createLimitOrder(enum1, token1, amount1, price).send();
    alert("Limit Order Succesfully created!!");
    reloadPage();
  }

  async function placeMarketOrder(){
    let enum2 = $("#placedEnumMarketOrder").val();
    console.log(enum2);
    let token2 = web3.utils.fromUtf8($("#placedTokenMarketOrder").val());
    console.log(token2)
    let amount2 = $("#placedAmountMarketOrder").val();
    console.log(amount2);
    await dex.methods.createMarketOrder(enum2, token2, amount2).send();
    alert("Market Order Succesfully created!!!");
    reloadPage();
  }

  async function prtEthBalance(){
    let ethBalance = await dex.methods.balances(ethereum.selectedAddress, web3.utils.fromUtf8("ETH")).call();
    document.getElementById("theNumber").textContent = web3.utils.fromWei(ethBalance);
    //let linkBalance = await dex.methods.balances(ethereum.selectedAddress, web3.utils.fromUtf8("LINK")).call();
    //document.getElementById("theNumber2").textContent = web3.utils.toUtf8(linkBalance);
  }

  async function prtTokens(){
    let tokenList = await dex.methods.getTokenListLength().call();
    //console.log(tokenList);
    for(let i = 0; i < tokenList; i++){
      let tokenVar = await dex.methods.tokenList(i).call();
      let tokenBalance = await dex.methods.balances(ethereum.selectedAddress, tokenVar).call();
      //console.log("Token Balance of : " + web3.utils.toUtf8(tokenVar) + " " + tokenBalance);
      $('<tr /> ').text(web3.utils.toUtf8(tokenVar) + ": " + tokenBalance).appendTo("#theNumber2");
    }
  }

  async function addToken(){
    let tokenAdd = $("#tokenInput").val();
    console.log(tokenAdd);
    await dex.methods.deposit(tokenAdd, web3.utils.fromUtf8("LINK")).send();
  }
  
  async function withDrawToken(){
    let tokenWithdraw = $("#tokenOutput").val();
    console.log(tokenWithdraw);
    await dex.methods.deposit(tokenWithdraw, web3.utils.fromUtf8("LINK")).send();
  }
})


// This is just a simple code how to increase the number by one each time you click on it
// You will need to have a button and an input in html !
/*$(document).ready(function (){
  $("#newButton").click(function(){
    $("#num").html(parseInt($("#num").text()) + 1);
  });
  */
