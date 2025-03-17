document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let cartItems = [];
    let currentQuantity = 1;
    let selectedColor = 'black';
    let selectedWarranty = '1'; // 1 = no warranty, 2 = 2-year warranty
    
    // DOM Elements
    const addToCartBtn = document.getElementById('addToCart');
    const quantityInput = document.querySelector('.quantity-input');
    const quantityPlusBtn = document.querySelector('.plus-btn');
    const quantityMinusBtn = document.querySelector('.minus-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const warrantyOptions = document.querySelectorAll('input[name="warranty"]');
    const cartCount = document.getElementById('cartCount');
    const cartBtn = document.getElementById('cartBtn');
    const cartSummary = document.querySelector('.cart-summary');
    const closeCartSummary = document.getElementById('closeCartSummary');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Initialize cart from localStorage if available
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        updateCartCount();
        updateCartDisplay();
    }
    
    // Quantity Selector Functionality
    quantityPlusBtn.addEventListener('click', function() {
        currentQuantity++;
        quantityInput.value = currentQuantity;
    });
    
    quantityMinusBtn.addEventListener('click', function() {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityInput.value = currentQuantity;
        }
    });
    
    quantityInput.addEventListener('change', function(e) {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            currentQuantity = newQuantity;
        } else {
            e.target.value = currentQuantity;
        }
    });
    
    // Color Selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.getAttribute('data-color');
        });
    });
    
    // Warranty Selection
    warrantyOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedWarranty = this.value;
        });
    });
    
    // Add to Cart Functionality
    addToCartBtn.addEventListener('click', function() {
        const product = {
            id: 1,
            title: 'Premium Wireless Bluetooth Headphones with Noise Cancellation',
            price: 149.99,
            image: 'https://m.media-amazon.com/images/I/51aw022aEaL._SL1500_.jpg',
            quantity: currentQuantity,
            color: selectedColor,
            warranty: selectedWarranty === '2' ? '2-year extended warranty' : 'No additional warranty'
        };
        
        // Check if product already exists in cart
        const existingItemIndex = cartItems.findIndex(item => 
            item.id === product.id && 
            item.color === product.color && 
            item.warranty === product.warranty
        );
        
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += product.quantity;
        } else {
            cartItems.push(product);
        }
        
        // Save to localStorage and update UI
        saveCartToLocalStorage();
        updateCartCount();
        updateCartDisplay();
        
        // Reset quantity
        currentQuantity = 1;
        quantityInput.value = currentQuantity;
        
        // Show success message
        showNotification('Product added to cart successfully!');
        
        // Automatically open cart summary
        toggleCartSummary();
    });
    
    // Cart Button Click
    cartBtn.addEventListener('click', function() {
        toggleCartSummary();
    });
    
    // Close Cart Summary
    closeCartSummary.addEventListener('click', function() {
        toggleCartSummary();
    });
    
    // Function to update cart count in navbar
    function updateCartCount() {
        let totalItems = 0;
        cartItems.forEach(item => {
            totalItems += item.quantity;
        });
        cartCount.textContent = totalItems;
    }
    
    // Function to save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        notification.style.zIndex = '1060';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(notification);
            alert.close();
        }, 3000);
    }
    
    // Function to toggle cart summary visibility
    function toggleCartSummary() {
        cartSummary.classList.toggle('active');
    }
    
    // Update cart display
    function updateCartDisplay() {
        let total = 0; // Initialize total to 0
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotalElement.textContent = `$${total.toFixed(2)}`; // Set total to $0.00 when cart is empty
        } else {
            cartItems.forEach(item => {
                total += item.price * item.quantity;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" class="cart-item-image" alt="${item.title}">
                    <div class="cart-item-details">
                        <h5 class="cart-item-title">${item.title}</h5>
                        <p class="cart-item-quantity">Color: ${item.color}</p>
                        <p class="cart-item-quantity">Warranty: ${item.warranty}</p>
                        <div class="cart-actions">
                            <div class="quantity-control">
                                <button class="quantity-decrease">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}">
                                <button class="quantity-increase">+</button>
                            </div>
                            <button class="remove-item" data-index="${cartItems.indexOf(item)}">Remove</button>
                        </div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const index = parseInt(itemElement.querySelector('.remove-item').getAttribute('data-index'));
                cartItems[index].quantity++;
                updateCartDisplay();
                updateCartCount();
                saveCartToLocalStorage();
            });
        });
        
        document.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const index = parseInt(itemElement.querySelector('.remove-item').getAttribute('data-index'));
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                    updateCartDisplay();
                    updateCartCount();
                    saveCartToLocalStorage();
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cartItems.splice(index, 1);
                updateCartDisplay();
                updateCartCount();
                saveCartToLocalStorage();
                
                if (cartItems.length === 0) {
                    toggleCartSummary();
                }
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function(e) {
                const itemElement = this.closest('.cart-item');
                const index = parseInt(itemElement.querySelector('.remove-item').getAttribute('data-index'));
                const newQuantity = parseInt(e.target.value);
                
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    cartItems[index].quantity = newQuantity;
                    updateCartDisplay();
                    updateCartCount();
                    saveCartToLocalStorage();
                } else {
                    e.target.value = cartItems[index].quantity;
                }
            });
        });
    }
    // Checkout Button
    checkoutBtn.addEventListener('click', function() {
        if (cartItems.length > 0) {
            alert('Proceeding to checkout with your selected items!');
            // In a real application, you would redirect to the checkout page
            // window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty!');
        }
    });
    
    // Initial cart display
    updateCartDisplay();
    
    // Thumbnail click functionality
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const mainImage = document.querySelector('.main-image img');
            mainImage.src = this.src;
        });
    });
    
    // Add to wishlist functionality
    document.querySelector('.btn-outline-secondary').addEventListener('click', function() {
        showNotification('Product added to wishlist!');
    });
});