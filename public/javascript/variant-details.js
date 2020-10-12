let setVariantBody = (varId, optId) => {
    let newValue = document.getElementById(`input-${varId}-${optId}`).value;
    let newDefault = document.getElementById(`default-input-${varId}-${optId}`).value;

    let optionValueObject = {
        id: optId
    };

    putBody.id = varId;
    putBody.option_values = [];

    if (newValue !== '') {
        optionValueObject.label = newValue;
    }

    if (newDefault === 'true') {
        optionValueObject.is_default = true;
    } else if (newDefault === 'false') {
        optionValueObject.is_default = false;
    }

    putBody.option_values.push(optionValueObject);
};

let pushVariantEdit = async (optId, valId) => {
    let url = `${window.location.pathname}/${optId}/${valId}`;

    await apiCall(url, 'PUT', putBody);

    return window.location.reload();
};
