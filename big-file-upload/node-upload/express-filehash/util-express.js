const path       = require('path');
const fse        = require('fs-extra');
const multiparty = require('multiparty');
const pathUtil   = require('../util-path');

// 大文件存储目录
const {PATH_EXPRESS_UPLOADDIST} = pathUtil;

// 提取后缀名
const extractExt = filename => {
    const index = filename.lastIndexOf('.');
    return {
        name: filename.slice(0, index),
        ext: filename.slice(index)
    }
};
// 写入文件流
const pipeStream = (path, writeStream) => {
    return new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on('end', () => {
            fse.unlinkSync(path);
            resolve();
        });
        readStream.pipe(writeStream);
    })
};

// 创建临时文件夹用于临时存储 chunk
// 添加 chunkList 前缀与文件名做区分
const getUploadChunkDist = filehash => path.resolve(PATH_EXPRESS_UPLOADDIST, filehash);

// 返回已上传的所有切片名
// return chunk names which is uploaded
const createUploadedList = async filehash => {
    const chunkDist = getUploadChunkDist(filehash);
    if (fse.existsSync(chunkDist)) {
        return await fse.readdir(chunkDist);
    }
    return [];
}
  
// 合并切片
const mergeFileChunk = async (data) => {
    const {filename, filehash, size} = data;
    const chunkDist = getUploadChunkDist(filehash);
    const chunkPaths = await fse.readdir(chunkDist);
    // 根据切片下标进行排序
    // 否则直接读取目录的获得的顺序会错乱
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    const generateFilePath = getUploadChunkDist(filename);
    // 并发写入文件
    await Promise.all(
        chunkPaths.map((chunkPath, index) => pipeStream(
            path.resolve(chunkDist, chunkPath),
            // 根据 size 在指定位置创建可写流
            fse.createWriteStream(generateFilePath, {
                start: index * size,
            })
        ))
    );
    // 合并后删除保存切片的目录
    fse.rmdirSync(chunkDist);
};

module.exports = class FileUpload {
    // 验证是否已上传/已上传切片下标
    async handleVerifyUpload(req, res) {
        const {filename, filehash} = req.body;
        const {ext, name} = extractExt(filename);
        const filePath = path.resolve(PATH_EXPRESS_UPLOADDIST, `${filehash}${ext}`);
        console.log({filehash, filename, name, ext})
        if (fse.existsSync(filePath)) {
            res.end(
                JSON.stringify({
                    shouldUpload: false
                })
            );
        } else {
            res.end(
                JSON.stringify({
                    shouldUpload: true,
                    uploadedList: await createUploadedList(filehash)
                })
            );
        }
    }

    // 处理切片
    async handleFormData(req, res) {
        const multipart = new multiparty.Form();
        multipart.parse(req, async (err, fields, files) => {
            if (err) {
                res.end('failed file chunk');
                return;
            }
            /**
             * chunk:
             * {
             *  fieldName: 'chunk',
             *  originalFilename: 'blob',
             *  path: '/var/folders/df/vw3vx1_d5dj81fyj_ztzhx8xnvghgg/T/h10UFFLfdRJwO5qboS-h-RE5',
                headers: {
                    'content-disposition': 'form-data; name="chunk"; filename="blob"',
                    'content-type': 'application/octet-stream'
                },
                size: 1048576
            * 
            * }
            * filename: 文件名称
            * hash: 分隔文件hash名称
            */
            const [chunk] = files.chunk;
            const [hash] = fields.hash;
            const [filename] = fields.filename;
            const [filehash] = fields.filehash;
            // 创建临时文件夹用于临时存储 chunk
            // 添加 chunkDist 前缀与文件名做区分
            const filePath = path.resolve(
                PATH_EXPRESS_UPLOADDIST,
                `${filehash}${extractExt(filename).ext}`
              );
            const chunkDist = getUploadChunkDist(filehash);
            const chunkPath = path.resolve(chunkDist, hash);
            // 文件存在直接返回
            if (fse.existsSync(filePath)) {
                res.end("file exist");
                return;
            }
            // 切片存在直接返回
            if (fse.existsSync(chunkPath)) {
                res.end("chunk exist");
                return;
            }

            // 目录不存在，创建目录
            if (!fse.existsSync(PATH_EXPRESS_UPLOADDIST)) {
                await fse.mkdirs(PATH_EXPRESS_UPLOADDIST);
            }
            // 切片目录不存在，创建切片目录
            if (!fse.existsSync(chunkDist)) {
                await fse.mkdirs(chunkDist);
            }
            // console.log({chunk, hash, filename, chunkDist});
            await fse.move(chunk.path, path.resolve(chunkDist, hash));
            res.end('received file chunk');
        });
    }

    // 合并切片
    async handleMerge(req, res) {
        const {filehash, filename, size} = req.body;
        const {ext} = extractExt(filename);
        const filePath = path.resolve(PATH_EXPRESS_UPLOADDIST, `${filehash}${ext}`);
        await mergeFileChunk({filename, filePath, filehash, size});
        res.end({
            status: 'ok',
            message: 'file merged success'
        });
    }
    // 删除所有文件
    deleteFiles(req, res) {
        fse.emptyDir(PATH_EXPRESS_UPLOADDIST).then(() => {
            res.end(
                JSON.stringify({
                    status: 'ok',
                    message: 'file delete success'
                })
            );
        })
        .catch((err) => {
            res.end(
                JSON.stringify({
                    status: 'fail',
                    message: err
                })
            );
        });
    }
};
