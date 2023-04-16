(async function () {
    const response = await fetch("data.json")
    const data = await response.json()
    const searchBar = document.getElementById("searchBar")
    const applyBtn = document.getElementById("apply")
    const yearOpt = document.getElementById("year")
    const genreOpt = document.getElementById("genre")
    const langOpt = document.getElementById("lang")
    const ratingOpt = document.getElementById("rating")
    const cardContainer = document.getElementById("cardContainer")

    const genres = [...new Set(data.flatMap(obj => obj.genres).filter(Boolean))];
    const years = [...new Set(data.map(obj => obj.release_date.slice(0, 4)).filter(Boolean))];
    const languages = [...new Set(data.map(obj => obj.original_language).filter(Boolean))];
    const ratings = [...new Set(data.map(obj => obj.vote_average).filter(Boolean))];

    // Sort values
    genres.sort();
    years.sort((a, b) => b - a);
    languages.sort();
    ratings.sort((a, b) => b - a);

    // Add options to select elements
    function addOptions(options, values) {
        values.forEach(value => {
            const optElem = document.createElement("option");
            optElem.innerHTML = value;
            optElem.value = value;
            options.appendChild(optElem);
        });
    }

    addOptions(genreOpt, genres);
    addOptions(yearOpt, years);
    addOptions(langOpt, languages);
    addOptions(ratingOpt, ratings);

    // Format time
    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    let cardIndex = 0;
    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    function renderCard(data) {
        cardContainer.innerHTML = "";
        data.forEach(function (obj) {
            const runtime = obj.runtime;
            const formattedRunTime = formatTime(runtime);
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <p class="runtime" >${formattedRunTime}</p>
            <img class="card_img" src="https://image.tmdb.org/t/p/w400/${obj.poster_path}">
            <div class="details">
            <p class="title">${obj.title}</p>
            <p class="dim_txt">${obj.original_language},<span class="releaseDate"> ${obj.release_date.slice(0, 4)}</span></p>
                <div class="imbd_rating">
                    </div>
                    <div class="card_genre">${obj.genres}</div>
                    </div>`;
            cardContainer.appendChild(card);
        });
        loadMoreBtn.style.display = "none"
    }

    (function self() {
        for (let i = cardIndex; i < cardIndex + 30 && i < data.length; i++) {
            const obj = data[i];
            // cardContainer = ""
            const runtime = obj.runtime
            const formattedRunTime = formatTime(runtime)
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <p class="runtime" >${formattedRunTime}</p>
            <img class="card_img" src="https://image.tmdb.org/t/p/w400/${obj.poster_path}">
            <div class="details">
            <p class="title">${obj.title}</p>
            <p class="dim_txt">${obj.original_language},<span class="releaseDate"> ${obj.release_date.slice(0, 4)}</span></p>
                <div class="imbd_rating">
                    </div>
                    <div class="card_genre">${obj.genres}</div>
                    </div>`;
            cardContainer.appendChild(card);
        }
        cardIndex += 30
    })()

    function loadCards() {
        // cardContainer.innerHTML = ""
        for (let i = cardIndex; i < cardIndex + 30 && i < data.length; i++) {
            const obj = data[i];
            const runtime = obj.runtime
            const formattedRunTime = formatTime(runtime)
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <p class="runtime" >${formattedRunTime}</p>
            <img class="card_img" src="https://image.tmdb.org/t/p/w400/${obj.poster_path}">
            <div class="details">
            <p class="title">${obj.title}</p>
            <p class="dim_txt">${obj.original_language},<span class="releaseDate"> ${obj.release_date.slice(0, 4)}</span></p>
                <div class="imbd_rating">
                    </div>
                    <div class="card_genre">${obj.genres}</div>
                    </div>`;
            cardContainer.appendChild(card);
        }
        cardIndex += 30
    }

    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.addEventListener("click", loadCards);

    function search() {
        const query = searchBar.value.toLowerCase();
        const result = data.filter(function (item) {
            return item.title.toLowerCase().includes(query);
        });
        if (result.length === 0) {
            cardContainer.innerHTML = "";
            console.log("NOT FOUND")
            yearOpt.value = "all"
            genreOpt.value = "all"
            loadMoreBtn.style.display = "none"
        }
        else if (query === "") {
            cardContainer.innerHTML = "";
            cardIndex = 0;
            loadCards();
            loadMoreBtn.style.display = "block"
            yearOpt.value = "all"
            genreOpt.value = "all"
        } else {
            renderCard(result);
            yearOpt.value = "all"
            genreOpt.value = "all"
            loadMoreBtn.style.display = "none"
        }
    }

    function genreSearch() {
        const genreQuery = genreOpt.value.toLowerCase();
        const result = data.filter(function (item) {
            if (Array.isArray(item.genres)) {
                return item.genres.join(" ").toLowerCase().includes(genreQuery);
            }
            return false;
        })
        if (!genreQuery || genreQuery == "all") {
            cardContainer.innerHTML = "";
            cardIndex = 0;
            loadCards();
            loadMoreBtn.style.display = "block";
            searchBar.value = "";
            genreOpt.value = "all"
        } else {
            renderCard(result);
            searchBar.value = "";
            genreOpt.value = "all"
        }
    }

    function yearSearch() {
        const yearQuery = yearOpt.value.toLowerCase();
        const result = data.filter(function (item) {
            return item.release_date.toLowerCase().includes(yearQuery);
        });
        if (yearQuery === "all") {
            cardContainer.innerHTML = "";
            cardIndex = 0;
            loadCards();
            loadMoreBtn.style.display = "block";
            searchBar.value = ""
            yearOpt.value = "all"
        } else {
            renderCard(result);
            searchBar.value = ""
            yearOpt.value = "all"
        }
    }

    function langSearch() {
        const langQuery = langOpt.value.toLowerCase();
        const result = data.filter(function (item) {
            return item.original_language.toLowerCase().includes(langQuery);
        });
        if (langQuery === "all") {
            cardContainer.innerHTML = "";
            cardIndex = 0;
            loadCards();
            loadMoreBtn.style.display = "block";
            searchBar.value = ""
            langOpt.value = "all"
        } else {
            renderCard(result);
            searchBar.value = ""
            langOpt.value = "all"
        }
    }

    function rateingSearch() {
        const ratingQuery = +ratingOpt.value
        const result = data.filter(function (item) {
            return item.vote_average === ratingQuery
        })
        if (!ratingQuery) {
            cardContainer.innerHTML = "";
            cardIndex = 0;
            loadCards();
            loadMoreBtn.style.display = "block";
            searchBar.value = ""
            ratingOpt.value = "all"
        } else {
            renderCard(result);
            searchBar.value = ""
            ratingOpt.value = "all"
        }
    }

    searchBar.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            search();
        }
    });

    applyBtn.addEventListener("click", function () {
        if (genreOpt.value != "all") {
            genreSearch()
        } else if (yearOpt.value != "all") {
            yearSearch()
        } else if (langOpt.value != "all") {
            langSearch()
        } else if (ratingOpt.value != "all") {
            rateingSearch()
        } else {
            genreSearch()
        }
    });
})()
