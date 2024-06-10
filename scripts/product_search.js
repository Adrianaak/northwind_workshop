window.onload = async () => {
    let productSearchDDL = document.querySelector("#searchTypeDDL");
    let categoryDropdown = document.querySelector("#categoryDropdown");
    let categoryDDL = document.querySelector("#categoryDDL");
    let searchResultsContainer = document.querySelector("#searchResultsContainer");

    let fetchProducts = async () => {
        try {
            let response = await fetch("http://localhost:8081/api/products");
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            let data = await response.json();
            // Transform the data to match the format expected by generateProductTable
            let products = data.map(product => ({
                id: product.productId,
                name: product.productName,
                category: product.categoryId,
                price: product.unitPrice
            }));
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    // Function to fetch categories from the API
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:8081/api/categories');
            const data = await response.json();
            return data.categories; // Assuming your API returns categories in a 'categories' array
        } catch (error) {
            console.error('Error fetching categories:', error);
            return []; // Return an empty array in case of error
        }
    }

    // Function to get unique categories from the fetched data
    async function getCategoriesFromAPI() {
        const categories = await fetchCategories();
        return [...new Set(categories)]; // Using Set to get unique categories
    }

    let generateProductTable = (products) => {
        return `
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(
            (product) => `
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.category}</td>
                            <td>$${product.price}</td>
                            <td><a href="product_details.html?id=${product.id}">See Details</a></td>
                        </tr>
                    `
        ).join('')}
                </tbody>
            </table>
        `;
    };


    productSearchDDL.addEventListener("change", async () => {
        let selectedOption = productSearchDDL.value;
        categoryDropdown.style.display = selectedOption === "category" ? "block" : "none";

        if (selectedOption === "viewAll") {
            let products = await fetchProducts();
            let tableHTML = generateProductTable(products);
            searchResultsContainer.innerHTML = tableHTML;
        } else if (selectedOption === "category") {
            let categories = await getCategoriesFromAPI();
            // Populate categoryDropdown with fetched categories
            categoryDDL.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
        }
    });
};
