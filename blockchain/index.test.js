const blockChain = require("./index");
const block = require("./block");
describe("block chain testing",()=>{
    let bc ,bc2;
    beforeEach(()=>{
      bc = new blockChain();
      bc2 = new blockChain();
    })
    it("blockChain start with genisis Block",()=>{
       expect(bc.chain[0]).toEqual(block.genisis());

    })
    it("blockChain start with genisis Block",()=>{
        const data = "sghaier";
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
        
     })
     it("validate a valide chain",()=>{
        bc2.addBlock("sghaier");
        expect(bc.isValidChain(bc2.chain)).toBe(true);
     })
     it("it invalidate the chain because of the genisis block",()=>{
        bc2.chain[0].data="bad data";
        bc2.addBlock("sghaier");
        expect(bc.isValidChain(bc2.chain)).toBe(false);
     })
     it("invalidate the chain",()=>{
        bc2.chain[0].data="bad data";
        bc2.addBlock("mestiri");
        bc2.chain[1].data="lahzim";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
     })
     it("replace the chain by a valid chain ",()=>{
        bc2.addBlock("zef");
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
     })
     it("dont replace with smaller chain",()=>{
        bc.addBlock("zapapa");
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain)
     })
})