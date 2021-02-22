<script lang="ts">
	import { navigate } from 'svelte-routing';

	// Components
	import OriginalUrl from "../components/originalURL.svelte";
	import TargetUrl from "../components/targetURL.svelte";

	// Image
	import Github from "../assets/github.svg";

	// Web woker
	import * as Comlink from "comlink";
	const worker = new Worker("/build/hash.worker.js");
	const hashFunction = Comlink.wrap<typeof String>(worker);

	// IndexedDB
	import { openDB } from "idb";

	let url: string = "";
	let target: string = "";
	let enable: boolean = true;

	const DBNAME: string = "shortener";
	const STORENAME: string = "url";
	const REVERSESTORENAME: string = "reverse";
	const oldVersion = 1;
	const version = 1;

	let db;

	(async () => {
		const queryString = location.search
		const params = new URLSearchParams(queryString);
		const id = params.get("id");

		// Check browser supports IndexedDB
		if (!("indexedDB" in window)) {
			enable = false;
			return;
		}

		// Open DB
		db = await openDB(DBNAME, version, {
			upgrade(db, oldVersion, version) {
				// Create object store
				const store = db.createObjectStore(STORENAME);
				const reverse = db.createObjectStore(REVERSESTORENAME);
			},
		});

		if (id) {
			const url = await db.get(STORENAME, id)

			if (url) {
				window.location.replace(url)
			} else {
				navigate("/", {replace: true})
			}
		} else {
			navigate("/", {replace: true})
		}
	})();

	const storeURL = async (event) => {
		await db.put(STORENAME, url, target);
		await db.put(REVERSESTORENAME, target, url);
	};

	const changeURL = async (value) => {
		if (value) {
			const key = await db.get(REVERSESTORENAME, value);

			if (key) {
				target = key;
			} else {
				target = await hashFunction(value);
			}
		} else {
			target = '';
		}
	};

	const changeTarget = async (key) => {
		if (key) {
			const value = await db.get(STORENAME, key);
			if (value) {
				url = value;
			} else {
				url = '';
			}
		} else {
			url = '';
		}
	}
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
	<TargetUrl bind:target {changeTarget} />
	<button on:click={storeURL}>Store</button>
</main>
<footer>
	<Github width="20" height="20" />
</footer>
