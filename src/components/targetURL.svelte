<script lang="ts">
  export let target: string = "";

	const HOSTNAME: string = window.location.hostname + '/?id=';
	let hostname: string;

	export let changeTarget;
	const typeInput = (event) => {
		if ("function" === typeof changeTarget) {
			changeTarget(event.target.value);
		}
	};
</script>

<style>
  .target {
		position: relative;
    width: 900px;
		padding-top: 15px;
		padding-bottom: 15px;
		font-size: 20px;
		margin-top: 10px;
		margin-bottom: 10px;
  }

	.hostname {
		position: absolute;
		top: 15;
		left: 0;
		z-index: 10;
		border-bottom: 2px solid white;
	}

  .target_url {
		position: relative;
		top: 0;
		left: 0;
    width: 100%;
		padding: 0;
		border: none;
		margin: 0;
		border-bottom: 2px solid #999;
	}

	.target_url:focus {
		border: none;
		outline: none;
		border-bottom: 2px solid black;
	}
</style>

<div class="target">
	<span bind:offsetWidth={hostname} class="hostname">{HOSTNAME}</span>
	<input type="text" style="padding-left: {hostname}px" class="target_url" bind:value={target} on:input={typeInput} />
</div>
