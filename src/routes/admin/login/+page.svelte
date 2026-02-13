<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="container mx-auto p-4 text-white">
	<h1 class="mb-4 text-2xl font-bold">Admin Login</h1>

	<form method="POST" use:enhance>
		<div class="mb-4">
			<label for="password" class="block text-white">Password</label>
			<input type="password" id="password" name="password" class="w-full border p-2 text-white" />
		</div>
		<button type="submit" class="rounded bg-blue-500 p-2 text-white">Login</button>
	</form>
</div>
