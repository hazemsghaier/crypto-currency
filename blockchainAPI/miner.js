const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class miner{
 constructor(blockChain,transactionPoll,wallet,p2pServer){
    this.blockChain=blockChain;
    this.transactionPoll=transactionPoll;
    this.wallet=wallet;
    this.p2pServer=p2pServer;
 }   
 mine(){
   //prendre les valid transaction du transactionPool
    const validTransaction=this.transactionPoll.validTransactions();
    //include a reward for the miner
    validTransaction.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()));

    //creat a block consist of valid transaction
    const block =this.blockChain.addBlock(validTransaction);
    //synch the chain
    this.p2pServer.syncChain();
    //clear the transaction pool
    this.transactionPoll.clear();
    //broadcast
    this.p2pServer.broadCastTransactionClear();
    return block;
 }
}
module.exports=miner;