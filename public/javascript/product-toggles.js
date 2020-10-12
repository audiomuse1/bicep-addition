let toggleCategoryBlock = () => {
    let categoryToggleButton = document.getElementById('category-toggle');
    let categorySelectBlock = document.getElementById('set-category');
    let categoryCreateBlock = document.getElementById('create-category');

    if (categoryCreateBlock.style.display === 'none') {
        categoryToggleButton.innerText = 'Assign Category';
        categoryCreateBlock.style.display = 'flex';
        categorySelectBlock.style.display = 'none';
    } else {
        categoryToggleButton.innerText = 'Add Category';
        categoryCreateBlock.style.display = 'none';
        categorySelectBlock.style.display = 'flex';
    }
};

let toggleImageInput = () => {
    let imageDisplay = document.getElementById('add-image-button');
    let imageInput = document.getElementById('image-input');

    if (imageInput.style.display === 'none') {
        imageInput.style.display = 'flex';
        imageDisplay.style.display = 'none';
    } else {
        imageInput.style.display = 'none';
        imageDisplay.style.display = 'flex';
    }
};

let toggleVariantInput = (id) => {
    let valueWrapper = document.getElementById(`variant-detail-wrapper-${id}`);
    let inputWrapper = document.getElementById(`variant-input-wrapper-${id}`);
    let addImageButton = document.getElementById('add-variant-image-button');
    let submitCancelButtons = document.getElementById(`button-wrapper-row-${id}`);
    let edit = document.getElementById(`edit-sku-${id}`);

    if (inputWrapper.style.display === 'none') {

        if (addImageButton.innerText === 'Cancel') {
            toggleVariantImageInput();
        }

        inputWrapper.style.display = 'flex';
        valueWrapper.style.display = 'none';
        edit.style.display = 'none';
        submitCancelButtons.style.display = 'inline-block';

    } else {
        inputWrapper.style.display = 'none';
        valueWrapper.style.display = 'flex';
        edit.style.display = 'inline-block';
        submitCancelButtons.style.display = 'none';
    }
};

let toggleProductInput = async () => {
    let name = document.getElementById('product-info-name');
    let nameInput = document.getElementById('name-input');
    let sku = document.getElementById('product-info-sku');
    let skuInput = document.getElementById('sku-input');
    let price = document.getElementById('product-info-price');
    let priceInput = document.getElementById('price-input');
    let releaseDate = document.getElementById('release-date');
    let releaseDateInput = document.getElementById('release-date-input');
    let edit = document.getElementById('edit-product-details');
    let submitCancelButtons = document.getElementById('product-details-button-row');
    let detailsMessage = document.getElementById('details-message');

    let inputs = [nameInput, skuInput, priceInput, releaseDateInput];
    let values = [name, sku, price, releaseDate];
    let buttons = [edit, submitCancelButtons];

    if (releaseDate.innerText === '') {
        inputs.forEach(input => {
            if (input !== releaseDateInput) {
                if (input.style.display === 'none') {
                    input.style.display = 'inline-block';
                } else {
                    input.style.display = 'none';
                    detailsMessage.style.display = 'none';
                }
            }
        });

        values.forEach(value => {
            if (value !== releaseDate) {
                if (value.style.display === 'none') {
                    value.style.display = 'inline-block';
                } else {
                    value.style.display = 'none';
                }
            }
        });

        buttons.forEach(button => {
            if (button.style.display === 'none') {
                button.style.display = 'flex';
                button.style.justifyContent = 'center';
            } else {
                button.style.display = 'none';
            }
        });
    } else {
        inputs.forEach(input => {
            if (input.style.display === 'none') {
                input.style.display = 'inline-block';
            } else {
                input.style.display = 'none';
                detailsMessage.style.display = 'none';
            }
        });

        values.forEach(value => {
            if (value.style.display === 'none') {
                value.style.display = 'inline-block';
            } else {
                value.style.display = 'none';
            }
        });

        buttons.forEach(button => {
            if (button.style.display === 'none') {
                button.style.display = 'flex';
                button.style.justifyContent = 'center';
            } else {
                button.style.display = 'none';
            }
        });
    }
};

let toggleVariantImageInput = () => {
    let toggleVariantImageButton = document.getElementById('add-variant-image-button');
    let variantImageInput = document.getElementById('variant-image-input');
    let variantPrices = document.getElementsByClassName('variant-price');
    let variantCheckboxInputs = document.getElementsByClassName('variant-checkbox');
    let variantDetailWrappers = document.getElementsByClassName('variant-detail-wrapper');

    Array.prototype.forEach.call(variantDetailWrappers, wrapper => {
        let wrapperIdArray = wrapper.id.split('-');

        if (wrapperIdArray[1] === 'input' && wrapper.style.display === 'flex') {
            toggleVariantInput(wrapperIdArray[3]);
        }
    });

    if (variantImageInput.style.display === 'none') {
        toggleVariantImageButton.innerText = 'Cancel';
        variantImageInput.style.display = 'flex';

        Array.prototype.forEach.call(variantCheckboxInputs, input => {
            input.style.display = 'inline-block';
        });
        Array.prototype.forEach.call(variantPrices, price => {
            price.style.display = 'none';
        });
    } else {
        toggleVariantImageButton.innerText = 'Add Variant Image';
        variantImageInput.style.display = 'none';

        Array.prototype.forEach.call(variantCheckboxInputs, input => {
            input.style.display = 'none';
        });
        Array.prototype.forEach.call(variantPrices, price => {
            price.style.display = 'inline-block';
        });
    }
};

let toggleNewModifier = (id) => {
    let newModifier = document.getElementById(`add-modifier-item-${id}`);
    let addButton = document.getElementById(`add-${id}`);
    let modifierMessage = document.getElementById('modifier-message');

    if (newModifier.style.display === 'none') {
        newModifier.style.display = 'flex';
        addButton.innerText = 'Cancel';
    } else {
        newModifier.style.display = 'none';
        modifierMessage.style.display = 'none';
        addButton.innerText = 'Add Modifier';
    }
};

let toggleModifierInput = (varId, optId) => {
    let inputs = document.getElementById(`input-${varId}-${optId}`);
    let values = document.getElementById(`option-${varId}-${optId}`);
    let edit = document.getElementById(`edit-${varId}-${optId}`);
    let submitCancelButtons = document.getElementById(`modifier-buttons-${varId}-${optId}`);

    if (inputs.style.display === 'none') {
        inputs.style.display = 'flex';
        values.style.display = 'none';
        edit.style.display = 'none';
        submitCancelButtons.style.display = 'flex';
    } else {
        inputs.style.display = 'none';
        values.style.display = 'flex';
        edit.style.display = 'inline-block';
        submitCancelButtons.style.display = 'none';
    }
};

