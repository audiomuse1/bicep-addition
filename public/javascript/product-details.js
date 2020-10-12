let setDetails = () => {
    let name = document.getElementById('product-info-name').innerText;
    let nameInput = document.getElementById('name-input').value;
    let sku = document.getElementById('product-info-sku').innerText;
    let skuInput = document.getElementById('sku-input').value;
    let priceInput = document.getElementById('price-input').value;
    let releaseDate = document.getElementById('release-date').innerText;
    let releaseDateInput = document.getElementById('release-date-input').value;

    putBody = {};

    if (nameInput !== name) {
        putBody.name = nameInput;
    }

    if (skuInput !== sku) {
        putBody.sku = skuInput;
    }

    if (priceInput !== '') {
        putBody.price =  parseFloat(priceInput);
    }

    if (releaseDateInput !== releaseDate) {
        putBody.preorder_release_date = releaseDateInput;
    }
};

let pushDetails = async (id) => {
    let url = `${window.location.pathname}`;

    putBody.id = id;

    await detailsApiCall(url, 'PUT', putBody)
        .then(response => {
            if (response) {
                return window.location.reload(true);
            }
        })
};

let setDescription = () => {
    let newDescription = document.getElementById('description-input').value;

    putBody.description = newDescription;
};

