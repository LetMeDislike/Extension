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
		check();
	});

	let previousLocation = window.location.href;
	setInterval(() => {
		if(previousLocation !== window.location.href) {
			previousLocation = window.location.href;
			// location has changed, check for dislikes again.
			setTimeout(check, 1000);
		}
	}, 100);

	function check() {
		// making sure the page has completed loading.
		if (document.querySelector('#top-level-buttons-computed') === null) {
			// retry until the page has completed loading.
			setTimeout(check, 100);
		} else {
			// here we can run our code. (fetching the dislikes)
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

			fetch(`https://let-me-dislike-server.herokuapp.com/dislikes?id=${id}`).then(response => response.json()).then((response) => {
				if (response.status === 200) {
					fetch(response.url).then(response => response.json()).then((dislikeData) => {
						try {
							dislikeButton.querySelector("p").innerText = dislikeData.display;
						} catch (err) {
							dislikeButton.querySelector("p").innerText = "Failed to load.";
						}
					}).catch((err) => {
						console.error(err);
						dislikeButton.querySelector("p").innerText = "Failed to load.";
					});
				} else {
					dislikeButton.querySelector("p").innerText = "Failed to load.";
				}
			}).catch((err) => {
				console.error(err);
				dislikeButton.querySelector("p").innerText = "Failed to load.";
			});
		}
	}
}