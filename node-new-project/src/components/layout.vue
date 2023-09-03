<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo">DEMO</div>
      <a-menu
        v-model:selectedKeys="header.selectedKeys"
        theme="dark"
        mode="horizontal"
        class="menu"
      >
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
      <div class="user">{{header.user.username}}</div>
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
    import {reactive, ref, watchEffect} from 'vue';
    import {message} from 'ant-design-vue';
    import axios from 'axios';

    interface Header {
        user: {
          username: string;
          userId: string;
        };
        selectedKeys: string[];
    }
    const header = reactive<Header>({
      user: {
          username: '',
          userId: '',
      },
      selectedKeys: ['2'],
    });
    watchEffect(() => {
      const getUserInfo = async () => {
        const {data: info} = await axios.get('http://localhost:8080/getUser');
        if (info.code === 200) {
          header.user = info.data;
        }
        else {
            message.error(info.message);
        }
      };
      getUserInfo();
    });
    
</script>
<style scoped type="less">
.ant-layout.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .ant-layout-header {
      display: flex;
      flex-direction: row;
      padding: 0 20px;
      height: 64px;
      line-height: 64px;
      .menu {
          flex: 1;
          padding: 0 20px;
      }
      .logo {
          color: #fff;
          font-size: 32px;
      }
      .user {
          color: #fff;
          font-size: 16px;
      }
  }
  .ant-layout-content {
      flex: 1;
      min-height: 0;
  }
}
</style>