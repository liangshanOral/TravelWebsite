const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express(); // 创建Express应用

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // 使用express.json()中间件解析JSON请求体
app.use(express.static(__dirname)); // 设置当前文件夹为静态文件目录

let cart = {};  // 用于存储购物车中的产品

app.get('/', (req, res) => {
  // 处理根路径，返回前端页面
  const filePath = path.join(__dirname, 'MainWeb.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).type('text/html').send(data);
    }
  });
});

app.get('/cart', (req, res) => {
  res.status(200).json(cart); // 返回购物车数据
});

app.post('/add-to-cart', (req, res) => {
  console.log("Received add-to-cart request");

  const product = req.body; // 获取POST请求的数据
  const country = product.name; // 假设产品对象有一个'name'属性代表国家

  if (cart[country]) {
    // 如果购物车中已经有这个国家的产品，增加数量
    cart[country].quantity += 1;
  } else {
    // 否则，添加产品到购物车，并设置数量为1
    cart[country] = {...product, quantity: 1};
  }

  //console.log(cart); // 打印当前购物车状态
  res.status(200).json({ message: 'Product added to cart successfully' });
});


app.post('/cart/increase', (req, res) => {
  const country = req.body.country;

  if (!cart[country]) {
      // 如果购物车中没有这个国家的商品，初始化该商品
      cart[country] = { quantity: 0, /* 其他属性 */ };
  }

  cart[country].quantity += 1; // 增加数量
  res.json({ success: true, newQuantity: cart[country].quantity });
});


app.post('/cart/decrease', (req, res) => {
  const country = req.body.country;

  if (cart[country] && cart[country].quantity > 0) {
      cart[country].quantity -= 1; // 减少数量
      if (cart[country].quantity === 0) {
          // 在减少到0时添加调试日志
          //console.log(`Product ${country} quantity reduced to 0`);
      }
      res.json({ success: true, newQuantity: cart[country].quantity }); // 发送JSON响应
  } else {
      res.json({ success: false, message: 'Product not found in cart or quantity is already 0' });
  }
});


app.post('/cart/remove', (req, res) => {
  const country = req.body.country;

  if (cart[country]) {
      delete cart[country]; // 完全移除商品
      res.json({ success: true, message: 'Product removed from cart' });
  } else {
      res.json({ success: false, message: 'Product not found in cart' });
  }
});

app.use((req, res) => {
  // 处理未知路径的请求，返回404错误
  res.status(404).type('text/plain').send('Not Found');
});  

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
