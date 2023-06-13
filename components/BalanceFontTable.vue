<template>
  <div className="balance-font-container">
    <table>
      <th>
        <tr>
          <td>ID</td>
          <td>Nome</td>
        </tr>
      </th>
      <tbody>
        <tr v-for="balanceFont in balanceFonts">
          <td>{{ balanceFont.id }}</td>
          <td>{{ balanceFont.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { BalanceFont } from "~/entities/BalanceFont";

defineProps({ balanceFonts: Array<BalanceFont> });
</script>
