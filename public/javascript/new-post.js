let postNewProduct = async () => {
    let message = document.getElementById('new-product-message');
    let submitButton = document.getElementById('submit-product-details');

    if (message.style.display === 'none') {
        message.style.display = 'inline-block';
    } else if (message.innerText.includes('ERROR')) {
        message.innerText = 'Creating product...';
    }

    let url = `${window.location.pathname}`;
    let redirectUrl;

    let apiCall = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(putBody)
    }).then(response => {
        if (response.ok) {
            redirectUrl = response.url;
            Promise.resolve();
            return window.location.assign(redirectUrl);
        } else {
            response.json().then(body => {
                message.innerText = `ERROR: ${body}`;
            });
        }
    }).catch(error =>{
        console.log(error);
    });
};
