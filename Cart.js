// 在页面加载时获取购物车数据
document.addEventListener('DOMContentLoaded', function() {
    fetchCartData();
});

// 获取购物车数据并渲染到页面上
function fetchCartData() {
    fetch('http://localhost:3000/cart')
        .then(response => response.json())
        .then(data => {
            renderCart(data);
        })
        .catch(error => console.error('Error fetching cart data:', error));
}

function renderCart(cart) {
    const cartContainer = document.querySelector('.cart_product');
    // 保存 cart-total-container 的引用
    const totalContainer = cartContainer.querySelector('.cart-total-container');
    // 清空除了结算部分以外的所有内容
    cartContainer.innerHTML = '';
    // 为购物车中的每个产品创建HTML元素
    let index = 0; // 用于计算行数
    for (const country in cart) {
        const product = cart[country];
        const productElement = document.createElement('div');
        productElement.className = 'cart_product';
        productElement.innerHTML = `
        <div class="product-details" data-country="${country}">
            <div>
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
            </div>
            <div>
                <p>Quantity: <span class="quantity">${product.quantity}</span></p>
                <button onclick="increaseQuantity('${country}')">+</button>
                <button onclick="decreaseQuantity('${country}')">-</button>
                <button onclick="removeProduct('${country}')">Remove</button>
            </div>
        </div>
        `;
        // 使用 jQuery 添加隔行变色
        if (index % 2 === 0) {
            $(productElement).addClass('even-row');
        } else {
            $(productElement).addClass('odd-row');
        }
        cartContainer.appendChild(productElement);
        index++;
    }

    // 将 cart-total-container 添加回容器的末尾
    if (totalContainer) {
        cartContainer.appendChild(totalContainer);
    }
}

function increaseQuantity(country) {
    fetch('http://localhost:3000/cart/increase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' //请求头说明请求格式为json
        },
        body: JSON.stringify({ country: country })
    })
    .then(response => response.json()) //响应格式为json
    .then(data => {
        if (data.success) { //if状态为成功
            // 找到带有特定data-country属性的元素
            const quantityElement = document.querySelector(`.product-details[data-country="${country}"] .quantity`);
            quantityElement.textContent = data.newQuantity;
        } else {
            console.error('Error increasing quantity');
        }
    })
    .catch(error => console.error('Error:', error));
}

function decreaseQuantity(country) {
    const quantityElement = document.querySelector(`.product-details[data-country="${country}"] .quantity`);
    const currentQuantity = parseInt(quantityElement.textContent, 10);

    if (currentQuantity === 1) {
        // 数量已经为1，不执行减少操作，禁用减少按钮
        const decreaseButton = document.querySelector(`button[data-country="${country}"][data-action="decrease"]`);
        decreaseButton.disabled = true;
    } else {
        // 数量大于1，执行减少操作
        fetch('http://localhost:3000/cart/decrease', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country: country })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 更新页面上的数量显示
                const newQuantity = parseInt(data.newQuantity, 10);
                quantityElement.textContent = newQuantity;
            } else {
                console.error('Error decreasing quantity');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function removeProduct(country) {
    fetch('http://localhost:3000/cart/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country: country })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 移除页面上的产品显示
            const productElement = document.querySelector(`.product-details[data-country="${country}"]`);
            console.log(productElement.classList)
            if (productElement) {
                const cartProductElement = productElement.closest('.cart_product');
                cartProductElement.remove();}
        } else {
            console.error('Error removing product');
        }
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('calculateTotal').addEventListener('click', function() {
    let total = 0;
    const cartItems = document.querySelectorAll('.cart_product .product-details');
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('p').textContent.split('$')[1]);
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        total += price * quantity;
    });
    document.getElementById('totalAmount').textContent = 'Total Amount: $' + total.toFixed(2);
});
