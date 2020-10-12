let putBody = {};

let apiCall =  async (url, method, body) => {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    await fetch(url, options)
    .then(response => {
        if (response.ok) {
            console.log(response);
            return Promise.resolve();
        } else {
            console.log(response.status);
            return Promise.reject();
        }
    }).catch(error => {
        console.log(error);
    });
};

let categoryApiCall = async (url, method, body) => {
    let message = document.getElementById('category-message');

    message.innerText = 'Updating product...';

    if (message.style.display === 'none') {
        message.style.display = 'inline-block';
    }

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    await fetch(url, options)
    .then(response => {
        if (response.ok) {
            console.log(response);
            Promise.resolve();
            return window.location.reload();
        } else {
            console.log(response.status);
            response.json().then(body => {
                message.innerText = `${body}`
            })
        }
    }).catch(error => {
        console.log(error);
    });
};

let detailsApiCall = async (url, method, body) => {
    let message = document.getElementById('details-message');

    message.innerText = 'Updating product...';

    if (message.style.display === 'none') {
        message.style.display = 'inline-block';
    }

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    await fetch(url, options)
    .then(response => {
        if (response.ok) {
            console.log(response);
            Promise.resolve();
            return window.location.reload();
        } else {
            console.log(response);
            response.json().then(body => {
                message.innerText = `${body}`
            })
        }
    }).catch(error => {
        console.log(error);
    });
};

let modifierApiCall = async (url, method, body) => {
    let message = document.getElementById('modifier-message');

    message.innerText = 'Updating product...';

    if (message.style.display === 'none') {
        message.style.display = 'inline-block';
    }

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    await fetch(url, options)
    .then(response => {
        if (response.ok) {
            console.log(response);
            Promise.resolve();
            return window.location.reload(true);
        } else {
            console.log(response.status);
            response.json().then(body => {
                message.innerText = `${body}`;
            });
        }
    }).catch(error => {
        console.log(error);
    });
};

let variantApiCall = async (url, method, body) => {
    let message = document.getElementById('variant-message');

    message.innerText = 'Updating product...';

    if (message.style.display === 'none') {
        message.style.display = 'inline-block';
    }

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    await fetch(url, options)
        .then(response => {
            if (response.ok) {
                console.log(response);
                Promise.resolve();
                return window.location.reload(true);
            } else {
                console.log(response.status);
                response.json().then(body => {
                    message.innerText = `${body}`;
                });
            }
        }).catch(error => {
            console.log(error);
        })
}
