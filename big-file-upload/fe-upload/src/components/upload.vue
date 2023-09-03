<template>
  <div>
    <h1>大文件上传</h1>
    <input type='file' @change='handleFileChange' />
    <a-button type="primary" @click="handleUpload">upload</a-button>
    <a-button type="primary" danger @click="mergeRequest">merge</a-button>

    <div>
      <div>
        <h3>总进度: </h3>
        <a-progress :percent="uploadPercentage" />
      </div>
      <a-table bordered :data-source="data" :columns="columns" :scroll="{x: 1200}">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'percentage'">
            <a-progress :percent="record.percentage" />
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
const SIZE = 1 * 1024 * 1024;
  
export default {
  data: () => ({
    container: {
      file: null,
    },
    data: [],
    columns: [{
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
      title: '完成进度',
      dataIndex: 'percentage',
      key: 'percentage',
      width: '60%',
    }],
  }),
  methods: {
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
    async uploadChunks() {
      const requestList = this.data.map(({chunk, hash, index}) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', this.container.file.name);
        return {formData, index};
      }).map(({formData, index}) => {
        return uploadRequest({
          url: 'http://localhost:3000/big-upload',
          data: formData,
          onProgress: this.createProgressHandler(this.data[index]),
        });
      });
      // 并发请求
      await Promise.all(requestList).then(res => {
          console.log(12212, res);
      });
      // 合并切片
      // await this.mergeRequest();
    },
    // 合并切片
    async mergeRequest() {
        await uploadRequest({
            url: 'http://localhost:3000/merge',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify({
                size: SIZE,
                filename: this.container.file.name
            })
        });
    },
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      const {shouldUpload, uploadedList} = await this.verifyUpload(
        this.container.file.name,
      );
      this.data = fileChunkList.map(({file}, index) => ({
        chunk: file,
        index,
        // 文件名 + 数组下标
        hash: this.container.file.name + '-' + index,
        size: file.size,
        percentage: uploadedList?.includes?.(index) ? 100 : 0
      }));

      await this.uploadChunks();
    },
    async verifyUpload(filename) {
      const {data} = await uploadRequest({
        url: 'http://localhost:3000/verify',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          filename,
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
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map(item => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    }
  }
};
</script>