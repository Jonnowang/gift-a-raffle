<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<div class="grow">
		{@render children()}
	</div>
	<nav class="fixed right-0 bottom-0 left-0 flex justify-center bg-gray-800 p-4">
		<div class="inline-flex items-center justify-center rounded-md">
			<Button
				size="sm"
				class="border-none bg-linear-to-r from-orange-700 to-red-600 font-bold text-white transition-all duration-300 hover:from-orange-800 hover:to-red-700"
				onclick={() => {
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto('/');
				}}>Gift Box</Button
			>
			<div class="mx-2 h-6 w-px bg-gray-600"></div>
			<Button
				size="sm"
				class="border-none bg-linear-to-r from-yellow-400 to-amber-500 font-bold text-gray-800 transition-all duration-300 hover:from-yellow-500 hover:to-amber-600"
				onclick={() => {
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto('/scratch');
				}}>Scratch Card</Button
			>
			<div class="mx-2 h-6 w-px bg-gray-600"></div>
			<Button
				size="sm"
				class="border-none bg-linear-to-r from-green-600 to-emerald-700 font-bold text-white transition-all duration-300 hover:from-green-700 hover:to-emerald-800"
				onclick={() => {
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto('/gift-shop');
				}}>Gift Shop</Button
			>
		</div>
	</nav>
</div>

<style>
	:global(body) {
		background-color: #111827;
		font-family: sans-serif;
	}
</style>
