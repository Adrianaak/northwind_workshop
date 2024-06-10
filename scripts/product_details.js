"use strict";

window.onload = () => {
    // Function to fetch product details from the API based on product ID
    async function fetchProductDetails(productId) {
        try {
            let response = await fetch(`http://localhost:8081/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            let data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product details:', error);
            return null;
        }
    }

   // Function to display product details on the page
function displayProductDetails(product) {
    let productDetailsContainer = document.getElementById('productDetailsContainer');
    if (!product) {
        productDetailsContainer.innerHTML = '<p>Error: Product details not found</p>';
        return;
    }
    let html = `
        <div>
            <h4>${product.productName}</h4>
            <p>Category: ${product.categoryId}</p>
            <p>Price: $${product.unitPrice}</p>
            <p>Supplier: ${product.supplier}</p>
            <p>In Stock: ${product.unitsInStock}</p>
            <p>Discontinued: ${product.discontinued}</p>
        </div>
    `;
    productDetailsContainer.innerHTML = html;
}


    // Get the product ID from the query string
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let productId = urlParams.get('id');

    // Fetch product details and display them on the page
    if (productId) {
        fetchProductDetails(productId)
            .then(product => {
                console.log('Fetched product details:', product);
                displayProductDetails(product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                displayProductDetails(null);
            });
    } else {
        console.error('Product ID not found in query string');
        displayProductDetails(null);
    }
};

