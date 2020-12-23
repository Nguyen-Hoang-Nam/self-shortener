<script lang="ts">
  export let target: string = "";
</script>

<style>
  .target {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 900px;
  }

  .target_url {
    width: 900px;
    height: 30px;
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>

<div class="target">
  <p>https://shortener.dev/</p>
  <input type="text" class="target_url" bind:value={target} />
</div>
