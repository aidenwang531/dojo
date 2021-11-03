export interface RangeResult {
    objects: number[];
    lastCursor: number;
}
const getRange = (lastCursor?: number): Promise<RangeResult> => {
    console.log('getRange: lastCursor', lastCursor)
    
    let result =  Array(10).fill(0).map((item, index) => {
        lastCursor = lastCursor || 0
        return index + 1 + lastCursor
    })
    // 模拟最多拿到50
    if(lastCursor === 50) {
        result = []
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                objects: result,
                lastCursor: result[result.length-1]
            });
        },300)
    });
}

let lastCursor: undefined|number = undefined;
const getRangeWithCursor = async () => {
    const result = await getRange(lastCursor)
    lastCursor = result.lastCursor
    return result.objects
}
async function* collect() {
    let result = await getRangeWithCursor()
    let buffer = getRangeWithCursor()
    let index:number = 0
    while(true) {
        yield result[index]
        index++
        if(index === result.length) {
            index = 0;
            result = await buffer;
            if(result.length === 0) {
                break;
            }
            buffer = getRangeWithCursor()
        }
    }
}


async function fetch() {
    for await (const item of collect()) {
        console.log(item)
        if(item === 103) {
            break;
        }
    }
}

fetch()
