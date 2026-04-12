<script lang="ts">
	let { tier = 'gold' }: { tier?: 'bronze' | 'silver' | 'gold' } = $props();

	const colors = {
		bronze: '#cd7f32',
		silver: '#c0c0c0',
		gold: '#f9a825'
	};
</script>

<div class="ticket-container" style="--ticket-color: {colors[tier]};">
	<div class="ticket">
		<div class="ticket-left">
			<div class="ticket-content">
				<span class="ticket-star">★</span>
				<span class="ticket-text">RAFFLE</span>
			</div>
		</div>
		<div class="ticket-right">
			<div class="ticket-content">
				<span class="ticket-star">★</span>
				<span class="ticket-text">TICKET</span>
			</div>
		</div>
	</div>
</div>

<style>
	.ticket-container {
		perspective: 1000px;
	}

	.ticket {
		display: flex;
		width: 150px;
		height: 75px;
	}

	.ticket-left,
	.ticket-right {
		width: 50%;
		height: 100%;
		background-color: var(--ticket-color, #f9a825);
		border: 2px dashed #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.ticket-left {
		border-right: none;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	.ticket-right {
		border-left: none;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.ticket-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
	}

	.ticket-star {
		font-size: 24px;
		line-height: 1;
	}

	.ticket-text {
		font-size: 14px;
		font-weight: bold;
	}
</style>
