/*this file is to make our sevice of blockchain avilabel on internet*/
const express = require("express");
const bodyParcer = require("body-parser");
const blockChain = require("../blockchain/index");
const { blockHash } = require("../blockchain/block");
const p2p_server=require("./p2p-sever")
const Wallet = require("../wallet/index")
const Transaction_poll=require("../wallet/transaction_poll");
const MINER = require("./miner");
let wallet = new Wallet()
let tp =new Transaction_poll();




const HTTP_PORT = parseInt(process.argv[3]) || 3001;
const app=express();
const bc = new blockChain();
const p2pServer = new p2p_server(bc,tp);
let miner = new MINER(bc,tp,wallet,p2pServer);
app.use(bodyParcer.json());
app.get("/blocks",(req,res,next)=>{
     res.json(bc.chain);
})
app.get("/transactions",(req,res)=>{
    res.json(tp.transactions);
    

})
app.get("/balance",(req,res)=>{

  res.json(`${wallet.claculateBalance(bc)}`) 
})
app.post("/transactions",(req,res)=>{
    const {recipient,amount}=req.body;
    let transaction=wallet.createTransaction(recipient,amount,tp);
    p2pServer.broadCastTransaction(transaction);
    res.redirect("/transactions");
})
app.get("/mine_transaction",(req,res)=>{
    const block = miner.mine();
    console.log(`new block are added : ${block.toString()}`);
    res.redirect("/blocks");
})

app.post("/mine",(req,res,next)=>{
    const block = bc.addBlock(req.body.data);
    console.log(`nouvelle block est ajouter ${block}`);
    res.redirect("/blocks");
    p2pServer.syncChain();
})
app.listen(HTTP_PORT,"localhost",()=>{
    console.log(`the server work fine on port ${HTTP_PORT}`)
})
p2pServer.listen();