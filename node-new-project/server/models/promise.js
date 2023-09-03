function createPromise() {
    let resolve = (result) => {};
    let reject = (error) => {};

    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    return {
        promise,
        resolve,
        reject,
    };
}

module.exports = createPromise;
