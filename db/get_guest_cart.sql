SELECT cart.qty, *
FROM product
JOIN cart ON product.id = cart.product_id
WHERE cart.session_id = $1 AND cart.customer_id IS NULL;
