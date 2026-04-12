<script lang="ts">
	import Present from '$lib/components/Present.svelte';
	import Ticket from '$lib/components/Ticket.svelte';
	import TicketDropdown from '$lib/components/TicketDropdown.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	// @ts-expect-error: confetti is a global variable
	import confetti from 'canvas-confetti';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isDrawing = $state(false);
	let open = $state(false);
	let selectedTier: 'bronze' | 'silver' | 'gold' = $state('bronze');

	$effect(() => {
		if (form?.prize) {
			isDrawing = true;
			open = true;
			setTimeout(() => {
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 }
				});
			}, 500);
		}
	});

	function reset() {
		isDrawing = false;
		open = false;
		form = null;
	}
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
	<div class="relative mb-8 aspect-square w-full max-w-[256px]">
		<Present {open}>
			{#if form?.prize}
				<div class="text-2xl font-bold text-red-400">Pudsy Prize</div>
				<div class="text-lg font-bold text-gray-800">{form.prize}</div>
			{/if}
		</Present>
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
		<button onclick={reset} class="mt-8 rounded bg-blue-500 p-2 text-white"> Draw Again </button>
	{/if}
</div>
