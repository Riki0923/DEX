# DEX Solidity Project

There are 2 parts of this project:

-A wallet part where you can add or withdraw any ETH or Chainlink Token ( if the metamask account is having LINK and ETH of course ).
-A Dex part where you can place Limit orders or Market orders to fill the Limit orders

## When this contract is deployed, it will mint 10000 LINK, for ETH you will need to get a test private key (for example from Truffle test blockchain).

- Right now you can Sell and Buy onl Chainlink as the function is written like that, probably I will change it to accept any kind of token in the future

## Functions in Solidity Part:

# addToken
-You can add any token with this function to the tokenList array in order to deposit amounts later

# deposit
- You can deposit any amount of token with this function which has already been added to the tokenList

# withdraw
- Same thing just vice versa, you can withdraw any amount of tokens with any kind which is already in the wallet

# getOrderBook
- If there were any limit orders placed here, this function will show you for which token it been placed for, 
  whether it is a sell or buy, the amount and the price.
- It also shows how many of the token deposited in each order has been already filled.

#depositETH
- An easy function to deposit any ETH to the wallet

# withdrawETH
- Same thing but withdraw

# createLimitOrder
- With this function you can create a buy or sell limit order, with the added amount and price

# createMarketOrder
-With this function you can create a sell or buy Market order. If there is already a limit order in the opposite side, the trade will take place accordingly

# getTokenListLength
- Simple function, shows you the tokenList Array.

## JavasCript Functions

# deposiEth
- Connects with metamask and gets the inputted amount of eth to the contract

# withdrawEth
- Same thing but vice versa

#getOrderBookSellSide
- This shows you if there is any Order placed in the Sell Side

#getOrderBookBuySide
- Same thing but in the Buy Side

# placeLimitOrder
- This places the Limit order on the frontend and puts it into the orderbook array.

# placeMarketOrder
- It places a market order and executes the trade if there is already a Limit order placed in the opposite side

# prtEthBalance
- This shows you the walletBalance of the contract if there is any

# prtTokens
- This shows you the Token the contract has ( when deployed, it will show you the Chainlink amount what is minted)

# addToken
- You can add any other Tokens from Metamask ( only works with Chainlink right now)

#withDrawToken
- Same thing but opposite

If you have any questions, write here: bartariki@gmail.com
