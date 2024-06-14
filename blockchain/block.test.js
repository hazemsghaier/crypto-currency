const { difficulty } = require("../config");
const Block=require("./block");
describe("block",()=>{
    let data,lastBlock,block;
    beforeEach(()=>{
        data="hazem";
        lastBlock=Block.genisis();
        block=Block.mineBlock(lastBlock,data);
    })
    it("verifir que la data est vrai",()=>{
        expect(block.data).toEqual(data);
    })
    it("verifier le last hash",()=>{
        expect(block.lastHash).toEqual(lastBlock.hash);
    })
    it("verifier que la defficuler est bien",()=>{
        expect(block.hash.substring(0,difficulty)).toEqual("0".repeat(difficulty));
        console.log(block.toString());
    })
})