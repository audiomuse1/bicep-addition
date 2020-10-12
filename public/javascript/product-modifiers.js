let setModifier = (id) => {
    let newName = document.getElementById(`new-opt-name-${id}`).value;
    let newType = document.getElementById(`new-opt-type-${id}`).value;
    let newDefault = document.getElementById(`new-opt-required-${id}`).value;

    putBody = {};

    if (newName !== '') {
        putBody.display_name = newName;
    }

    if (newType !== '') {
        putBody.type = newType;
    }

    if (newDefault === 'false') {
        putBody.required = false;
    } else if (newDefault === 'true') {
        putBody.required = true;
    }
};

let setNewModifier = (id) => {
    let newName = document.getElementById(`new-mod-name-${id}`).value;
    let newType = document.getElementById(`new-mod-type-${id}`).value;
    let newRequired = document.getElementById(`new-mod-required-${id}`).value;
    let newLabel = document.getElementById(`new-mod-label-${id}`).value;
    let newDefault = document.getElementById(`new-mod-default-${id}`).value;

    putBody = {};
    putBody.option_values = [];
    putBody.option_values[0] = {};

    if (newName !== '') {
        putBody.display_name = newName;
    }

    if (newType !== '') {
        putBody.type = newType;
    }

    if (newRequired === 'false') {
        putBody.required = false;
    } else if (newRequired === 'true') {
        putBody.required = true;
    }

    if (newLabel !== '') {
        putBody.option_values[0].label = newLabel;
    }
    if (newDefault === 'false') {
        putBody.option_values[0].is_default = false;
    } else if (newDefault === 'true') {
        putBody.option_values[0].is_default = true;
    }
};

let createModifier = async (id) => {
    let url = `${window.location.pathname}modifiers`;

    await modifierApiCall(url, 'POST', putBody)
        .then(response => {
            console.log(response);
            if (response) {
                return window.location.reload(true);
            }
        });
};

let pushModifier = async (modId) => {
    let url = `${window.location.pathname}modifiers/${modId}`;

    putBody.id = modId;

    await modifierApiCall(url, 'PUT', putBody)
        .then(response => {
            if (response) {
                return window.location.reload(true);
            }
        });
};

let deleteModifier = async (modId) => {
    let url = `${window.location.pathname}modifiers/${modId}`;

    putBody.id = modId;

    await modifierApiCall(url, 'DELETE', putBody)
    .then(response => {
        if (response) {
            return window.location.reload(true);
        }
    });
};

let setModifierOption = (id) => {
    let newLabel = document.getElementById(`new-mod-label-${id}`).value;
    let newDefault = document.getElementById(`new-mod-default-${id}`).value;

    if (newLabel !== '') {
        putBody.label = newLabel;
    }
    if (newDefault === 'false') {
        putBody.is_default = false;
    } else if (newDefault === 'true') {
        putBody.is_default = true;
    }
};

let pushModifierOption = async (id, modId, valId) => {
    let url = `${window.location.pathname}modifiers/${modId}/${valId}`;

    putBody.id = valId;

    await modifierApiCall(url, 'PUT', putBody)
        .then(response => {
            if (response) {
                return window.location.reload(true);
            }
        });
};

