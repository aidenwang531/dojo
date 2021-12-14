let witnessLengthHexString = '7b' 

const lengthBuffer = new ArrayBuffer(8);
const view = new DataView(lengthBuffer);
view.setBigUint64(0, BigInt('0x'+witnessLengthHexString), true)
console.log(view.getBigUint64(0).toString(16))

var view2 = new DataView(new ArrayBuffer(8))
view2.setUint32(0, 0x4050607, true)
view2.setUint32(4, 0x10203, true)

console.log(view2.getBigUint64(0).toString(16))
console.log(view2.getUint32(0).toString(16))
console.log(view2.getUint32(4).toString(16))


if(witnessLengthHexString.length <= 8) {
    const view3 = new DataView(new ArrayBuffer(8))
    view3.setUint32(0, Number('0x'+ witnessLengthHexString), true)
    view3.setUint32(4, Number('0x'+ '00000000'), true)
    console.log(view3.getBigUint64(0).toString(16))    
}
witnessLengthHexString = '01020304050607' 
if(witnessLengthHexString.length <= 16 && witnessLengthHexString.length > 8) {
    const view3 = new DataView(new ArrayBuffer(8))
    view3.setUint32(0, Number('0x'+ witnessLengthHexString.slice(-8)), true)
    view3.setUint32(4, Number('0x'+ witnessLengthHexString.slice(0, -8)), true)
    console.log(view3.getBigUint64(0).toString(16))
    console.log(view3.getUint32(0).toString(16))
    console.log(view3.getUint32(4).toString(16))
}