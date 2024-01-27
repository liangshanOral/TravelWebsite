// data.js
let dynamicData = {}; // 初始为空对象

// 定义一个函数来设置动态数据
function setDynamicData(data) {
  dynamicData = data;
}

// 导出需要共享的数据和函数
export { dynamicData, setDynamicData };
