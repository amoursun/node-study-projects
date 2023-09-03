/*
 Navicat MySQL Data Transfer

 Source Server         : sdss
 Source Server Type    : MySQL
 Source Server Version : 80029
 Source Host           : localhost:3306
 Source Schema         : yiwushop

 Target Server Type    : MySQL
 Target Server Version : 80029
 File Encoding         : 65001

 Date: 03/07/2023 18:27:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `isDefault` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (0, 'zt', '张恬', '17347580544', '江西省 南昌市 青山湖区', 1);
INSERT INTO `address` VALUES (1, 'zrc', '张睿驰', '13563269239', '江西省 南昌市 西湖区', 0);

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` int(0) NOT NULL COMMENT 'goods的id',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(50, 2) NOT NULL,
  `max` int(0) NOT NULL,
  `min` int(0) NOT NULL,
  `shop` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `guarantee` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `num` int(0) NOT NULL DEFAULT 0 COMMENT '购物车商品数量',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (0, 'zt', '圣诞库存陶瓷杯现货低价处理可以情人节母亲父亲节圣诞节微信报价', 2.00, 30, 1, '卫平陶瓷商行', '浙江省台州市黄岩区东城', '·7天内发货 ·不支持7天无理由退货 ·极速退款', 'https://tse2-mm.cn.bing.net/th/id/OIP-C.jNqtgCNmho_RLneiTmGJXgHaHa?w=214&h=214&c=7&r=0&o=5&dpr=1.5&pid=1.7', 10);
INSERT INTO `cart` VALUES (41, 'zt', '夏季新款纯棉短袖白色女T恤 宽松印花个性打底衫卡通韩版短袖半袖', 23.00, 400, 1, '小叶子百货', '浙江省台州市黄岩区东城', '·7天内发货 ·不支持7天无理由退货 ·极速退款', 'https://tse1-mm.cn.bing.net/th/id/OIP-C.hpAjpRpK4rOoUVMtA_4zywHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7', 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'zt', '123');
INSERT INTO `users` VALUES (2, 'zrc', '123');
INSERT INTO `users` VALUES (3, 'hh', '123');
INSERT INTO `users` VALUES (4, 'wn', '123');

SET FOREIGN_KEY_CHECKS = 1;
