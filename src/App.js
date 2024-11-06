import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
    const [tooted, setTooted] = useState([]);
    const [kasutajad, setKasutajad] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const nameRef = useRef();
    const priceRef = useRef();
    const isActiveRef = useRef();

    // Fetch all users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users from the API
    function fetchUsers() {
        fetch("https://localhost:7227/Kasutajad")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Network response was not ok: ${res.statusText}`);
                }
                return res.json();
            })
            .then(json => setKasutajad(json))
            .catch(error => console.error('Error fetching users:', error));
    }

    function fetchProductsForUser(userId) {
        fetch(`https://localhost:7227/KasutajaToode/get-products/${userId}`)
            .then(res => res.json())
            .then(json => setTooted(json))
            .catch(error => console.error('Error fetching products:', error));
    }

    function handleUserChange(event) {
        const userId = event.target.value;
        setSelectedUser(userId);
        fetchProductsForUser(userId); // Fetch products for the selected user
    }

    function addProductToUser() {
        if (!selectedUser) {
            alert("Please select a user to associate the product with.");
            return;
        }

        const name = nameRef.current.value;
        const price = Number(priceRef.current.value);
        const isActive = isActiveRef.current.checked;

        fetch(`https://localhost:7227/KasutajaToode/add-product?userId=${selectedUser}&name=${name}&price=${price}&isActive=${isActive}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(json => {
                setTooted([...tooted, json]); // Add new product to the list
                fetchProductsForUser(selectedUser); // Refresh products for the selected user
            })
            .catch(error => console.error('Error adding product:', error));
    }

    function deleteProduct(productId) {
        fetch(`https://localhost:7227/KasutajaToode/delete-product/${productId}`, {
            method: 'DELETE'
        })
            .then(() => {
                setTooted(tooted.filter(toode => toode.id !== productId)); // Remove deleted product from the list
            })
            .catch(error => console.error('Error deleting product:', error));
    }

    return (
        <div className="App">
            <h1>Kasutaja Toode Management</h1>

            <label>Select User</label>
            <select onChange={handleUserChange} value={selectedUser || ''}>
                <option value="" disabled>Select a user</option>
                {kasutajad.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.kasutajanimi}
                    </option>
                ))}
            </select>

            <h2>Add Product</h2>
            <label>Product Name</label> <br />
            <input ref={nameRef} type="text" /> <br />
            <label>Price</label> <br />
            <input ref={priceRef} type="number" /> <br />
            <label>Active</label> <br />
            <input ref={isActiveRef} type="checkbox" /> <br />
            <button onClick={addProductToUser}>Add Product to User</button>

            <h2>Products for Selected User</h2>
            {tooted.length > 0 ? (
                tooted.map(toode => (
                    <div key={toode.id}>
                        <div><strong>ID:</strong> {toode.id}</div>
                        <div><strong>Name:</strong> {toode.name}</div>
                        <div><strong>Price:</strong> {toode.price}</div>
                        <div><strong>Active:</strong> {toode.isActive ? 'Yes' : 'No'}</div>
                        <button onClick={() => deleteProduct(toode.id)}>Delete</button>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No products available for this user.</p>
            )}
        </div>
    );
}

export default App;
