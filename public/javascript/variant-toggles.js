let toggleVariantValueInput = (varId, optId) => {
    let labelInput = document.getElementById(`input-${varId}-${optId}`);
    let labelValue = document.getElementById(`option-${varId}-${optId}`);
    let edit = document.getElementById(`edit-${varId}-${optId}`);
    let submitCancelButtons = document.getElementById(`variant-buttons-${varId}-${optId}`);
    let defaultValue = document.getElementById(`default-${varId}-${optId}`);
    let defaultInput = document.getElementById(`new-default-${varId}-${optId}`);

    if (labelInput.style.display === 'none') {
        defaultInput.style.display = 'flex';
        defaultValue.style.display = 'none';
        labelInput.style.display = 'flex';
        labelValue.style.display = 'none';
        edit.style.display = 'none';
        submitCancelButtons.style.display = 'flex';
    } else {
        defaultInput.style.display = 'none';
        defaultValue.style.display = 'block';
        labelInput.style.display = 'none';
        labelValue.style.display = 'block';
        edit.style.display = 'inline-block';
        submitCancelButtons.style.display = 'none';
    }
};

