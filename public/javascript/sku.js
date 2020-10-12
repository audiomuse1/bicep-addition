let skuSearch = async () => {
    let sku = document.getElementById('sku-search-input').value;
    let searchDialog = document.getElementById('search-dialog');
    let resultDialog = document.getElementById('result-dialog-message');
    let redirectUrl;
    let url = `/sku/${sku}`;

    if (searchDialog.style.display === 'none') {
        resultDialog.style.display = 'none';
        searchDialog.style.display = 'flex';
    } else {
        searchDialog.style.display = 'none';
    }

    let skuRedirect = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            console.log(response);
            redirectUrl = response.url;
            return Promise.resolve();
        } else {
            console.log(response.status);
            redirectUrl = window.location.assign('/sku');
            return Promise.reject();
        }
    }).catch(error => {
        console.log(error);
    });

    return window.location.assign(redirectUrl);
};

let keySubmit = () => {
    if (window.event.keyCode === 13) {
        skuSearch();
    }
};
