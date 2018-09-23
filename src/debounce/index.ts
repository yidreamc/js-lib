/**
 * @param func {function} 回调函数
 * @param wait {number} 等待的时间
 * @param immediate {boolean} 是否立即执行
 * @return result {any} 原函数返回值
 */
const debounce = (func: any, wait: number, immediate: boolean = true): any => {
    let timeout: any; // 延时
    let context: any; // 上下文
    let timestamp: number; // 上次执行的时间戳
    let result: any;// 返回结果
    function later () {
        const last = Date.parse(new Date().toString()) - timestamp;
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, arguments);
                if (!timeout) {
                    context = null;
                }
            }
        }
    }
    return function () {
        // @ts-ignore
        context = this;
        timestamp = Date.parse(new Date().toString());
        const callNow = immediate && !timeout;

        // 如果定时器不存在就创建一个
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, arguments);
            context = null;
        }
        return result;
    };
};
export default debounce;
