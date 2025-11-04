<script lang="ts">
	let { open = false, children } = $props();
</script>

<div class="relative h-64 w-64 cursor-pointer">
	<div
		class="lid absolute top-0 left-1/2 z-10 h-16 w-72 -translate-x-1/2 transform rounded-t-lg bg-red-500 shadow-lg transition-transform duration-500"
		class:open-lid={open}
	>
		<div class="absolute top-0 left-1/2 h-full w-8 -translate-x-1/2 transform bg-yellow-400"></div>
		<div
			class="bow absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 transform rounded-full bg-yellow-400"
		></div>
		<div
			class="bow-tie absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 transform rounded-full bg-yellow-300"
		></div>
	</div>

	<div class="box absolute bottom-0 left-0 h-48 w-full rounded-b-lg bg-red-600 shadow-lg">
		<div class="absolute top-1/2 left-0 h-8 w-full -translate-y-1/2 transform bg-yellow-400"></div>
		<div class="absolute top-0 left-1/2 h-full w-8 -translate-x-1/2 transform bg-yellow-400"></div>
	</div>

	<div
		class="prize-container absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500"
		class:open-prize={open}
	>
		<div
			class="prize transform rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 p-4 text-gray-800 shadow-lg transition-transform duration-300 hover:scale-110"
		>
			{@render children()}
		</div>
	</div>
</div>

<style>
	.lid {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	.open-lid {
		transform: translate(-50%, -80px) rotate(-20deg);
	}
	.prize-container {
		transform: translate(-50%, -50%) scale(0) rotate(0deg);
		transform-origin: bottom left;
		opacity: 0;
	}
	.open-prize {
		transform: translate(55%, -140%) scale(1) rotate(15deg);
		opacity: 1;
	}
	.prize {
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% {
			box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
		}
		50% {
			box-shadow: 0 0 20px rgba(255, 255, 0, 1);
		}
		100% {
			box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
		}
	}
</style>
