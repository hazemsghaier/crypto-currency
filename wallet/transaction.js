const wallet = require("./index");
const chainUtil = require("../chain_util");
const { MINING_REWARD }=require("../config")

class Transaction {
    constructor(){
        this.id = chainUtil.id();
        this.input = null;
        this.output= [];

    }
    update(senderWallet,recipient,amount){
        const senderOutput=this.output.find((output)=>{return output.adress === senderWallet.publicKey});
        if(senderOutput.amount<amount){
            console.log("votre nouvelle transactionestinvalide a cause du manque du solde");
            return;
        }
        senderOutput.amount=senderOutput.amount-amount;
        this.output.push({amount,adress:recipient});
        Transaction.signTransaction(this,senderWallet)
    }
    /*construire une instance du transaction sous les condition suivant:
        +le amount du sender est plus grand que l amount a envoyer
        +signer la transaction
        +verifier que le adress de recepteur existe
    */
   static transactionWithOutput(senderWallet,outputs,amount){
    const transaction =new this();
    transaction.output.push(...outputs);
    
    Transaction.signTransaction(transaction,senderWallet);
    

    return transaction;
   }
    static newTransaction(senderWallet,recipient,amount){
        if(amount > senderWallet.balance){
            console.log("you don t have enougth money in your wallet to send it");
            return;
        }
        
    return Transaction.transactionWithOutput(senderWallet,[{amount:senderWallet.balance-amount,
        adress:senderWallet.publicKey },
    {amount,adress:recipient}],amount)
     
    }
    //la blockchainWallet est la responsable du la signature ,
    static rewardTransaction(minerWallet,blockchainWallet){
        minerWallet.balance=minerWallet.balance+MINING_REWARD;
        return Transaction.transactionWithOutput(blockchainWallet,[{
            adress:minerWallet.publicKey,
            amount : MINING_REWARD
        }])

    }
    static signTransaction(transaction,senderWallet){
        transaction.input ={
            timeStamp : Date.now(),
            amount : senderWallet.balance,
            adress: senderWallet.publicKey,
            signature : senderWallet.sign(chainUtil.hash(transaction.output))
        };
    }
    // on va verifier que la signature est valide 
    static verifyTransaction(transaction){
        return chainUtil.verifieSignature(transaction.input.adress
            ,transaction.input.signature
            ,chainUtil.hash(transaction.output))

    };
}
        

module.exports=Transaction;