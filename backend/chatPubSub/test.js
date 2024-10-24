function x() {
    return new Promise((resolve, reject) => {
        resolve('test');
    }).then((data) => {
        return data;
    })
}
