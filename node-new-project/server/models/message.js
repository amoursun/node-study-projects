const fse = require('fs-extra');
const path = require('path');
const User = require('./user');
const createPromise = require('./promise');

const user = new User();

const dir = path.resolve(__dirname, './message.json');

const readJson = () => {
    const {promise, resolve, reject} = createPromise();
    fse.readJson(dir, (err, res) => {
        if (err) {
            console.log('readJson error:', err);
            resolve({code: 203, err});
        }
        else {
            resolve({code: 200, data: res});
        }
    });
    return promise;
};

const writeJson = (data) => {
    const {promise, resolve} = createPromise();
    fse.writeJson(dir, data, err => {
        if (err) {
            console.log('writeJson error:', err);
            resolve({code: 203, err});
        }
        else {
            resolve({code: 200});
        }
    })
    return promise;
};

class MessageCache {
    // 添加
    saveMessage = async (info) => {
        const res = await this.checkMessage();
        const {code, data, userId} = res;
        console.log(code, data, userId)
        if (!data.data[userId]) {
            data.data[userId] = [];
        }
        data.data[userId].unshift(info);
        return await writeJson(data);
    };

    async getMessage() {
        const res = await this.checkMessage();
        const {code, data, userId} = res;
        if (code === 200) {
            const messages = data.data[userId] || [];
            return {code, data: messages};
        }
        return res;
    }
    async checkMessage() {
        const {data: {userId}} = await user.getUser();
        const res = await readJson();
        if (res.code === 200) {
            return {...res, userId};
        }
        return res;
    }
}

module.exports = MessageCache;