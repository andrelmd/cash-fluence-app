<script async setup lang="ts">
import { TransactionEntity } from '../domain/entity/transaction.entity';
import TransactionComponent from './transaction.component.vue';


defineProps<{
    transactions: TransactionEntity[];
}>();
</script>

<template>
    <table>
        <thead>
            <th>Titulo</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Categoria</th>
            <th></th>
        </thead>
        <tbody>
            <tr v-for="transaction in $props.transactions" :key="transaction.id">
                <TransactionComponent :transaction="transaction" />
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
table {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;
    overflow-y: auto;
    max-height: 20px;
    color: var(--info);
}

tr {
    width: 100%;
    border-bottom: 2px darkgray solid;
}
</style>