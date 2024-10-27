const API_URL = 'http://localhost:3000/api/cart';

export const getCartItems = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch cart items");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addToCart = async (userId, productId, quantity) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId, quantity }),
        });
        if (!response.ok) {
            throw new Error("Failed to add item to cart");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const response = await fetch(`${API_URL}/${userId}/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error("Failed to remove item from cart");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const replaceCart = async (userId, items) => {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, items }),
        });
        if (!response.ok) {
            throw new Error("Failed to replace cart");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
