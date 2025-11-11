<script lang="ts">
	// @ts-expect-error: confetti is a global variable
	import confetti from 'canvas-confetti';

	let {
		prize = null,
		disabled = false,
		prizeImageSrc = ''
	} = $props<{ prize: string | null; disabled?: boolean; prizeImageSrc?: string }>();

	let stage = $state<'idle' | 'scratching' | 'revealed'>('idle');

	// Element bindings
	let canvas: HTMLCanvasElement;
	let scratchCardText: HTMLParagraphElement;

	const scratchCardImageAnimate = $derived(stage === 'revealed');
	const scratchCardTextContent = $derived(
		stage === 'revealed'
			? prize
				? `🎉 You won a ${prize}!`
				: 'No prize drawn!'
			: '🎁 Scratch for a surprise!'
	);

	// Side-effects for when the prize is revealed
	$effect(() => {
		if (stage !== 'revealed' || !scratchCardText) return;

		if (canvas) {
			canvas.style.opacity = '0';
		}

		confetti({
			particleCount: 100,
			spread: 90,
			origin: {
				y:
					typeof window !== 'undefined'
						? (scratchCardText.getBoundingClientRect().bottom + 60) / window.innerHeight
						: 0
			}
		});
	});

	// Main canvas setup and event handling effect
	$effect(() => {
		if (!canvas) return; // Only check for canvas existence

		const context = canvas.getContext('2d', { willReadFrequently: true });
		if (!context) return;

		const devicePixelRatio = window.devicePixelRatio || 1;
		const canvasWidth = canvas.offsetWidth * devicePixelRatio;
		const canvasHeight = canvas.offsetHeight * devicePixelRatio;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		context.scale(devicePixelRatio, devicePixelRatio);

		// Create gradient for the scratchable surface
		const gradient = context.createLinearGradient(0, 0, canvas.offsetWidth, 0);
		gradient.addColorStop(0, '#cfced6');
		gradient.addColorStop(0.25, '#e0dfe6');
		gradient.addColorStop(0.5, '#efeef3');
		gradient.addColorStop(0.75, '#e0dfe6');
		gradient.addColorStop(1, '#cfced6');

		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

		if (disabled) {
			// If disabled, only fill the canvas, don't set up interaction
			return;
		}

		context.globalCompositeOperation = 'destination-out';

		let position = { x: 0, y: 0 };

		const getPointerPosition = ({ clientX, clientY }: PointerEvent) => {
			const { left, top } = canvas.getBoundingClientRect();
			return { x: clientX - left, y: clientY - top };
		};

		const plotLine = (x1: number, y1: number, x2: number, y2: number) => {
			const diffX = Math.abs(x2 - x1);
			const diffY = Math.abs(y2 - y1);
			const dist = Math.sqrt(diffX * diffX + diffY * diffY);
			const step = dist / 50;
			let i = 0;
			while (i < dist) {
				const t = Math.min(1, i / dist);
				const x = x1 + (x2 - x1) * t;
				const y = y1 + (y2 - y1) * t;
				context.beginPath();
				context.arc(x, y, 16, 0, Math.PI * 2);
				context.fill();
				i += step;
			}
		};

		const plot = (e: PointerEvent) => {
			const newPosition = getPointerPosition(e);
			plotLine(position.x, position.y, newPosition.x, newPosition.y);
			position = newPosition;
		};

		const checkScratchPercentage = () => {
			const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
			const pixelData = imageData.data;
			let transparentPixelCount = 0;
			for (let i = 0; i < pixelData.length; i += 4) {
				if (pixelData[i + 3] === 0) {
					transparentPixelCount++;
				}
			}
			const transparentPercentage = (transparentPixelCount * 100) / (canvasWidth * canvasHeight);
			if (transparentPercentage >= 45) {
				stage = 'revealed';
			}
		};

		let clearDetectionTimeout: ReturnType<typeof setTimeout>;

		const onPointerUp = () => {
			canvas.removeEventListener('pointermove', plot);
			clearTimeout(clearDetectionTimeout);
			clearDetectionTimeout = setTimeout(checkScratchPercentage, 500);
		};

		const onPointerDown = (e: PointerEvent) => {
			if (stage === 'revealed') return;
			stage = 'scratching';
			position = getPointerPosition(e);
			canvas.addEventListener('pointermove', plot);
			window.addEventListener('pointerup', onPointerUp, { once: true });
		};

		canvas.addEventListener('pointerdown', onPointerDown);

		return () => {
			canvas.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointerup', onPointerUp);
			clearTimeout(clearDetectionTimeout);
		};
	});
</script>

<p bind:this={scratchCardText} class="scratch-card-text">{scratchCardTextContent}</p>

<div class="scratch-card">
	<img
		class="scratch-card-image"
		src={prizeImageSrc}
		alt={prize ? `${prize} image` : 'Prize image'}
		class:animate={scratchCardImageAnimate}
	/>
	<canvas bind:this={canvas} class="scratch-card-canvas-overlay"></canvas>
</div>

<style>
	.scratch-card {
		position: relative;
		border: 4px solid #c7c6cf;
		border-radius: 8px;
		padding: 12px;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}

	.scratch-card-image {
		border-radius: 4px;
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 4px 4px rgb(0 0 0 / 0.16));
		user-select: none;
		will-change: transform;
	}

	.scratch-card-image.animate {
		animation: pop-out-in cubic-bezier(0.65, 1.35, 0.5, 1) 1s;
	}

	.scratch-card-canvas-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: grab;
		touch-action: none;
		transition: opacity 0.4s;
		border-radius: 8px; /* Match the parent's border-radius */
	}

	.scratch-card-canvas-overlay:active {
		cursor: grabbing;
	}

	@keyframes pop-out-in {
		36% {
			transform: scale(1.125);
		}
		100% {
			transform: scale(1);
		}
	}

	.scratch-card-text {
		margin-bottom: 1em; /* Use margin-bottom to space it from the card below */
		font-size: 1.25em;
		text-align: center;
		color: #c7c6cf;
	}
</style>
