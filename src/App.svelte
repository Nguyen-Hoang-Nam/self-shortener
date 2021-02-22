<script lang="ts">
	// Route
	import { Router, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";

	export let url: string = "";

	
</script>

<Router url="{url}">
	<div style="height: 100%">
		<Route path="/" component="{Home}" />
	</div>
</Router>
