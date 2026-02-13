<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { confetti } from '@neoconfetti/svelte';
	import { fade, scale } from 'svelte/transition';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const activePrizes = $derived(
		data.prizes
			.filter((p) => p.active && p.price > 0 && !p.is_monetary)
			.sort((a, b) => a.price - b.price)
	);

	let showCelebration = $state(false);
	let purchasedName = $state('');

	$effect(() => {
		if (form?.success) {
			purchasedName = form.prizeName;
			showCelebration = true;
			setTimeout(() => {
				showCelebration = false;
			}, 5000);
		}
	});
</script>

{#if showCelebration}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		transition:fade
	>
		<div class="absolute inset-0 flex items-center justify-center">
			<div
				use:confetti={{ particleCount: 200, force: 0.7, stageHeight: 1200, stageWidth: 1600 }}
			></div>
		</div>
		<div
			class="relative flex flex-col items-center rounded-2xl bg-gray-800 p-6 text-center shadow-2xl ring-2 ring-yellow-400"
			transition:scale
		>
			<div class="mb-3 text-5xl">🎉</div>
			<h2 class="mb-1.5 text-2xl font-bold text-yellow-400">Purchase Successful!</h2>
			<p class="text-lg text-white">Satiated Ye Spending Aye?</p>
			<p class="mt-1.5 text-xl font-bold text-white">{purchasedName}</p>
			<button
				onclick={() => (showCelebration = false)}
				class="mt-6 rounded-full bg-yellow-400 px-6 py-1.5 font-bold text-gray-900 transition-colors hover:bg-yellow-500"
			>
				Yeee To The Haaw!
			</button>
		</div>
	</div>
{/if}

<div class="container mx-auto p-4 pb-24 text-white">
	<div class="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
		<h1 class="text-4xl font-bold text-yellow-400">Jonno's Gift Shop</h1>
		<div class="rounded-lg bg-gray-800 p-4 shadow-inner">
			<span class="text-sm tracking-wider text-gray-400">Pud's Balance</span>
			<div class="text-3xl font-bold text-green-600">£{data.balance.toFixed(2)}</div>
		</div>
	</div>

	{#if form?.error}
		<div class="mb-6 rounded-lg bg-red-500/20 p-4 text-center text-red-400 ring-1 ring-red-500">
			{form.error}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each activePrizes as prize (prize.id)}
			<div
				class="group flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-lg transition-all hover:scale-105 hover:border-yellow-400/50"
			>
				<div class="relative flex h-48 items-center justify-center bg-gray-900 p-4">
					{#if prize.image_url}
						<img
							src={prize.image_url}
							alt={prize.name}
							class="max-h-full max-w-full object-contain"
						/>
					{:else}
						<div class="text-4xl transition-transform group-hover:scale-110">🎁</div>
					{/if}
					{#if prize.quantity <= 0}
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]"
						>
							<span
								class="rotate-12 border-4 border-red-500 px-4 py-1 text-2xl font-black tracking-widest text-red-500 uppercase"
								>Sold Out</span
							>
						</div>
					{/if}
				</div>
				<div class="flex grow flex-col p-4">
					<h2 class="mb-2 text-xl font-bold">{prize.name}</h2>
					<div class="mt-auto flex items-center justify-between gap-4">
						<span class="text-2xl font-bold text-green-400">£{prize.price.toFixed(2)}</span>

						<form method="POST" action="?/purchase" use:enhance>
							<input type="hidden" name="prizeId" value={prize.id} />
							<button
								disabled={prize.quantity <= 0 || data.balance < prize.price}
								class="rounded-lg bg-yellow-400 px-4 py-2 font-bold text-gray-900 transition-all hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
							>
								Buy
							</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if activePrizes.length === 0}
		<p class="mt-8 text-center text-xl text-gray-400">
			The shop is currently empty. Check back later!
		</p>
	{/if}
</div>
