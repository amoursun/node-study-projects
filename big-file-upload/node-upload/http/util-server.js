const path       = require('path');
const fse        = require('fs-extra');
const multiparty = require('multiparty');
const pathUtil   = require('../util-path');

// 大文件存储目录
const {PATH_HTTP_UPLOADDIST} = pathUtil;

// 提取后缀名
const extractExt = filename => filename.slice(filename.lastIndexOf('.'), filename.length);
const resolvePost = (req) => {
    return new Promise(resolve => {
        let chunk = '';
        req.on('data', (data) => {
            chunk += data;
        }); // 当有数据时，解析数据
        req.on('end', () => {
            resolve(JSON.parse(chunk));
        }); // 当完整数据时，解析完毕
    });
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
const getUploadChunkDist = filehash => path.resolve(PATH_HTTP_UPLOADDIST, filehash);

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
const mergeFileChunk = async (filePath, filename, size) => {
    const chunkDist = getUploadChunkDist(filename);
    const chunkPaths = await fse.readdir(chunkDist);
    // 根据切片下标进行排序
    // 否则直接读取目录的获得的顺序会错乱
    console.log({filePath, filename, size, chunkPaths});
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    
    // 并发写入文件
    await Promise.all(
        chunkPaths.map((chunkPath, index) => pipeStream(
            path.resolve(chunkDist, chunkPath),
            // 根据 size 在指定位置创建可写流
            fse.createWriteStream(filePath, {
                start: index * size,
            })
        ))
    );
    // 合并后删除保存切片的目录
    // fse.rmdirSync(chunkDist);
};

module.exports = class FileUpload {
    // 验证是否已上传/已上传切片下标
    async handleVerifyUpload(req, res) {
        const data = await resolvePost(req);
        const {filename} = data;
        const filePath = path.resolve(PATH_HTTP_UPLOADDIST, filename);
        if (fse.existsSync(filePath)) {
            await fse.remove(filePath);
        }
        res.end(
            JSON.stringify({
                shouldUpload: true,
                uploadedList: await createUploadedList(filename) // filehash
            })
        );
    }

    // 处理切片
    async handleFormData(req, res) {
        const multipart = new multiparty.Form();
        multipart.parse(req, async (err, fields, files) => {
            if (err) {
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
            // 创建临时文件夹用于临时存储 chunk
            // 添加 chunkDist 前缀与文件名做区分
            const chunkDist = path.resolve(PATH_HTTP_UPLOADDIST, filename);
            if (!fse.existsSync(PATH_HTTP_UPLOADDIST)) {
                await fse.mkdirs(PATH_HTTP_UPLOADDIST);
            }
            if (!fse.existsSync(chunkDist)) {
                await fse.mkdirs(chunkDist);
            }
            await fse.move(chunk.path, `${chunkDist}/${hash}`);
            res.end({
                status: 'ok',
                data: 100,
            });
        });
    }

    // 合并切片
    async handleMerge(req, res) {
        const data = await resolvePost(req);
        const {filename, size} = data;
        // const { filehash, filename, size } = data;
        // const ext = extractExt(filename);
        // const filePath = path.resolve(PATH_HTTP_UPLOADDIST, `MERGE_${filehash}${ext}`);
        const filePath = path.resolve(PATH_HTTP_UPLOADDIST, `MERGE_${filename}`);
        await mergeFileChunk(filePath, filename, size);
        res.end({
            status: 'ok',
            message: 'file merged success'
        });
    }
    // 删除所有文件
    async deleteFiles(req, res) {
        await fse.remove(path.resolve(PATH_HTTP_UPLOADDIST));
        res.end(
            JSON.stringify({
                status: 'ok',
                message: 'file delete success'
            })
        );
    }
};
