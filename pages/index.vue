<template>
  <div>
    <h1>Visão Geral</h1>
    <div>
      <form @submit.prevent="handleInsertEntry">
        <input v-model="transactionToSave.name" placeholder="Nome" />
        <input v-model="transactionToSave.value" placeholder="Valor" />
        <input
          v-model="transactionToSave.date"
          type="date"
          :placeholder="new Date().toLocaleString()"
        />
        <select v-model="transactionToSave.transactioTypeId" name="entryTypes">
          <option v-for="entryType of entryTypes" :value="entryType.id">
            {{ entryType.name }}
          </option>
        </select>
        <button @click="handleSave">Adicionar</button>
      </form>
      <div>
        <h2>Entradas</h2>
        <div v-for="transaction of incomes" :key="`entry-${transaction.id}`">
          <EntryCard :transaction="transaction" @deleteEntry="handleDelete" />
        </div>
      </div>
      <div>
        <h2>Saídas</h2>
        <div v-for="transaction of expenses" :key="`entry-${transaction.id}`">
          <EntryCard :transaction="transaction" @deleteEntry="handleDelete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Transaction } from '~/entities/Transaction'
  import { TransactionTypes } from '~/enums/TransactionTypes'
  import { transactionRepository } from '~/repositories/TransactionRepository'
  const transactionToSave = ref<Partial<Transaction>>({})
  const transactions = ref<Array<Transaction>>([])

  const incomes = ref<Array<Transaction>>([])
  const expenses = ref<Array<Transaction>>([])

  const entryTypes = [
    {
      id: TransactionTypes.INCOME,
      name: 'Entrada',
    },
    {
      id: TransactionTypes.EXPENSE,
      name: 'Saída',
    },
  ]

  const handleSave = async () => {
    if (!transactionToSave.value.transactioTypeId) {
      return
    }
    if (!transactionToSave.value.date) {
      return
    }
    if (!transactionToSave.value.name) {
      return
    }
    if (!transactionToSave.value.value) {
      return
    }
    const savedTransaction = await transactionRepository.save({
      date: new Date(transactionToSave.value.date),
      name: transactionToSave.value.name,
      value: transactionToSave.value.value,
      transactioTypeId: transactionToSave.value.transactioTypeId,
    })
    if (savedTransaction) transactions.value.push(...savedTransaction)

    transactionToSave.value = {}
  }

  const handleDelete = async (entryId: number) => {
    await transactionRepository.delete({ id: entryId })
    transactions.value = transactions.value.filter((it) => it.id !== entryId)
  }

  watch(
    transactions,
    (entries) => {
      incomes.value = entries.filter(
        (it) => it.transactioTypeId === TransactionTypes.INCOME,
      )
      expenses.value = entries.filter(
        (it) => it.transactioTypeId === TransactionTypes.EXPENSE,
      )
    },
    { deep: true },
  )

  transactions.value = await transactionRepository.findMany()
</script>
