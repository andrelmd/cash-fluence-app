<script async setup lang="ts">
import { TransactionEntity } from '../domain/entity/transaction.entity';
import TransactionComponent from './transaction.component.vue';


defineProps<{
    transactions: TransactionEntity[];
}>();
</script>

<template>
    <v-table height="300px">
        <thead>
            <tr>
                <th>Titulo</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Categoria</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaction in $props.transactions" :key="transaction.id">
                <TransactionComponent :transaction="transaction" />
            </tr>
        </tbody>
    </v-table>
</template>
