<script async setup lang="ts">
import { ref, watch } from 'vue';
import { TransactionEntity } from '../domain/entity/transaction.entity';
import Logger from '../helpers/Logger';
import { useCategoryStore } from '../stores/category.store';
import { useTransactionStore } from '../stores/transaction.store';
const props = defineProps<{
  transactionTypeId: number;
}>();

const transactionTitle = ref("");
const transactionAmount = ref(0);
const transactionDate = ref('');
const transactionTypeId = ref(props.transactionTypeId);
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const transactionCategory = ref(categoryStore.categories[0]?.title || '');

const saveTransaction = async () => {
  Logger.debug("Saving transaction");
  try {
    await transactionStore.addTransaction(new TransactionEntity({
      title: transactionTitle.value,
      amount: transactionAmount.value,
      date: new Date(transactionDate.value),
      categoryId: categoryStore.categories.find(it => it.title === transactionCategory.value)?.id,
      typeId: transactionTypeId.value,
    }));

  } catch (error) {
    console.error(error);
    Logger.error((error as any).toString());
  }
};

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  number: (value: string) => !isNaN(Number(value)) || 'Valor inválido',
  date: (value: string) => !isNaN(Date.parse(value)) || 'Data inválida',
  category: (value: string) => !!categoryStore.categories.find(it => it.title === value) || 'Categoria inválida',
}

const isValid = ref(false);
watch([transactionAmount], () => {
  if (transactionAmount.value) transactionAmount.value = Number(/\d+/.exec(transactionAmount.value.toString())?.[0]) || 0;
})
watch([transactionTitle, transactionAmount, transactionDate, transactionCategory], () => {
  Logger.debug("Checking if form is valid");
  isValid.value = !!transactionTitle.value && !!transactionAmount.value && !!transactionDate.value && !!transactionCategory.value;
  Logger.debug(`Form is valid: ${isValid.value}`);
  Logger.debug(`transaction categoryId: ${transactionCategory.value}`);
});

</script>

<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h3>Nova transação</h3>
      </v-card-title>
      <v-form @submit.prevent v-model="isValid">
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field label="Titulo" placeholder="Título" v-model="transactionTitle" style="min-width: 150px;"
                density="compact" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Valor" placeholder="Valor" v-model="transactionAmount" prefix="R$" density="compact"
                style="min-width: 150px;" :rules="[rules.required, rules.number]"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Data" placeholder="Data" v-model="transactionDate" type="date"
                style="min-width: 150px;" density="compact" :rules="[rules.required, rules.date]"></v-text-field>
            </v-col>
            <v-col>
              <v-select label="Categoria" v-model="transactionCategory" style="min-width: 150px;" density="compact"
                :items="categoryStore.categories.map(it => it.title)" :rules="[rules.category]"></v-select>
            </v-col>

          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-col>
            <v-btn @click="saveTransaction" :disabled="!isValid">Salvar</v-btn>
          </v-col>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
