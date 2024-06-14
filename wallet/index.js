const { INITIAL_BALENCE} = require("../config")
const chain_util=require("../chain_util");
const Transaction = require("./transaction");
//comme des simple utilisateur on va interacte avec le wallet class
//chaque utilisateur va avoir un wallet
class wallet {
    constructor(){
        this.balance=INITIAL_BALENCE;
        this.pairKey=chain_util.genartePaireOfKey();
        this.publicKey=this.pairKey.getPublic().encode("hex");
    }
    toString(){
        return `wallet : 
        balance     : ${this.balance},
        publickey   : ${this.publicKey},
        pairkEY     :${this.pairKey}
        `;
    }
    //cette methode va generé new transaction en se basent sur le amount et recipient,aussi elle va verifier si cette transaction exist elle va l update
    createTransaction(recipient,amount,Transaction_poll){
        if(amount>this.balance){
            console.log("vous n avez pas solde suffisant");
            return;
        }
        let transaction=Transaction_poll.exist(this.publicKey);
        if(transaction){
             transaction.update(this,recipient,amount);
        }else{
            transaction=Transaction.newTransaction(this,recipient,amount);
            

        }
        Transaction_poll.updateOrAddTransaction(transaction);

        return transaction;
    }
    sign(dataHash){
        return this.pairKey.sign(dataHash);
    }
    static blockchainWallet(){
        const blockchainWallet= new this();
        blockchainWallet.adress= "blockchainWallet";
        return blockchainWallet;
    }

    //on va trouver le balance dans wallet d apres l historique du blockchain
    //on va calculer du la derniere transaction sortie du cette wallet  
    claculateBalance(blockchain){
        
        let balance=this.balance;
        let transactions =[];
        blockchain.chain.forEach((element) =>  {element.data.forEach(t => {transactions.push(t)})});
    const WalletInputs=transactions.filter((tr)=>{
        tr.input.adress===this.publicKey
    });
    let recentInput,startTime=0;

    if(WalletInputs.length>0){
        
        recentInput=WalletInputs.reduce((prev,now)=>{
            if(prev.input.timeStamp < now.input.timeStamp){
                return now;
            }else{
                return prev;
            }
        })
        balance=recentInput.output.find((o)=>{
            return o.adress === this.publicKey;
        }).amount;
        
        startTime=recentInput.input.timeStamp;

    }
    transactions.forEach( (t)=>{
        if(t.input.timeStamp > startTime){
            t.output.find((o)=>{
                if( o.adress === this.publicKey){
                    balance=balance.amount+o.amount;
                }
            })
        }
    })
    return balance;
    }
}
module.exports=wallet;
