let newProductColor = () => {
    let productInfoContainer = document.getElementsByClassName('product-info-container')[0];
    let sku = document.getElementById('sku-input').value;

    if (sku.includes('TMPLT')) {
        productInfoContainer.classList.toggle('template');
    }
};

window.onload = newProductColor();
