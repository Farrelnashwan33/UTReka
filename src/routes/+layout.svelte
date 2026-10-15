<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children }: LayoutProps = $props();

	onMount(() => {
		authStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

<ToastContainer />
{@render children()}
