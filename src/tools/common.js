export default {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.call(this, ...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(()=>{
                later.call(this)
            }, wait);
        };
    }
}