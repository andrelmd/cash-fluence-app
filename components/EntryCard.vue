<template>
  <div class="card text-center">
    <p>{{ id }}</p>
    <p>{{ value }}</p>
    <p>{{ entryTypeId }}</p>
    <p>{{ createdAt }}</p>
  </div>
</template>

<script lang="ts" setup>
import { Entry } from "@/entities/Entry";
const { entry } = defineProps({ entry: Entry });

const { id, value, entryTypeId, createdAt } = entry ?? {};
</script>
