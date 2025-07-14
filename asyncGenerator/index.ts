export interface RangeResult {
    objects: number[];
    lastCursor: number;
}

// 模拟分页接口，传入上次游标，返回当前页数据和最新游标
const getRange = (lastCursor?: number): Promise<RangeResult> => {
    // ... 省略具体实现，模拟异步分页请求 ...
}

// 工厂函数，维护分页游标，调用一次请求下一页数据
const getRangeWithCursor = () => {
    let lastCursor: undefined|number = undefined;
    const getResult = async () => {
        const result = await getRange(lastCursor);
        lastCursor = result.lastCursor;
        return result.objects;
    }
    return getResult;
}

/**
 * 这个异步生成器实现了一个“分页异步数据流”的接口。
 * 
 * 解决了传统分页接口使用上的复杂性和性能瓶颈：
 * 1. 传统分页接口需要调用方维护分页游标、循环请求分页数据，逻辑繁琐且容易出错。
 * 2. 传统分页调用一次获取一页数据，导致处理数据时网络阻塞，体验不流畅。
 * 
 * 通过异步生成器，调用方可以用 `for await...of` 逐条获取数据，
 * 把分页请求封装成逐条“流式”数据，简化调用逻辑。
 * 
 * 同时实现了“预加载下一页数据”的优化，保证数据流畅连续，减少等待时间。
 * 
 * 支持调用方随时中断遍历，避免无谓的网络请求和性能浪费。
 */
async function* collect() {
    let result = await getRangeWithCursor()();  // 先拉第一页
    let buffer = getRangeWithCursor()();       // 预拉第二页

    let index:number = 0;
    while(true) {
        yield result[index];                    // 逐条产出当前页数据
        index++;
        if(index === result.length) {          // 当前页遍历完毕，切换下一页
            index = 0;
            result = await buffer;              // 等待预拉数据
            if(result.length === 0) break;     // 数据取完，结束迭代
            buffer = getRangeWithCursor()();   // 继续预拉下一页
        }
    }
}

/**
 * 演示调用示例：调用方通过异步迭代器逐条处理数据，
 * 不用关心分页细节，随时可用 break 中断遍历。
 */
async function fetch() {
    for await (const item of collect()) {
        console.log(item);
        if(item === 103) break;  // 条件满足时提前停止
    }
}

fetch();
