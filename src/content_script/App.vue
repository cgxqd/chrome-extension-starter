<template>
  <el-alert class="info" :title="`当前页面正在被扩展${name}监管`" type="warning" effect="dark" />
</template>
<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ElAlert } from 'element-plus';
import { sendMessage } from '@/tools';

let name: Ref<string> = ref('');

// eslint-disable-next-line no-undef
fetch(chrome.runtime.getURL('manifest.json'))
  .then((res) => res.json())
  .then((manifest: any) => {
    name.value = manifest.name;
  });

sendMessage('TEST', '我是从内容脚本发过来的数据', (res) => {
  console.log('收到后台的消息', res);
});
</script>

<style lang="stylus">
.info {
  position fixed
  top 0
  z-index 9999
}
</style>
