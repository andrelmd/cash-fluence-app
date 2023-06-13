<template>
  <div class="overview-container">
    <h1>Visão geral</h1>
    <h3>Saldo inicial</h3>
    <div :style="{ display: 'flex' }">
      <div v-if="balanceByFonts.length < 1">
        <button>Adicionar fonte</button>
      </div>
      <div v-else>
        <BalanceByFontTable :balanceByFonts="balanceByFonts" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import databaseService from "~/database/DatabaseService";

const balanceFonts = await databaseService.getBalanceFonts();
const balanceByFonts = await databaseService.getBalanceByFonts();
</script>
