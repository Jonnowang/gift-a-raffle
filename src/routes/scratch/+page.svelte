<script lang="ts">
	import ScratchCard from '$lib/components/ScratchCard.svelte';
	import Ticket from '$lib/components/Ticket.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isDrawing = $state(false);

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

<div
	class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center"
>
	<div class="relative mb-16 aspect-square w-full max-w-[256px]">
		{#key isDrawing}
			<ScratchCard prize={form?.prize} disabled={!isDrawing} prizeImageSrc={currentPrizeImageSrc} />
		{/key}
	</div>

	{#if !isDrawing}
		<div class="mt-4 flex flex-col items-center">
			<form method="POST" action="?/drawPrize" use:enhance>
				<button
					type="submit"
					class="border-none bg-transparent p-0"
					disabled={data.tickets.length <= 0}
				>
					<Ticket />
				</button>
			</form>
			<span class="mt-2 ml-2 text-white">{data.tickets.length} Tickets</span>
		</div>
	{:else}
		<button onclick={reset} class="mt-8 rounded bg-blue-500 p-2 text-white"> Play Again </button>
	{/if}
</div>
