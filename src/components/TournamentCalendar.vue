<template>
  <h1 class="title">{{ title }}</h1>
  <section class="mt-6">
    <div
      class="flex items-center font-bold cursor-pointer select-none text-purple"
      @click="isFiltersOpen = !isFiltersOpen"
    >
      <Pf_Icon
        icon="mdi:chevron-up"
        class="mr-1 transition-transform"
        :class="{ 'rotate-90': !isFiltersOpen }"
      >
      </Pf_Icon>
      Filter by countries
    </div>
    <Pf_ExpandTransition>
      <div v-if="isFiltersOpen">
        <div class="flex flex-col my-2 md:flex-row md:justify-end">
          <button class="pf-btn -secondary" @click="uncheckAll">Uncheck all</button>
        </div>
        <ul class="grid grid-cols-2 gap-2 md:grid-cols-4">
          <li v-for="country of countries" :key="country">
            <label class="flex items-center cursor-pointer">
              <input v-model="filteredCountries[country]" type="checkbox" class="mr-2" />
              {{ country }}
            </label>
          </li>
        </ul>
      </div>
    </Pf_ExpandTransition>
  </section>
  <section class="flex flex-col gap-2 mt-4 md:grid md:grid-cols-2">
    <article v-for="month in months" :key="month.label">
      <h2 class="p-2 -mb-3 text-xl text-center text-white capitalize rounded bg-purple">
        {{ month.label }}
      </h2>
      <div v-for="day in month.days" :key="day.label" class="mt-4">
        <h3 class="text-lg font-bold capitalize text-purple">{{ day.label }}</h3>
        <ul class="flex flex-col space-y-2">
          <Tournament
            v-for="tournament in day.tournaments"
            :key="tournament.name"
            tag="li"
            :tournament="tournament"
          ></Tournament>
        </ul>
      </div>
    </article>
  </section>
  <p v-if="filteredTournaments.length === 0" class="mt-4">
    If you do not see any data, please check your filters
  </p>
</template>

<script>
import { reactive, watch, ref, computed, onMounted } from 'vue'
import groupBy from 'lodash.groupby'
import { Pf_ExpandTransition } from 'purplefox-tools'

import Tournament from '/src/components/Tournament.vue'

export default {
  components: { Tournament, Pf_ExpandTransition },
  props: {
    tournaments: { type: Array, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
  },
  setup(props) {
    const countries = [...new Set(props.tournaments.map(({ country }) => country))].sort()

    const initialValue = Object.fromEntries(countries.map((country) => [country, true]))
    const filteredCountries = reactive(initialValue)

    // Access localstorage only on browser side
    onMounted(() => {
      const oldFilters = localStorage.getItem('filters')
      if (oldFilters) {
        Object.assign(filteredCountries, JSON.parse(oldFilters))
      }
    })

    const filteredTournaments = computed(() => {
      return props.tournaments.filter(({ country }) => filteredCountries[country])
    })

    const months = computed(() => {
      const months = groupBy(filteredTournaments.value, 'date.month')
      Object.keys(months).forEach((month) => {
        const label = new Date(props.year, parseInt(month) - 1).toLocaleString('default', {
          month: 'long',
        })
        const days = groupBy(months[month], 'date.day')
        Object.keys(days).forEach((day) => {
          const label = new Date(props.year, parseInt(month) - 1, parseInt(day)).toLocaleString(
            'default',
            {
              month: 'long',
              weekday: 'long',
              day: 'numeric',
            }
          )
          days[day] = { label, tournaments: days[day] }
        })

        months[month] = { label, days }
      })

      return months
    })

    watch(
      filteredCountries,
      (value) => {
        localStorage.setItem('filters', JSON.stringify(value))
      },
      { deep: true }
    )

    function uncheckAll() {
      Object.keys(filteredCountries).forEach((country) => (filteredCountries[country] = false))
    }

    return {
      months,
      countries,
      filteredCountries,
      isFiltersOpen: ref(false),
      uncheckAll,
      filteredTournaments,
    }
  },
}
</script>
