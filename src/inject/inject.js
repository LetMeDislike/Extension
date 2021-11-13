/*
	LetMeDislike
 */

const isOnWatchPage = () => {
	return (document.location.href.startsWith("https://www.youtube.com/watch?v=") || document.location.href.startsWith("https://youtube.com/watch?v="))
};

const getVideoId = () => {
	return (document.location.href.replace("https://www.youtube.com/watch?v=","").replace("https://youtube.com/watch?v=",""))
}

if(isOnWatchPage()) {
	const id = getVideoId();

	window.addEventListener("load", () => {
		const dislikeButton = document.createElement("button");
		dislikeButton.append(document.createElement("span"));
		dislikeButton.append(document.createElement("i"));
		dislikeButton.append(document.createElement("p"));

		dislikeButton.querySelector("i").innerText = "thumb_down";

		dislikeButton.className = "mdc-button";
		dislikeButton.querySelector("span").className = "mdc-button__ripple";
		dislikeButton.querySelector("p").className = "mdc-button__label";
		dislikeButton.querySelector("i").className = "material-icons mdc-button__icon";

		dislikeButton.querySelector(".mdc-button__label").innerText = "Loading...";

		const parent = document.querySelector('#top-level-buttons-computed').children[1].querySelector("a");
		parent.innerHTML = "";
		parent.append(dislikeButton);

		dislikeButton.disabled = true;

		console.log(`Fetching dislike count of video ${id}`);

		const xhttp = new XMLHttpRequest();
		xhttp.onload = function () {
			const response = JSON.parse(this.responseText);
			if (response.status === 200) {
				const xhttp = new XMLHttpRequest();
				xhttp.onload = function () {
					try {
						const dislikeData = JSON.parse(this.responseText);
						dislikeButton.querySelector("p").innerText = dislikeData.display;
					}catch (err) {
						dislikeButton.querySelector("p").innerText = "Failed to load.";
					}
				}
				xhttp.open("GET", response.url);
				xhttp.send();
			} else {
				dislikeButton.querySelector("p").innerText = "Failed to load.";
			}
		}
		xhttp.open("GET", `https://let-me-dislike-server.herokuapp.com/dislikes?id=${id}`);
		xhttp.send();
	});
}