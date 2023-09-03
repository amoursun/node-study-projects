<template>
  <div>
    <h1>大文件上传-断点续传</h1>
    <input type='file' @change='handleFileChange' />
    <a-button type="primary" @click="handleUpload">upload</a-button>
    <a-button type="primary" danger @click="mergeRequest">merge</a-button>
    <a-button
      v-if="status === Status.pause"
      type="primary"
      @click="handleResume"
    >resume</a-button>
    <a-button
      v-else
      :disabled="status !== Status.uploading || !container.hash"
      type="primary"
      @click="handlePause"
    >pause</a-button>
    <a-button type="primary" danger @click="handleDelete">delete</a-button>

    <div>
      <div>
        <h3>calculate chunk hash</h3>
        <a-progress :percent="hashPercentage"></a-progress>
      </div>
      <div>
        <h3>总进度: </h3>
        <a-progress :percent="fakeUploadPercentage" />
      </div>
      <a-table bordered :data-source="data" :columns="columns" :scroll="{x: 1200}">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'percentage'">
            <a-progress :percent="record.percentage" />
          </template>
          <template v-else-if="column.key === 'size'">
            {{record.size | transformMByte}}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import {Button, Table, Progress} from 'ant-design-vue';
import {uploadRequest} from '@/api';
// 切片大小
const MB = 1024 * 1024;
const SIZE = 1 * MB;
const columns = [{
    title: '文件名称',
    dataIndex: 'hash',
    key: 'hash',
    width: '30%',
}, {
    title: '索引',
    dataIndex: 'index',
    key: 'index',
    width: '10%',
}, {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: '10%',
}, {
    title: '完成进度',
    dataIndex: 'percentage',
    key: 'percentage',
    width: '50%',
}];
const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading'
};
export default {
  name: 'upload',
  filters: {
    transformMByte(val) {
      return Number((val / MB).toFixed(2)) + 'MB';
    }
  },
  data: () => ({
    Status,
    columns,
    container: {
      file: null,
      hash: '',
      worker: null,
    },
    data: [],
    requestList: [],
    hashPercentage: 0,
    status: Status.wait,
    // 当暂停时会取消 xhr 导致进度条后退
    // 为了避免这种情况，需要定义一个假的进度条
    fakeUploadPercentage: 0
  }),
  methods: {
    async handleDelete() {
      const { data } = await uploadRequest({
        url: '/delete'
      });
      if (JSON.parse(data).code === 0) {
        this.$message.success('delete success');
      }
    },
    handlePause() {
      this.status = Status.pause;
      this.resetData();
    },
    resetData() {
      this.requestList.forEach(xhr => xhr?.abort());
      this.requestList = [];
      if (this.container.worker) {
        this.container.worker.onmessage = null;
      }
    },
    async handleResume() {
      this.status = Status.uploading;
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      await this.uploadChunks(uploadedList);
    },
    request({
        url,
        method = 'post',
        data,
        headers = {},
        onProgress = e => e,
        requestList,
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
              if (requestList) {
                  const xhrIndex = requestList.findIndex(item => item === xhr);
                  requestList.splice(xhrIndex, 1);
              }
              resolve({data: e.target.response});
          };
          // 暴露当前 xhr 给外部
          requestList?.push(xhr);
      });
    },
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({file: file.slice(cur, cur + size)});
        cur += size;
      }
      return fileChunkList;
    },
    // 上传切片
    async uploadChunks(uploadedList = []) {
      const requestList = this.data.filter(({ hash }) => !uploadedList.includes(hash))
      .map(({chunk, hash, index}) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', this.container.file.name);
        formData.append('filehash', this.container.hash);
        return {formData, index};
      }).map(({formData, index}) => {
        return uploadRequest({
          url: '/big-upload',
          data: formData,
          onProgress: this.createProgressHandler(this.data[index]),
          requests: this.requestList
        });
      });
      // 并发请求
      await Promise.all(requestList).then(res => {
          console.log(res);
      });
      // 合并切片
      // await this.mergeRequest();
      // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时合并切片
      if (uploadedList.length + requestList.length === this.data.length) {
        await this.mergeRequest();
      }
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
        return new Promise((resolve, reject) => {
          // 添加 worker 属性
          this.container.worker = new Worker('/hash.js');
          this.container.worker.postMessage({fileChunkList});
          this.container.worker.onmessage = e => {
              const {percentage, hash} = e.data;
              this.hashPercentage = percentage;
              // percentage 100为完成，且hash 有值
              if (hash) {
                  resolve(hash);
              }
          };
        });
    },
    // 合并切片
    async mergeRequest() {
        await uploadRequest({
            url: '/merge',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify({
                size: SIZE,
                filename: this.container.file.name,
                filehash: this.container.hash,
            })
        });
        this.$message.success('upload success');
        this.status = Status.wait;
    },
    async handleUpload() {
      if (!this.container.file) return;
      this.status = Status.uploading;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.container.hash = await this.calculateHash(fileChunkList);
      const {shouldUpload, uploadedList} = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      if (!shouldUpload) {
        this.$message.success(
          'skip upload：file upload success, check /target directory'
        );
        this.status = Status.wait;
        return;
      }
      this.data = fileChunkList.map(({file}, index) => ({
        filehash: this.container.hash,
        chunk: file,
        index,
        // 文件名 + 数组下标
        hash: this.container.file.name + '-' + index,
        size: file.size,
        percentage: uploadedList.includes(index) ? 100 : 0
      }));

      await this.uploadChunks(uploadedList);
    },
    async verifyUpload(filename, filehash) {
      const {data} = await uploadRequest({
        url: '/verify',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          filename,
          filehash
        })
      });
      return JSON.parse(data);
    },
    createProgressHandler(item) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    }
  },
  computed: {
    uploadDisabled() {
      return (
        !this.container.file ||
        [Status.pause, Status.uploading].includes(this.status)
      );
    },
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map(item => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    }
  },
  watch: {
    uploadPercentage(now) {
      if (now > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = now;
      }
    }
  },
};
</script>