let putBody = {};

let setNewDetails = (tmpObject) => {
    // Initialize putBody with values from tempObject
    let nameInput = document.getElementById('name-input').value;
    let skuInput = document.getElementById('sku-input').value;
    let priceInput = document.getElementById('price-input').value;
    let description = document.getElementById('description-input').value;

    let variantItems = document.getElementsByClassName('variant-item');
    let variantCount = variantItems.length;

    let modifierItems = document.getElementsByClassName('modifier-item');
    let modifierCount = modifierItems.length;

    let today = new Date().toISOString();
    let todayArray = today.split('-');
    let yearDigit1 = todayArray[0].split('')[2];
    let yearDigit2 = todayArray[0].split('')[3];
    let year = `${yearDigit1}${yearDigit2}`;
    let month = todayArray[1];
    let date = todayArray[2].split('T')[0];
    let sortOrder = `-${year}${month}${date}0000`;

    putBody.categories = tmpObject.categories;
    putBody.description = description;
    putBody.is_visible = false;
    putBody.name = nameInput;
    putBody.price = parseInt(priceInput);
    putBody.sku = skuInput;
    putBody.sort_order = sortOrder;
    putBody.type = tmpObject.type;
    putBody.weight = tmpObject.weight;

    if (variantCount > 0){
        putBody.variants = [];
        putBody.variants = tmpObject.variants;

        for (let i = 0; i < variantCount; i++) {
            // Adjust variant values for easy postage
            putBody.variants[i].calculated_price = undefined;
            putBody.variants[i].product_id = undefined;
            putBody.variants[i].sku_id = undefined;
            putBody.variants[i].sku = document.getElementById(`new-sku-${i}`).value;
        }
    }

    if (modifierCount > 0) {
        putBody.modifiers = [];
        putBody.modifiers = tmpObject.modifiers;

        putBody.modifiers.forEach(modifier => {
            modifier.id = undefined;
            modifier.name = undefined;
            modifier.product_id = undefined;

            modifier.option_values.forEach(value => {
                value.id = undefined;
                value.option_id = undefined;
            });
        });
    }
};
