<template>
  <tms-frame header-color="#f00" left-width="10%" right-width="10%" :display-sm="{ header: true, right: true }"
    main-direction-sm="column-reverse">
    <template v-slot:header>
      <div>this is header section</div>
    </template>
    <template v-slot:center>
      <router-view></router-view>
    </template>
    <template v-slot:left>
      <div>
        <tms-flex direction="column">
          <router-link to="/">首页</router-link>
          <router-link to="/layout">布局组件</router-link>
          <router-link to="/object-input">对象输入框</router-link>
          <router-link to="/login">登录框</router-link>
          <router-link to="/register">注册框</router-link>
          <router-link to="/sms-code">短信验证码</router-link>
          <router-link to="/json-schema">JSON定义</router-link>
          <router-link to="/json-doc">JSON文档</router-link>
        </tms-flex>
      </div>
    </template>
    <template v-slot:right>
      <div>this is right section</div>
    </template>
    <template v-slot:footer>
      <div style="height:100px">this is footer section</div>
    </template>
  </tms-frame>
</template>