const fse = require('fs-extra');
const path = require('path');
const createPromise = require('./promise');

const dir = path.resolve(__dirname, './user.json');

const readJson = () => {
    const {promise, resolve, reject} = createPromise();
    fse.readJson(dir, (err, user) => {
        if (err) {
            console.log('readJson error:', err);
            resolve({code: 203, err});
        }
        else {
            resolve({code: 200, data: user});
        }
    });
    return promise;
};

const writeJson = (user) => {
    const {promise, resolve} = createPromise();
    fse.writeJson(dir, user, err => {
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

class UserCache {
    // 添加
    addUser = async (info) => {
        const res = await this.checkUser(info.userId);
        const {code, data} = res;
        if (code === 200) {
            // 已存在
            return {code: 203, err: '用户已存在'};
        }
        data.data.push(info);
        return await writeJson(data);
    };
    // 删除
    removeUser = async (userId) => {
        const res = await this.checkUser(userId);
        const {data, code, index} = res;
        if (code === 200) {
            data.data.splice(index, 1);
            return await writeJson(data);
        }
        return res;
    };
    // 修改
    modifyUser = async (userId, info) => {
        const res = await this.checkUser(userId);
        if (res.code === 200) {
            const {data, index} = res;
            data.data[index] = {...data.data[index], ...info};
            return await writeJson(data);
        }
       return res;
    }

    // 检查用户是否存在
    checkUser = async (userId) => {
        const res = await readJson();
        if (res.code === 200) {
            const index = res.data.data.findIndex(item => item.userId === userId);
            if (index < 0) {
                return {...res, code: 203,  err: '用户不存在, 请注册'};
            }
            return {...res, index};
        }
        return res;
    }

    // 检查用户有效性
    checkUserEffect = async (user) => {
        const res = await this.checkUser(user.username);
        const {code, data, index} = res;
        if (code === 200) {
            if (data.data[index].password !== user.password) {
                return {code: 203, err: '密码错误'};
            }
            return res;
        }
        return res;
    }

    async loginUser(user) {
        const res = await this.checkUserEffect(user);
        const {code, data, index} = res;
        if (code === 200) {
            data.user = data.data[index];
            return await writeJson(data);
        }
        return res;
    }
    async getUser() {
        const res = await readJson();
        if (res.code === 200) {
            return {code: 200, data: res.data.user};
        }
        return res;
    }
}

module.exports = UserCache;