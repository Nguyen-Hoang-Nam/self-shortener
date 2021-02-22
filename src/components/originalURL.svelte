<script lang="ts">
  export let url;

  export let changeURL;
  const typeInput = (event) => {
    if ("function" === typeof changeURL) {
      changeURL(event.target.value);
    }
  };
</script>

<style>
  .original_url {
    width: 900px;
    height: 30px;
    font-size: 20px;
		border: none;
		border-bottom: 2px solid #999;
		padding: 0;
		margin-bottom: 20px;
		margin-top: 20px;
  }

	.original_url:focus {
		outline: none;
		border-bottom: 2px solid black;
	}
</style>

<input type="text" class="original_url" bind:value={url} on:input={typeInput} />
