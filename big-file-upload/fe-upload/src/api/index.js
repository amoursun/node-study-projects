// import axios from 'axios'

export function uploadRequest({
    url,
    method = 'post',
    data,
    headers = {},
    onProgress = e => e,
    requests,
}) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
        const _url = 'http://localhost:3001' + url;
        xhr.open(method, _url);
        Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
        xhr.send(data);
        xhr.onload = (e) => {
            // 将请求成功的 xhr 从列表中删除
            if (requests) {
                const xhrIndex = requests.findIndex(item => item === xhr);
                requests.splice(xhrIndex, 1);
            }
            resolve({data: e.target.response});
        };
        // 暴露当前 xhr 给外部
        requests?.push(xhr);
    });
};

