document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
    
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const addItemButton = document.getElementById("add-item-btn");  
    let cart = [];
    let itemToRemove = null; // Store the ID of the item to remove
    
    // Fetch Cart Data from API
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            cart = data.items;
            displayCartItems(cart);
            updateCartTotals();
        })
        .catch(error => {
            console.error("Error fetching cart data:", error);
            alert("Failed to load cart data. Please try again later.");
        });

    // Display Cart Items
    function displayCartItems(items) {
        cartItemsContainer.innerHTML = "";
        items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}" width="100">
                <div>
                    <h4>${item.title}</h4>
                    <p>Price: ₹${formatCurrency(item.price)}</p>
                    <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                    <p>Subtotal: ₹<span class="item-subtotal">${formatCurrency(item.price * item.quantity)}</span></p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
        
        // Add event listeners for quantity changes and item removal
        document.querySelectorAll(".item-quantity").forEach(input => {
            input.addEventListener("change", updateItemQuantity);
        });
        
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", showConfirmationModal);
        });
    }

    // Update Cart Totals
    function updateCartTotals() {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        subtotalElement.textContent = formatCurrency(subtotal);
        totalElement.textContent = formatCurrency(subtotal); // Assuming no extra fees for simplicity
    }

    // Update Quantity
    function updateItemQuantity(event) {
        const itemId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);

        const item = cart.find(item => item.id == itemId);
        if (item) {
            item.quantity = newQuantity;
            displayCartItems(cart);
            updateCartTotals();
        }
    }

    // Show Confirmation Modal for Item Removal
    function showConfirmationModal(event) {
        itemToRemove = event.target.dataset.id; // Store the item ID to be removed
        document.getElementById("confirmation-modal").style.display = "block";
    }

    // Remove Item
    function removeItem() {
        cart = cart.filter(item => item.id != itemToRemove);
        itemToRemove = null; // Reset the ID after removal
        displayCartItems(cart);
        updateCartTotals();
        closeModal();
    }

    // Close Confirmation Modal
    function closeModal() {
        document.getElementById("confirmation-modal").style.display = "none";
    }

    // Add New Item (Triggered by Button Click)
    addItemButton.addEventListener("click", () => {
        // Define a new item with images for bed, table, and light
        const items = [
            {
                id: Date.now(),  // Use timestamp as a unique ID
                quantity: 1,
                title: "Bed",
                price: 1000000, // Price in cents (so ₹50,000)
                image: "https://i.pinimg.com/736x/25/27/77/2527772e42b68b2424216e5ca29bbe6e.jpg",  // Bed image URL
            },
            {
                id: Date.now() + 1,
                quantity: 1,
                title: "Table",
                price: 100000, // Price in cents (so ₹25,000)
                image: "https://www.ulcdn.net/images/products/312898/slide/1332x726/Arabia_Dining_Table_TK_4.jpg?1609230340",  // Table image URL
            },
            {
                id: Date.now() + 2,
                quantity: 1,
                title: "Single bed",
                price: 150000, // Price in cents (so ₹1,500)
                image:"https://ii1.pepperfry.com/media/catalog/product/e/v/1100x1210/eva-solid-wood-single-bed-with-trundle-in-provincial-teak-finish-by-woodsworth-eva-solid-wood-single-lqnuzm.jpg",  // Light image URL
            },
        ];

        // Randomly choose one item to add
        const newItem = items[Math.floor(Math.random() * items.length)];

        // Add the new item to the cart array
        cart.push(newItem);

        // Update the cart display
        displayCartItems(cart);
        updateCartTotals();
    });

    // Format Currency
    function formatCurrency(amount) {
        return (amount / 100).toFixed(2);
    }

    // Event listeners for confirmation modal buttons
    document.getElementById("confirm-remove-btn").addEventListener("click", removeItem);
    document.getElementById("cancel-remove-btn").addEventListener("click", closeModal);
});

