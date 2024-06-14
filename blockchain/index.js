const Block = require("./block")
class blockChain{
    constructor(){
        this.chain = [Block.genisis()];

    }
    addBlock(data){
        const lastBlock =this.chain[this.chain.length-1];
        const newBlock = Block.mineBlock(lastBlock,data);
       
        this.chain.push(newBlock);
        console.log(this.isValidChain(this.chain))
        return newBlock;
    }
    isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genisis())){
            console.log("111111");
            return false;
        }
       
        for( let i=1;i<chain.length;i++){
            let block = chain[i];
            let prevBlock =chain[i-1];

           
            if(block.lastHash !== prevBlock.hash || block.hash !== Block.blockHash(block)){
            
                
                return false;
            }
        }
        return true;
    }
    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.log("the recived chain is not longuer enougth");
            return;
        }else if(!this.isValidChain(newChain)){
            console.log("the new chain recived is not valid");
            return;
        }
        console.log("repacement is succesful");
        this.chain=newChain;

    }
}
module.exports=blockChain;