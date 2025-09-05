// Данные приложения
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "Вязаная шапка ручной работы",
        description: "Теплая и стильная шапка, связанная вручную из натуральной шерсти.",
        price: "2500 руб.",
        category: "Одежда",
        image: "https://via.placeholder.com/300x200?text=Вязаная+шапка",
        link: "https://example.com/product1"
    },
    {
        id: 2,
        name: "Керамическая кружка",
        description: "Уникальная керамическая кружка с ручной росписью.",
        price: "1500 руб.",
        category: "Декор",
        image: "https://via.placeholder.com/300x200?text=Керамическая+кружка",
        link: "https://example.com/product2"
    },
    {
        id: 3,
        name: "Серебряное кольцо с камнем",
        description: "Изящное серебряное кольцо с натуральным камнем.",
        price: "4200 руб.",
        category: "Украшения",
        image: "https://via.placeholder.com/300x200?text=Серебряное+кольцо",
        link: "https://example.com/product3"
    },
    {
        id: 4,
        name: "Набор натурального мыла",
        description: "Набор из 5 кусочков мыла ручной работы с разными ароматами.",
        price: "1800 руб.",
        category: "Косметика",
        image: "https://via.placeholder.com/300x200?text=Набор+мыла",
        link: "https://example.com/product4"
    }
];

let clicks = JSON.parse(localStorage.getItem('clicks')) || [];
let clickCount = 0;
const ADMIN_CREDENTIALS = {
    login: "123",
    password: "123"
};

// Функции для работы с товарами
function renderProducts(productsArray) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    productsArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <span class="product-category">${product.category}</span>
                <a href="${product.link}" class="product-link" target="_blank" data-id="${product.id}">Перейти к товару</a>
            </div>
        `;
        container.appendChild(productCard);
    });
    
    // Добавляем обработчики для отслеживания кликов
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            registerClick(productId);
        });
    });
}

function renderAdminProducts() {
    const container = document.getElementById('adminProductsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'admin-product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Цена:</strong> ${product.price}</p>
            <p><strong>Категория:</strong> ${product.category}</p>
            <div class="admin-product-actions">
                <button class="edit-btn" data-id="${product.id}">Редактировать</button>
                <button class="delete-btn" data-id="${product.id}">Удалить</button>
            </div>
        `;
        container.appendChild(productCard);
    });
    
    // Добавляем обработчики для кнопок редактирования и удаления
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    if (!category) {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.category === category
    );
    renderProducts(filteredProducts);
}

// Функции для работы с кликами
function registerClick(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const clickData = {
        productId: productId,
        productName: product.name,
        category: product.category,
        timestamp: new Date().toLocaleString('ru-RU')
    };
    
    clicks.push(clickData);
    localStorage.setItem('clicks', JSON.stringify(clicks));
    
    // Если мы в админ-панели, обновляем статистику
    if (document.getElementById('statsSection')) {
        updateStats();
    }
}

function updateStats() {
    const totalClicks = document.getElementById('totalClicks');
    const popularCategory = document.getElementById('popularCategory');
    const popularProduct = document.getElementById('popularProduct');
    const clicksTable = document.getElementById('clicksTable');
    
    if (totalClicks) totalClicks.textContent = clicks.length;
    
    // Находим самую популярную категорию
    if (clicks.length > 0) {
        const categoryCount = {};
        const productCount = {};
        
        clicks.forEach(click => {
            categoryCount[click.category] = (categoryCount[click.category] || 0) + 1;
            productCount[click.productName] = (productCount[click.productName] || 0) + 1;
        });
        
        let mostPopularCategory = '';
        let maxCategoryCount = 0;
        
        for (const category in categoryCount) {
            if (categoryCount[category] > maxCategoryCount) {
                maxCategoryCount = categoryCount[category];
                mostPopularCategory = category;
            }
        }
        
        if (popularCategory) popularCategory.textContent = mostPopularCategory;
        
        // Находим самый популярный товар
        let mostPopularProduct = '';
        let maxProductCount = 0;
        
        for (const product in productCount) {
            if (productCount[product] > maxProductCount) {
                maxProductCount = productCount[product];
                mostPopularProduct = product;
            }
        }
        
        if (popularProduct) popularProduct.textContent = mostPopularProduct;
        
        // Обновляем таблицу кликов
        if (clicksTable) {
            const tbody = clicksTable.querySelector('tbody');
            tbody.innerHTML = '';
            
            // Показываем последние 20 кликов
            const recentClicks = clicks.slice(-20).reverse();
            
            recentClicks.forEach(click => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${click.productName}</td>
                    <td>${click.category}</td>
                    <td>${click.timestamp}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } else {
        if (popularCategory) popularCategory.textContent = '-';
        if (popularProduct) popularProduct.textContent = '-';
        if (clicksTable) clicksTable.querySelector('tbody').innerHTML = '';
    }
}

// Функции для админ-панели
function setupSecretLogin() {
    const logo = document.getElementById('secretLogin');
    if (!logo) return;
    
    logo.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount >= 5) {
            openLoginModal();
            clickCount = 0;
        }
    });
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function checkAdminLogin() {
    const login = document.getElementById('adminLogin').value;
    const password = document.getElementById('adminPassword').value;
    
    if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Неверный логин или пароль');
    }
}

function isLoggedIn() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

function logout() {
    localStorage.removeItem('adminAuthenticated');
    window.location.href = 'index.html';
}

function showSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Показываем нужную секцию
    const section = document.getElementById(sectionId + 'Section');
    if (section) section.style.display = 'block';
}

// Функции для управления товарами в админ-панели
let editingProductId = null;

function showProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    
    if (product) {
        title.textContent = 'Редактировать товар';
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productLink').value = product.link;
        editingProductId = product.id;
    } else {
        title.textContent = 'Добавить товар';
        document.getElementById('productName').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productCategory').value = '';
        document.getElementById('productImage').value = '';
        document.getElementById('productLink').value = '';
        editingProductId = null;
    }
    
    modal.style.display = 'flex';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

function saveProduct() {
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value;
    const link = document.getElementById('productLink').value;
    
    if (!name || !description || !price || !category || !image || !link) {
        alert('Заполните все поля');
        return;
    }
    
    if (editingProductId) {
        // Редактируем существующий товар
        const index = products.findIndex(p => p.id == editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                description,
                price,
                category,
                image,
                link
            };
        }
    } else {
        // Добавляем новый товар
        const newProduct = {
            id: Date.now(),
            name,
            description,
            price,
            category,
            image,
            link
        };
        products.push(newProduct);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminProducts();
    closeProductModal();
}

function editProduct(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        showProductModal(product);
    }
}

function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        products = products.filter(p => p.id != productId);
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminProducts();
    }
}

// Инициализация данных при первой загрузке
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

if (!localStorage.getItem('clicks')) {
    localStorage.setItem('clicks', JSON.stringify(clicks));
}