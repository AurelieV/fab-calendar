<template>
  <component :is="tag" class="px-2 py-3 bg-white rounded shadow-md">
    <div>{{ tournament.name }}{{ tournament.format ? ` (${tournament.format})` : '' }}</div>
    <div class="mt-1 text-xs">{{ tournament.address }}</div>
    <div class="mt-3 text-xs text-right">
      <a :href="tournament.link" target="_blank" class="link">View on FaB</a>
      <a :href="mapsLink" target="_blank" class="ml-2 link">View on Maps</a>
    </div>
  </component>
</template>

<script>
export default {
  props: { tournament: { type: Object, required: true }, tag: { type: String, default: 'div' } },
  computed: {
    mapsLink() {
      return `https://maps.google.com/?q=${encodeURI(this.tournament.address)}`
    },
  },
}
</script>

<style scoped>
.link {
  @apply transition-all decoration-orange hover:underline hover:underline-offset-1;
}
</style>
