<template>
  <a-form
    :model="formState"
    name="form"
    :label-col="{span: 4}"
    :wrapper-col="{span: 16}"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{required: true, message: 'Please input your username' }]"
    >
      <a-input maxlength="20" v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{required: true, message: 'Please input your password'}]"
    >
      <a-input-password maxlength="20" type="password" v-model:value="formState.password" />
    </a-form-item>

    <a-form-item :wrapper-col="{offset: 4, span: 16}">
      <a-button type="primary" html-type="submit" :disabled="submitDisabled">登录</a-button>
      <a href="/register" style="margin-left: 10px">去注册</a>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import {reactive, computed} from 'vue';
  import {message} from 'ant-design-vue';
  import axios from 'axios';

  interface FormState {
    username: string;
    password: string;
  }
  const formState = reactive<FormState>({
    username: '',
    password: '',
  });

  const submitDisabled = computed(() => !formState.password || !formState.username);

  const onFinish = async (values: FormState) => {
    const {data} = await axios.post('http://localhost:8080/login', {
        username: values.username,
        password: values.password,
    });
    if (data.code === 200) {
        message.success('登录成功');
        window.location.href = '/';
    }
    else {
        message.error(data.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // 校验失败信息
    console.log('Failed:', errorInfo);
  };

</script>