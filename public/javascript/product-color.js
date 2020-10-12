let productColor = () => {
    let availability = document.getElementById('product-availability').innerText;
    let productInfoContainer = document.getElementsByClassName('product-info-container')[0];
    let sku = document.getElementById('product-info-sku').innerText;
    let categoryHeading = document.getElementById('category-section-heading');
    let categorySection = document.getElementById('set-category');

    if (availability.includes('preorder')) {
        productInfoContainer.classList.toggle('preorder');
    }
    if (sku.includes('TMPLT')) {
        productInfoContainer.classList.toggle('template');
        categoryHeading.style.display = 'none';
        categorySection.style.display = 'none';
    }
    if (sku.includes('SAMPLE')) {
        productInfoContainer.classList.toggle('sample');
        categoryHeading.style.display = 'none';
        categorySection.style.display = 'none';
    }
};

window.onload = productColor();
