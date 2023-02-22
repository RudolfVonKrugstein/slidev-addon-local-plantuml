<!--
PlantUML
(auto transformed, you don't need to use this component directly)
Usage:
```plantuml
@startuml
Alice -> Bob : Hello!
@enduml
```
-->
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  svg: string
  scale?: number
}>()
const svg = computed(() => atob(props.svg).replace(/<\?xml .*\?>/,""))
</script>

<template>
  <div :style="{ scale }" v-html="svg"/>
</template>