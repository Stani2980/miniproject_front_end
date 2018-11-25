
function handleHttpErrors(res) {
    if (!res.ok) {
        throw { message: res.statusText, status: res.status };
    }
    return res.json();
}

function makeFetchOptions(type, b) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    return {
        method: type,
        headers,
        body: JSON.stringify(b)
    }
}

export {handleHttpErrors, makeFetchOptions};