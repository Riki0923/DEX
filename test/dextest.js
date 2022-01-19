const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract.skip("Dex", accounts => {
it("should throw an error if ETH balance is too low when creating BUY limit order ", async () => {
    let dex = await Dex.deployed()
    let link = await Link.deployed()
    await truffleAssert.reverts(
        dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 1)
    )

})
it("should throw an error if token balance is too low when creating sell limit order", async () => {
    let dex = await Dex.deployed()
    let link = await Link.deployed()
    await truffleAssert.reverts(
        dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 1)
    )

    await link.approve(dex.address, 500)
    await dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]});
    await dex.deposit(10, web3.utils.fromUtf8("LINK"));


    await truffleAssert.reverts(
        dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 12, 1)
    )
})

it("the BUY order book should be ordered on price from highest to lowest starting at index 0", async () => {
    let dex = await Dex.deployed()
    let link = await Link.deployed()
    await link.approve(dex.address, 500);

    await dex.depositETH({value : 3000});
    await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 300)
    await dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 1, 100)

    let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0);
    assert(orderbook.length > 0);

    for(let i = 0; i < orderbook.length - 1; i++){
        assert(orderbook[i].price >= orderbook[i+1].price, "not right order in buy book")
    }
       
})
it("the SELL order book should be ordered on price from loewst to highest starting at index 0", async () => {
    let dex = await Dex.deployed()
    let link = await Link.deployed()

    await link.approve(dex.address, 1000)
    await dex.depositETH({ value: 5000})
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 150)
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 200)
    await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 1, 100)

    let _orderBook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 0)
    assert(_orderBook.length > 0)
    for(let i = 0; i < _orderBook.length- 1; i++){
        assert(_orderBook[i].price >= _orderBook[i+1].price), "not right order in buy book"}


 })
})
contract("Dex", accounts => {
    it("this test should throw an error as there is not enough Link deposited for Sell Market order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts(
            dex.createMarketOrder(1, web3.utils.fromUtf8("LINK"), 10)
        )
    })
    it("this test should throw an error as there is not enough Eth deposited for Buy Market order", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]});
        await link.approve(dex.address, 100);
        await dex.deposit(100, web3.utils.fromUtf8("LINK"));


        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 100, 1);

        await truffleAssert.reverts(
            dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10)
        )
    })
    it("this test should pass as orders can be submitted even if the order book is empty", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await dex.depositETH({value: 100})
        await truffleAssert.passes(
            dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10) 
        )
    })
    //Market orders should be filled until the order book is empty or the market order is 100% filled
    it("this test should pass as market order is 100% filled", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]});

        await link.transfer(accounts[1], 100);

        await link.approve(dex.address, 100, {from: accounts[1]});


        await dex.deposit(100, web3.utils.fromUtf8("LINK"), {from: accounts[1]});

        await dex.depositETH({value: 100})

        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 50, 1, {from: accounts[1]})
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10) 
        
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);

       assert(orderbook[0].filled == 10);

    })
    /*it("this test should pass as the orderbook as the market order is fully filled and 1 limit order remained in Sell Side of the orderbook", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
        assert(orderbook.length == 0, "Sell side ordebook should be empty at start of test");

        await dex.addToken(web3.utils.fromUtf8("LINK"), link.address);


        await link.transfer(accounts[1], 100);
        await link.transfer(accounts[2], 100);

        await link.approve(dex.address, 100, {from: accounts[1]});
        await link.approve(dex.address, 100, {from: accounts[2]});

        await dex.deposit(100, web3.utils.fromUtf8("LINK"), {from: accounts[1]});
        await dex.deposit(100, web3.utils.fromUtf8("LINK"), {from: accounts[2]});

        await dex.depositETH({value: 100})

        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 1, {from: accounts[1]})
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 1, {from: accounts[2]})

        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10) 
        
        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
        assert(orderbook[0].filled == 0, "after the trade, there should be 5 amount left for the second limit order");
        assert(orderbook.length == 1, "Sell side Orderbook should only have 1 order left");

    })*/
    it("This test should pass as the ETH balance of the buyer is decreasing with the filled amount", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        /*await dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]});

        await link.transfer(accounts[1], 100);

        await link.approve(dex.address, 100, {from: accounts[1]});
        await dex.deposit(80, web3.utils.fromUtf8("LINK"), {from: accounts[1]});

      
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 80, 1)*/

        await dex.depositETH({value: 100})
        let balanceBeforeTrade = await dex.balances(accounts[1], web3.utils.fromUtf8("ETH"))
        assert(balanceBeforeTrade == 100, "This should be 100 this time");

        /*await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 70)
        let balanceAfterTrade = await dex.balances(dex.address, web3.utils.fromUtf8("ETH"))
        assert(balanceAfterTrade == 30);*/
    })
    /*it("This test should pass as the token balance of the limit order seller is decreasing with the filled amount", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 100)
        await link.deposit(80, web3.utils.fromUtf8("LINK"))
        await depositETH({value: 100})
        await createLimitOrder(1, web3.utils.fromUtf8("LINK"), 80, 1)
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 50, 0) 
        
        let filled = dex.createMarketOrder.filled;
        filled = dex.createMarketOrder.amount;

        let balance = balances[dex.address][web3.utils.fromUtf8("LINK")];
        assert(balance - filled); // should be 30 at the end

    })
    it("This test should pass as a filled limit order is removed from the orderbook", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 100)
        await link.deposit(80, web3.utils.fromUtf8("LINK"))
        await depositETH({value: 100})
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 30, 3, 0)
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 20, 2, 0)
        await dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 1, 0)
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10, 0) 
        //[30, 20, 10]
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("Link"), 1);
        assert(orderbook.length > 0)
        let lastElement = orderbook.length -1;
        for(let i = 0; i < orderbook.length; i++){
            if(orderbook[i].amount == orderbook[i].filled){
                lastElement = orderbook[i];
                assert(orderbook.pop())
            }
        }

    })*/
})

