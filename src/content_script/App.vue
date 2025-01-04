<template>
    <div></div>
</template>
<script setup lang="ts">
import { ref, Ref } from 'vue';

let name: Ref<string> = ref('');

fetch(globalThis.chrome.runtime.getURL('manifest.json'))
    .then((res) => res.json())
    .then((manifest: any) => {
        name.value = manifest.name;
    });
</script>

<style lang="stylus">
.info {
  position fixed
  top 0
  z-index 9999
  background red
  padding: 10px
}
</style>
