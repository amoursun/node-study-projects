const faker = require('faker');

module.exports = function getUserInfo(id) {
    // 生成随机的姓名
    const name = faker.name.findName();
    // 生成随机的地址信息
    const address = faker.address.streetAddress();
    // 生成随机的电子邮件
    const email = faker.internet.email();
    const personId = `${id}_${Date.now() + Math.floor(Math.random() * 1000)}`;

    return {name, address, email, personId};
};