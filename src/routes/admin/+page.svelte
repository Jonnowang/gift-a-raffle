<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	type Prize = {
		id: number;
		name: string;
		weight: number;
		quantity: number;
		image_url: string | null;
	};

	let { data }: { data: PageData } = $props();

	let newPrizeName = $state('');
	let newPrizeWeight = $state(1);
	let newPrizeQuantity = $state(1);
	let newPrizeImageUrl = $state('');
	let editingId = $state(-1);
	let editingPrize: Prize | null = $state(null);

	function startEditing(prize: Prize) {
		editingId = prize.id;
		editingPrize = { ...prize };
	}

	function cancelEditing() {
		editingId = -1;
		editingPrize = null;
	}
</script>

<div class="container mx-auto p-4 text-gray-200">
	<h1 class="mb-4 text-2xl font-bold">Admin Panel</h1>

	<div class="mb-8">
		<h2 class="mb-2 text-xl font-bold">Manage Tickets</h2>
		<div class="flex items-center">
			<p class="mr-4">Current Tickets: {data.tickets.length}</p>
			<form method="POST" action="?/addTicket" use:enhance>
				<button type="submit" class="mr-2 rounded bg-blue-500 p-2 text-white">Add Ticket</button>
			</form>
			<form method="POST" action="?/removeTicket" use:enhance>
				<button type="submit" class="rounded bg-red-500 p-2 text-white">Remove Ticket</button>
			</form>
		</div>
	</div>

	<div class="mb-8">
		<h2 class="mb-2 text-xl font-bold">Manage Prizes</h2>
		<form
			method="POST"
			action="?/addPrize"
			use:enhance={() => {
				if (newPrizeName.trim() !== '') {
					return async ({ result }) => {
						if (result.type === 'success') {
							newPrizeName = '';
							newPrizeWeight = 1;
							newPrizeQuantity = 1;
							newPrizeImageUrl = '';
							await invalidateAll();
						}
					};
				}
			}}
		>
			<input
				type="text"
				name="name"
				bind:value={newPrizeName}
				class="mr-2 rounded border border-gray-600 bg-gray-700 p-2 text-white"
				placeholder="Enter a new prize"
			/>
			<input
				type="number"
				name="weight"
				bind:value={newPrizeWeight}
				class="mr-2 w-24 rounded border border-gray-600 bg-gray-700 p-2 text-white"
				min="1"
			/>
			<input
				type="number"
				name="quantity"
				bind:value={newPrizeQuantity}
				class="mr-2 w-24 rounded border border-gray-600 bg-gray-700 p-2 text-white"
				min="1"
			/>
			<input
				type="text"
				name="image_url"
				bind:value={newPrizeImageUrl}
				class="mr-2 rounded border border-gray-600 bg-gray-700 p-2 text-white"
				placeholder="Enter image URL"
			/>
			<button type="submit" class="rounded bg-blue-500 p-2 text-white">Add Prize</button>
		</form>

		<table class="mt-4 w-full table-auto">
			<thead>
				<tr>
					<th class="border-b border-gray-600 px-4 py-2 text-left">Prize Name</th>
					<th class="border-b border-gray-600 px-4 py-2 text-left">Weight</th>
					<th class="border-b border-gray-600 px-4 py-2 text-left">Quantity</th>
					<th class="border-b border-gray-600 px-4 py-2 text-left">Image URL</th>
					<th class="border-b border-gray-600 px-4 py-2"></th>
				</tr>
			</thead>
			<tbody>
				{#each data.prizes as prize (prize.id)}
					{#if editingId === prize.id && editingPrize}
						<tr>
							<td class="border-t border-gray-600 px-4 py-2">
								<input
									type="text"
									bind:value={editingPrize.name}
									class="w-full rounded border border-gray-600 bg-gray-700 p-1 text-white"
								/>
							</td>
							<td class="border-t border-gray-600 px-4 py-2">
								<input
									type="number"
									bind:value={editingPrize.weight}
									class="w-24 rounded border border-gray-600 bg-gray-700 p-1 text-white"
									min="1"
								/>
							</td>
							<td class="border-t border-gray-600 px-4 py-2">
								<input
									type="number"
									bind:value={editingPrize.quantity}
									class="w-24 rounded border border-gray-600 bg-gray-700 p-1 text-white"
									min="1"
								/>
							</td>
							<td class="border-t border-gray-600 px-4 py-2">
								<input
									type="text"
									bind:value={editingPrize.image_url}
									class="w-full rounded border border-gray-600 bg-gray-700 p-1 text-white"
								/>
							</td>
							<td class="border-t border-gray-600 px-4 py-2">
								<form
									method="POST"
									action="?/updatePrize"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												cancelEditing();
												await invalidateAll();
											}
										};
									}}
								>
									<input type="hidden" name="id" value={prize.id} />
									<input type="hidden" name="name" value={editingPrize.name} />
									<input type="hidden" name="weight" value={editingPrize.weight} />
									<input type="hidden" name="quantity" value={editingPrize.quantity} />
									<input type="hidden" name="image_url" value={editingPrize.image_url} />
									<button type="submit" class="mr-2 rounded bg-green-500 p-1 text-white"
										>Save</button
									>
								</form>
								<button onclick={cancelEditing} class="rounded bg-gray-500 p-1 text-white"
									>Cancel</button
								>
							</td>
						</tr>
					{:else}
						<tr>
							<td class="border-t border-gray-600 px-4 py-2">{prize.name}</td>
							<td class="border-t border-gray-600 px-4 py-2">{prize.weight}</td>
							<td class="border-t border-gray-600 px-4 py-2">{prize.quantity}</td>
							<td class="border-t border-gray-600 px-4 py-2">{prize.image_url}</td>
							<td class="border-t border-gray-600 px-4 py-2">
								<button
									onclick={() => startEditing(prize)}
									class="mr-2 rounded bg-yellow-500 p-1 text-white">Edit</button
								>
								<form
									method="POST"
									action="?/removePrize"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												await invalidateAll();
											}
										};
									}}
								>
									<input type="hidden" name="id" value={prize.id} />
									<button type="submit" class="rounded bg-red-500 p-1 text-white">Remove</button>
								</form>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<div>
		<h2 class="mb-2 text-xl font-bold">Prize Log</h2>
		<table class="w-full table-auto">
			<thead>
				<tr>
					<th class="border-b border-gray-600 px-4 py-2 text-left">Prize Name</th>
					<th class="border-b border-gray-600 px-4 py-2 text-left">Date Won</th>
				</tr>
			</thead>
			<tbody>
				{#each data.prizeLog as entry (entry.id)}
					<tr>
						<td class="border-t border-gray-600 px-4 py-2">{entry.prize_name}</td>
						<td class="border-t border-gray-600 px-4 py-2"
							>{new Date(entry.created_at).toLocaleString()}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
