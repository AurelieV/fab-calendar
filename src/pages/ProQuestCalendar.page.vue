<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-1 pt-2 w-[min(90vw,1000px)] mx-auto">
      <TournamentCalendar
        :tournaments="tournaments"
        :title="title"
        :year="2023"
      ></TournamentCalendar>
    </main>
    <nav class="mt-6 mb-2">
      <ul>
        <li class="text-center"><a class="pf-link" href="/skirmish">Skirmish Calendar</a></li>
      </ul>
    </nav>
    <Pf_Footer></Pf_Footer>
  </div>
</template>

<script>
import { Pf_Footer } from 'purplefox-tools'

import TournamentCalendar from '/src/components/TournamentCalendar.vue'
import tournaments from '/src/assets/data/pq-2023-q4.json'

const title = 'Flesh and Blood ProQuest Calendar Season 4'

export const documentProps = {
  title,
  description: 'A calendar for all the Flesh and Bloods events !',
}

export default {
  components: { Pf_Footer, TournamentCalendar },
  setup() {
    return { tournaments, title }
  },
}
</script>
