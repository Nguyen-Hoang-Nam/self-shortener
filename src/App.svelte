<script lang="ts">
	// Components
	import OriginalUrl from "./components/originalURL.svelte";
	import TargetUrl from "./components/targetURL.svelte";

	// Image
	import Github from "./assets/github.svg";

	// Web woker
	import * as Comlink from "comlink";
	const worker = new Worker("/build/hash.worker.js");
	const hashFunction = Comlink.wrap<typeof String>(worker);

	// IndexedDB
	import { openDB } from "idb";

	let url: string = "";
	let target: string = "";
	let enable: boolean = true;

	const changeURL = async (value) => {
		target = await hashFunction(value);
	};

	const dbName = "shortener";
	const storeName = "url";
	const oldVersion = 1;
	const version = 1;

	let db;

	(async () => {
		// Check browser supports IndexedDB
		if (!("indexedDB" in window)) {
			enable = false;
			return;
		}

		// Open DB
		db = await openDB(dbName, version, {
			upgrade(db, oldVersion, version) {
				// Create object store
				const store = db.createObjectStore(storeName);
			},
		});
	})();

	const storeURL = async (event) => {
		const URLTransaction = db.transaction(storeName, "readwrite");
		const URLStore = await URLTransaction.objectStore(storeName);

		await URLStore.put(url, target);
	};
</script>

<style>
	h1 {
		font-size: 30px;
		font-weight: bold;
	}

	main {
		height: calc(100% - 30px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	footer {
		height: 30px;
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-top: 1px solid black;
	}
</style>

<main>
	<h1>SELF SHORTENER</h1>
	<OriginalUrl bind:url {changeURL} />
	<TargetUrl bind:target />
	<button on:click={storeURL}>Store</button>
</main>
<footer>
	<Github width="20" height="20" />
</footer>
