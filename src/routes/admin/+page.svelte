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
		active: boolean;
		price: number;
		is_monetary: boolean;
	};

	let { data }: { data: PageData } = $props();

	let newPrizeName = $state('');
	let newPrizeWeight = $state(1);
	let newPrizeQuantity = $state(1);
	let newPrizeImageUrl = $state('');
	let newPrizeActive = $state(true);
	let newPrizePrice = $state(0);
	let newPrizeIsMonetary = $state(false);
	let editingId = $state(-1);
	let editingPrize: Prize | null = $state(null);
	let editingBalance = $state(data.balance);

	$effect(() => {
		editingBalance = data.balance;
	});

	function startEditing(prize: Prize) {
		editingId = prize.id;
		editingPrize = { ...prize };
	}

	function cancelEditing() {
		editingId = -1;
		editingPrize = null;
	}
</script>

<div class="container mx-auto p-4 text-white">
	<h1 class="mb-4 text-2xl font-bold">Admin Panel</h1>

	<div class="mb-8">
		<h2 class="mb-2 text-xl font-bold">Manage Balance</h2>
		<form method="POST" action="?/updateBalance" use:enhance class="flex items-center gap-2">
			<span class="text-lg">Current Balance: £</span>
			<input
				type="number"
				step="0.01"
				name="amount"
				value={editingBalance}
				oninput={(e) => (editingBalance = parseFloat(e.currentTarget.value) || 0)}
				class="w-32 rounded border border-gray-600 bg-gray-700 p-2 text-white"
			/>
			<button type="submit" class="rounded bg-green-600 p-2 text-white">Update Balance</button>
		</form>
	</div>

	<div class="mb-8">
		<h2 class="mb-2 text-xl font-bold">Manage Tickets</h2>
		<div class="flex flex-col gap-4">
			{#each ['bronze', 'silver', 'gold'] as tier}
				<div class="flex items-center gap-4">
					<div class="w-24 font-semibold capitalize">{tier} Tickets:</div>
					<div class="w-8 font-bold">{data.tickets.filter((t) => t.tier === tier).length}</div>
					<form method="POST" action="?/addTicket" use:enhance>
						<input type="hidden" name="tier" value={tier} />
						<button type="submit" class="rounded bg-blue-500 px-3 py-1 text-white">Add</button>
					</form>
					<form method="POST" action="?/removeTicket" use:enhance>
						<input type="hidden" name="tier" value={tier} />
						<button type="submit" class="rounded bg-red-500 px-3 py-1 text-white">Remove</button>
					</form>
				</div>
			{/each}
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
							newPrizeActive = true;
							newPrizePrice = 0;
							newPrizeIsMonetary = false;
							await invalidateAll();
						}
					};
				}
			}}
		>
			<div class="flex flex-wrap items-center gap-2">
				<input
					type="text"
					name="name"
					bind:value={newPrizeName}
					class="rounded border border-gray-600 bg-gray-700 p-2 text-white"
					placeholder="Enter a new prize"
				/>
				<input
					type="number"
					name="weight"
					bind:value={newPrizeWeight}
					class="w-24 rounded border border-gray-600 bg-gray-700 p-2 text-white"
					min="1"
				/>
				<input
					type="number"
					name="quantity"
					bind:value={newPrizeQuantity}
					class="w-24 rounded border border-gray-600 bg-gray-700 p-2 text-white"
					min="1"
				/>
				<input
					type="number"
					step="0.01"
					name="price"
					bind:value={newPrizePrice}
					class="w-24 rounded border border-gray-600 bg-gray-700 p-2 text-white"
					placeholder="Price"
				/>
				<input
					type="text"
					name="image_url"
					bind:value={newPrizeImageUrl}
					class="rounded border border-gray-600 bg-gray-700 p-2 text-white"
					placeholder="Enter image URL"
				/>
				<label class="flex items-center space-x-2">
					<input type="checkbox" name="active" bind:checked={newPrizeActive} />
					<span>Active</span>
				</label>
				<label class="flex items-center space-x-2">
					<input type="checkbox" name="is_monetary" bind:checked={newPrizeIsMonetary} />
					<span>Monetary</span>
				</label>
				<button type="submit" class="rounded bg-blue-500 p-2 text-white">Add Prize</button>
			</div>
		</form>

		<div class="overflow-x-auto mt-4">
			<table class="w-full table-auto text-sm">
				<thead>
					<tr>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Prize Name</th>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Weight</th>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Quantity</th>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Price</th>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Image URL</th>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Monetary</th>
						<th class="border-b border-gray-600 px-4 py-2 text-left">Active</th>
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
										class="w-20 rounded border border-gray-600 bg-gray-700 p-1 text-white"
										min="1"
									/>
								</td>
								<td class="border-t border-gray-600 px-4 py-2">
									<input
										type="number"
										bind:value={editingPrize.quantity}
										class="w-20 rounded border border-gray-600 bg-gray-700 p-1 text-white"
										min="1"
									/>
								</td>
								<td class="border-t border-gray-600 px-4 py-2">
									<input
										type="number"
										step="0.01"
										bind:value={editingPrize.price}
										class="w-20 rounded border border-gray-600 bg-gray-700 p-1 text-white"
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
									<input type="checkbox" bind:checked={editingPrize.is_monetary} />
								</td>
								<td class="border-t border-gray-600 px-4 py-2">
									<input type="checkbox" bind:checked={editingPrize.active} />
								</td>
								<td class="border-t border-gray-600 px-4 py-2 whitespace-nowrap">
									<form
										method="POST"
										action="?/updatePrize"
										class="inline-block"
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
										<input type="hidden" name="image_url" value={editingPrize.image_url || ''} />
										<input type="hidden" name="active" value={editingPrize.active ? 'on' : 'off'} />
										<input type="hidden" name="price" value={editingPrize.price} />
										<input
											type="hidden"
											name="is_monetary"
											value={editingPrize.is_monetary ? 'on' : 'off'}
										/>
										<button type="submit" class="mr-2 rounded bg-green-500 p-1 text-white">Save</button>
									</form>
									<button onclick={cancelEditing} class="rounded bg-gray-500 p-1 text-white">Cancel</button>
								</td>
							</tr>
						{:else}
							<tr>
								<td class="border-t border-gray-600 px-4 py-2">{prize.name}</td>
								<td class="border-t border-gray-600 px-4 py-2">{prize.weight}</td>
								<td class="border-t border-gray-600 px-4 py-2">{prize.quantity}</td>
								<td class="border-t border-gray-600 px-4 py-2">£{prize.price.toFixed(2)}</td>
								<td class="border-t border-gray-600 px-4 py-2">{prize.image_url}</td>
								<td class="border-t border-gray-600 px-4 py-2">
									{prize.is_monetary ? 'Yes' : 'No'}
								</td>
								<td class="border-t border-gray-600 px-4 py-2">
									<form method="POST" action="?/togglePrizeActive" use:enhance>
										<input type="hidden" name="id" value={prize.id} />
										<input
											type="checkbox"
											name="active"
											checked={prize.active}
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
										/>
									</form>
								</td>
								<td class="border-t border-gray-600 px-4 py-2 whitespace-nowrap">
									<button
										onclick={() => startEditing(prize)}
										class="mr-2 rounded bg-yellow-500 p-1 text-white">Edit</button
									>
									<form
										method="POST"
										action="?/removePrize"
										class="inline-block"
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
	</div>

	<div>
		<h2 class="mb-2 text-xl font-bold">Prize Log</h2>
		<div class="overflow-x-auto">
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
</div>
