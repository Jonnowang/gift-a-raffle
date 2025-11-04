<script lang="ts">
	import type { LayoutData } from './$types';

	let { children, data }: LayoutData = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

{@render children()}
