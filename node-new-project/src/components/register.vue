<template>
  <a-form
    ref="formRef"
    :model="formState"
    name="form"
    :label-col="{span: 4}"
    :wrapper-col="{span: 16}"
    autocomplete="off"
    :rules="rules"
    @finish="onFinish"
    @validate="handleValidate"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="用户名"
      name="username"
      has-feedback
    >
      <a-input maxlength="20" v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      has-feedback
    >
      <a-input maxlength="20" type="password" v-model:value="formState.password" />
    </a-form-item>
    <a-form-item
      label="确认密码"
      name="checkPassword"
      has-feedback
    >
      <a-input maxlength="20" type="password" v-model:value="formState.checkPassword" />
    </a-form-item>

    <a-form-item :wrapper-col="{offset: 4, span: 14}">
      <a-button type="primary" html-type="submit" :disabled="submitDisabled">注册</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
    import {reactive, computed, ref} from 'vue';
    import {message} from 'ant-design-vue';
    import type { Rule } from 'ant-design-vue/es/form';
    import type { FormInstance } from 'ant-design-vue';
    import axios from 'axios';

    interface FormState {
        username: string;
        password: string;
        checkPassword: string;
    }
    const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
        username: '',
        password: '',
        checkPassword: ''
    });

    const validatePassword = async (_rule: Rule, value: string) => {
        if (value === '') {
            return Promise.reject('Please input the password');
        } else {
            if (formState.checkPassword !== '') {
                formRef.value?.validateFields('checkPassword');
            }
            return Promise.resolve();
        }
    };
    const validateCheckPassword = async (_rule: Rule, value: string) => {
        if (value === '') {
            return Promise.reject('Please input the password again');
        } else if (value !== formState.password) {
            return Promise.reject("Two inputs don't match!");
        } else {
            return Promise.resolve();
        }
    };
    const rules: Record<string, Rule[]> = {
        username: [{required: true, message: 'Please input your username', trigger: 'change' }],
        password: [{ required: true, validator: validatePassword, trigger: 'change'}],
        checkPassword: [{ validator: validateCheckPassword, trigger: 'change' }],
    };

    const submitDisabled = computed(() => !formState.password || !formState.username);
    const onFinish = async (values: FormState) => {
        const {data} = await axios.post('http://localhost:8080/register', {
            username: values.username,
            password: values.password,
        });
        if (data.code === 200) {
            message.success('注册成功');
            // router.push('/');
            window.location.href = '/login';
        }
        else {
            message.error(data.message);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        // 校验失败信息
        console.log('Failed:', errorInfo);
    };
    const resetForm = () => {
        formRef.value?.resetFields();
    };
    const handleValidate = (args: any) => {
        console.log(args);
    };

</script>