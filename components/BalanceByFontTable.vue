<template>
  <div className="balance-by-font-container">
    <table>
      <th>
        <tr>
          <td>ID</td>
          <td>Valor</td>
        </tr>
      </th>
      <tbody>
        <tr v-for="balanceByFont in balanceByFonts">
          <td>{{ balanceByFont.balanceFontId }}</td>
          <td>{{ balanceByFont.balance }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { BalanceByFont } from "~/entities/BalanceByFont";

defineProps({ balanceByFonts: Array<BalanceByFont> });
</script>
