<script lang="ts">
	import Ticket from './Ticket.svelte';
	
	let { value = $bindable('bronze') }: { value?: 'bronze' | 'silver' | 'gold' } = $props();
	let isOpen = $state(false);

	const tiers: ('bronze' | 'silver' | 'gold')[] = ['bronze', 'silver', 'gold'];

	function selectTier(t: 'bronze' | 'silver' | 'gold') {
		value = t;
		isOpen = false;
	}
	
	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="relative mb-4 inline-block text-left">
	<button
		type="button"
		class="inline-flex w-full items-center justify-between gap-x-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20"
		onclick={toggle}
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		<div class="scale-75 origin-left">
			<Ticket tier={value} />
		</div>
		<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
			<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
		</svg>
	</button>

	{#if isOpen}
		<!-- click outside overlay -->
		<button type="button" class="fixed inset-0 h-full w-full cursor-default bg-transparent border-none z-10" onclick={() => (isOpen = false)} aria-label="Close menu"></button>

		<div class="absolute left-1/2 z-20 mt-2 w-max -translate-x-1/2 origin-top rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
			<div class="py-2 flex flex-col items-center gap-2">
				{#each tiers as tier}
					{#if tier !== value}
						<button
							type="button"
							class="block px-4 py-2 hover:scale-105 transition-transform border-none bg-transparent"
							onclick={() => selectTier(tier)}
						>
							<div class="scale-75 origin-center">
								<Ticket {tier} />
							</div>
						</button>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>
