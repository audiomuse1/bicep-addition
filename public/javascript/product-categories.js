let limitToOne = (e) => {
    let form = document.getElementById('newCategoryForm');
    let checkboxes = form.getElementsByTagName('input');

    Array.prototype.forEach.call(checkboxes, checkbox => {
        if (checkbox != e.target) {
            checkbox.checked = false;
        }
    });
};

let setCategoryDetails = () => {
    let categoryForm = document.getElementById('setCategoryForm');
    let categoryInputs = categoryForm.getElementsByTagName('input');
    let categories = [];

    putBody = {};

    Array.prototype.forEach.call(categoryInputs, input => {
        if (input.checked) {
            categories.push(input.value);
        }
    });

    putBody.categories = categories;
};

let setNewCategory = () => {
    let newCategoryForm = new FormData(document.forms.newCategoryForm);
    let newCategoryName = document.getElementById('new-category-name').value;
    let parentCategory = newCategoryForm.get('parent-category');

    putBody = {};
    putBody.parent_id = parseInt(parentCategory) || 0;
    putBody.name = newCategoryName;
};

let pushNewCategory = async () => {
    let url = `${window.location.pathname}category`;

    await categoryApiCall(url, 'POST', putBody)
    .then(response => {
        if (response) {
            window.location.reload(true);
        }
    });
};

let pushCategoryAssignment = async (id) => {
    let url = `${window.location.pathname}`;

    putBody.id = id;

    await categoryApiCall(url, 'PUT', putBody)
        .then(response => {
            if (response) {
                return window.location.reload(true);
            }
        });
};

