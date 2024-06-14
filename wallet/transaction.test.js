const Transaction=require("./transaction");
const Wallet=require("./index");
/*-verifier que les donner dans la transaction est verifier
  -verifier que si on a pas suffisant d argent on ne peut pas envoyer le transaction*/ 
describe("tarnsaction",()=>{
  let transaction,wallet,amount1,recipient;
    beforeEach(()=>{
        wallet=new Wallet();
        amount1=50;
        recipient="rapapapa";
        transaction= Transaction.newTransaction(wallet,recipient,amount1);
      });
      it("verifier que lorsque on va envoyer d argent et elle va etre depencez correctement ",()=>{
        expect(transaction.output.find((output)=>{
            return output.adress === wallet.publicKey}).amount ).toEqual(wallet.balance-amount1);
      })
      it("verifier que le champ qui represent le amount a transferer est vrai",()=>{
        expect(transaction.output.find((output)=>{
            return output.adress === recipient
        }).amount).toEqual(amount1);
      })
      it("verifier le input",()=>{
        expect(transaction.input.amount).toEqual(wallet.balance)
      })
      it("validate a valid transaction",()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
      })
      let nextAmount,nextRecipient;
      nextAmount=80;
      nextRecipient="zjzvjsdvjksibdvskv";
      

      
      it("subtruct the next amount of sender output",()=>{
        transaction.update(wallet,nextRecipient,nextAmount)
        expect(transaction.output.find((output)=>{
          return wallet.publicKey === output.adress
        }).amount).toEqual(wallet.balance-amount1-nextAmount);
      })
     

    })
   