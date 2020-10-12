let toggleVisible = async (id, bool) => {
    let url = `${window.location.pathname}/edit/${id}`;

    putBody.id = id;

    if (bool) {
        putBody.is_visible = true;
    } else {
        putBody.is_visible = false;
    }

    await apiCall(url, 'PUT', putBody);

    return window.location.reload();
};

let toggleFeatured = async (id, bool) => {
    let url = `${window.location.pathname}/edit/${id}`;

    putBody.id = id;

    if (bool) {
        putBody.is_featured = true;
    } else {
        putBody.is_featured = false;
    }

    await apiCall(url, 'PUT', putBody);

    return window.location.reload();
};

let togglePreorder = async (id) => {
    let inputs = document.getElementById(`submit-${id}`);
    let values = document.getElementById(`enable-${id}`);
    let preorderDate = document.getElementById(`preorder-input-${id}`);

    let now = new Date(Date.now());
    let todayISO = now.toISOString();
    let todaySplit = todayISO.split('.');
    todaySplit[1] = '+00:00';
    let todayString = todaySplit.join('');

    if (inputs.style.display === 'none') {
        preorderDate.value = todayString;
        inputs.style.display = 'flex';
        values.style.display = 'none';
    } else {
        inputs.style.display = 'none';
        values.style.display = 'flex';
    }
};

let setPreorder = (id) => {
    let releaseDateInput = document.getElementById(`preorder-input-${id}`).value;

    let now = new Date(Date.now());
    let todayISO = now.toISOString();
    let todayDate = todayISO.split('.');
    todayDate[1] = '+00:00';
    let final = todayDate.join('');

    if (releaseDateInput !== final) {
        putBody.id = id;
        putBody.availability = 'preorder';
        putBody.is_preorder_only = true;
        putBody.preorder_release_date = releaseDateInput;
    }
};

let pushPreorder = async (id) => {
    let url = `${window.location.pathname}/edit/${id}`;

    await apiCall(url, 'PUT', putBody);

    return window.location.reload();
};

let removePreorder = async (id) => {
    let url = `${window.location.pathname}/edit/${id}`;

    putBody.id = id;
    putBody.availability = 'available';
    putBody.preorder_release_date = null;
    putBody.is_preorder_only = false;

    await apiCall(url, 'PUT', putBody);

    return window.location.reload();
};
