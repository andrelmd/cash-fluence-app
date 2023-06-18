<template>
  <div>
    <h1>Visão Geral</h1>
    <div>
      <form class="flex flex-direction-column" @submit.prevent="insertEntry">
        <input :v-model="newEntry.name" class="mx-4" placeholder="Nome" />
        <input :v-model="newEntry.value" class="mx-4" placeholder="Valor" />
        <select :v-model="newEntry.entryTypeId" class="mx-4" name="entryTypes">
          <option v-for="entryType of entryTypes" :v-model="entryType.id">
            {{ entryType.name }}
          </option>
        </select>
        <button class="btn mx-4" @click="insertEntry">Adicionar</button>
      </form>
      <div>
        <h2>Entradas</h2>
        <div v-for="entry of positiveEntries">
          <EntryCard :entry="entry" />
        </div>
      </div>
      <div>
        <h2>Saídas</h2>
        <div v-for="entry of negativeEntries">
          <EntryCard :entry="entry" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { entryRepository } from "@/database/EntryRepository";
import { entryTypeRepository } from "@/database/EntryTypeRepository";
import EntryCard from "~/components/EntryCard.vue";
import { Entry } from "~/entities/Entry";
const entries = await entryRepository.getEntries();
const positiveEntries = entries.filter((it) => it.entryTypeId === 1);
const negativeEntries = entries.filter((it) => it.entryTypeId === 2);
const entryTypes = await entryTypeRepository.getEntryTypes();
const newEntry: Partial<Entry> = {createdAt:new Date()};

const insertEntry = () =>
  useState<void>("insertEntry", () => {
    console.log(newEntry);
  });
</script>
