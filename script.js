// TMBD

const API_KEY = 'api_key=82b2f1aebd1488622056f64bf0d6d9b3';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const search_URL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const current = document.getElementById('current');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

getMovies(API_URL);

function getMovies(url) {
    lastUrl = url;

    fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if(currentPage <= 1){
            prev.classList.add('disabled');
            next.classList.remove('disabled');
        }else if(currentPage >= totalPages){
            prev.classList.remove('disabled');
            next.classList.add('disabled');
        }else{
            prev.classList.remove('disabled');
            next.classList.remove('disabled');
        }
    })
}

function showMovies(data){

    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML =  `
        <div class='movieIMG'>
        <img src= "${IMG_URL + poster_path}" alt="${title}">
        </div>
            
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>
        `

        main.appendChild(movieEl);
    })
}

function getColor(vote) {
    if(vote >= 8){
        return 'green'
    }
    else if(vote >= 5){
        return 'orange'
    }
    else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchParam = search.value;

    if(searchParam) {
        getMovies(search_URL + '&query=' + searchParam)
    }
    else {
        getMovies(API_URL);
    }

    main.scrollIntoView({behavior: 'smooth'});
})

prev.addEventListener('click', () => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
    main.scrollIntoView({behavior: 'smooth'});
})

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
    main.scrollIntoView({behavior: 'smooth'});
})

function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');

    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + `?` + b;

        getMovies(url);
    };
}