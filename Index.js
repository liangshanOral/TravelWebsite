// 定义一个包含产品信息的数组
const countries = [
    { name: "France", price: 10 },
    { name: "Philippines", price: 15 },
    { name: "Thailand", price: 15 },
    { name: "Portugal", price: 15 },
    { name: "Indonesia", price: 15 },
    { name: "Croatia", price: 15 },
    { name: "Scandinavia", price: 15 },
    { name: "Seoul", price: 15 },
    { name: "Poland", price: 15 },
    { name: "Vietnam", price: 15 },
    { name: "Italy", price: 15 }
  ];

// Toggle the visibility of the shopping cart
function toggleCart() {
    // Functionality to show/hide shopping cart will be implemented here
    window.location.href = 'cart.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const featuredRoutes = document.querySelector('.featured-routes');

    // 遍历国家数组并创建 HTML 元素
    countries.forEach((country) => {
    const routeCard = document.createElement('div');
    routeCard.classList.add('route-card'); // 添加类名

    // 使用国家信息来设置 HTML 内容
    routeCard.innerHTML = `
        <img src="photos/${country.name}.jpg" alt="Route ${country.name}">
        <h4>${country.name}</h4>
        <button onclick="addToCart('${country.name}')">Add to Cart</button>
    `;
    featuredRoutes.appendChild(routeCard); // 将元素添加到容器中
    });

});

// Add to cart functionality
function addToCart(countryname) {
    const product = countries.find(country => country.name === countryname);
    sendToServer(product);
    // Implement add to cart functionality
    //alert('Add to cart not yet implemented.');
}

function sendToServer(product) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "add-to-cart", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) { // 当请求完成时
            if (this.status == 200) {
                // 请求成功时的处理
                console.log('Product added to cart successfully');
            } else {
                // 请求失败时的处理
                console.error('Error adding product to cart');
            }
        }
    };
    xhr.send(JSON.stringify(product));
}
