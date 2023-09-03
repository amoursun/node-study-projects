<template>
  <a-list size="small" bordered :data-source="state.contents">
    <template #renderItem="{item}">
      <a-list-item>{{item.content}}</a-list-item>
    </template>
    <template #header>
      <div>留言信息</div>
    </template>
    <template #footer>
      <div>{{`共${state.contents.length}条`}}</div>
    </template>
  </a-list>
  <a-textarea style="margin: 20px;" v-model:value="state.textarea" show-count :maxlength="500" />
  <a-button type="primary" html-type="submit" :disabled="!state.textarea" @click="onSubmit">提交留言信息</a-button>
</template>

<script lang="ts" setup>
  import { reactive, ref} from 'vue';
  import {message} from 'ant-design-vue';
  import axios from 'axios';

  interface State {
    textarea: string;
    loading: boolean;
    contents: Array<{id: number, content: string}>;
  }
  const state = reactive<State>({
    textarea: '',
    contents: [],
    loading: true,
  });
  const getContents = async() => {
    const {data} = await axios.get(`http://localhost:8080/getMessage`);
    state.loading = false;
    if (data.code === 200) {
      state.contents = data.data;
    }
    else {
        message.error(data.message);
    }
  };
  getContents();

  const onSubmit = async () => {
    const {data} = await axios.post('http://localhost:8080/sendMessage', {
        content: state.textarea,
        id: Date.now()
    });
    if (data.code === 200) {
      message.success('留言信息发送成功');
      state.contents.unshift({content: state.textarea, id: Date.now()});
      state.textarea = '';
    }
    else {
        message.error(data.message);
    }
  };
</script>