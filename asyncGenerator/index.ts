export interface RangeResult {
    objects: number[];
    lastCursor: number;
}
const getRange = (lastCursor?: number): Promise<RangeResult> => {
    console.log('getRange: lastCursor', lastCursor)
    const result =  Array(100).fill(0).map((item, index) => {
        lastCursor = lastCursor || 0
        return index + 1 + lastCursor
    })
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                objects: result,
                lastCursor: result[result.length-1]
            });
        },300)
    });
}

async function* collect() {
    let result = await getRange()
    let lastCursor = result.lastCursor
    let objects = result.objects
    let resultLength = objects.length;
    for(let i=0; i < resultLength; i++) {
        if(i === resultLength - 1) {
            result = await getRange(lastCursor)
            lastCursor = result.lastCursor
            objects = objects.concat(result.objects)
            resultLength = objects.length;
            console.log(objects)
        }
        yield objects[i];
    }
}


async function fetch() {
    for await (const item of collect()) {
        console.log(item)
        if(item === 10000) {
            break;
        }
    }
}

fetch()
