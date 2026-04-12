<script lang="ts">
	import ScratchCard from '$lib/components/ScratchCard.svelte';
	import Ticket from '$lib/components/Ticket.svelte';
	import TicketDropdown from '$lib/components/TicketDropdown.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isDrawing = $state(false);
	let selectedTier: 'bronze' | 'silver' | 'gold' = $state('bronze');

	const currentPrizeImageSrc = $derived(form?.imageUrl || '');

	$effect(() => {
		if (form?.prize) {
			isDrawing = true;
		}
	});

	function reset() {
		isDrawing = false;
		form = null;
	}
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
	<div class="relative mb-16 aspect-square w-full max-w-[256px]">
		{#key isDrawing}
			<ScratchCard prize={form?.prize ?? null} disabled={!isDrawing} prizeImageSrc={currentPrizeImageSrc} />
		{/key}
	</div>

	{#if !isDrawing}
		<div class="mt-4 flex flex-col items-center">
			<form method="POST" action="?/drawPrize" use:enhance class="flex flex-col items-center">
				<input type="hidden" name="tier" value={selectedTier} />
				<TicketDropdown bind:value={selectedTier} />
				<button
					type="submit"
					class="border-none bg-transparent p-0 transition-transform hover:scale-105 active:scale-95"
					disabled={data.tickets.filter((t) => t.tier === selectedTier).length <= 0}
				>
					<Ticket tier={selectedTier} />
				</button>
			</form>
			<span class="mt-2 ml-2 text-white">{data.tickets.filter((t) => t.tier === selectedTier).length} Tickets</span>
		</div>
	{:else}
		<button onclick={reset} class="mt-8 rounded bg-blue-500 p-2 text-white"> Play Again </button>
	{/if}
</div>
