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
    padding-left: 10px;
    padding-right: 10px;
  }
</style>

<input type="text" class="original_url" bind:value={url} on:input={typeInput} />
