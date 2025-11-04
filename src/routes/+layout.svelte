<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';

	let { children, data }: LayoutData = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
