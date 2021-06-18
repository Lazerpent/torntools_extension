"use strict";

(async () => {
	if (!getPageStatus().access) return;

	const params = getSearchParameters();
	if (params.get("step") !== "your") return;

	featureManager.registerFeature("Scrape OC", "faction", true, initialiseListeners, startFeature, null, null, null);

	function initialiseListeners() {
		CUSTOM_LISTENERS[EVENT_CHANNELS.FACTION_CRIMES].push(readCrimes);
	}

	function startFeature() {
		if (!document.find(".faction-crimes-wrap")) return;

		readCrimes();
	}

	async function readCrimes() {
		let time;
		const member = document.find(`.crimes-list > li.item-wrap .team > a[href="/profiles.php?XID=${userdata.player_id}"]`);
		if (member) {
			const status = member.closest(".item-wrap").find(".status");

			if (status.innerText === "Ready") time = Date.now();
			else time = Date.now() + textToTime(status.innerText);
		} else {
			time = -1;
		}

		await ttStorage.change({ localdata: { userCrime: time } });
	}
})();
