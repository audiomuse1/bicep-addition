let setVariant = (id) => {
    let priceValue = document.getElementById(`variant-price-${id}`).innerText;
    let newPrice = document.getElementById(`variant-price-input-${id}`).value;
    let skuValue = document.getElementById(`variant-sku-${id}`).innerText;
    let newSku = document.getElementById(`new-sku-${id}`).value;
    let newDisabledValue = document.getElementById(`variant-disabled-input-${id}`).value;

    if (newPrice !== '') {
        putBody.price = parseFloat(newPrice);
    }

    if (newSku !== skuValue) {
        putBody.sku = newSku;
    }

    if (newDisabledValue === 'true') {
        putBody.purchasing_disabled = true;
    } else if (newDisabledValue === 'false') {
        putBody.purchasing_disabled = false;
    }
};

let pushVariant = async (varId) => {
    let url = `${window.location.pathname}variants/${varId}`;

    await variantApiCall(url, 'PUT', putBody)
        .then(response => {
            if (response.ok) {
                return window.location.reload(true);
            }
        })

    // return window.location.reload();
};

let setVariantImage = () => {
    let variantImageInput = document.getElementById('variant-image-file-input');
    let variantCheckboxInputs = document.getElementsByClassName('variant-checkbox');
    let selectedVariantsInput = document.getElementById('selected-variants');
    let selectedVariants = [];

    Array.prototype.forEach.call(variantCheckboxInputs, input => {
        if (input.checked === true) {
            selectedVariants.push(input.value);
        }
    });

    selectedVariantsInput.value = selectedVariants;
};

