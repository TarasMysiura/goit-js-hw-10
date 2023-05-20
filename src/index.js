import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

refs.countryList.list_style = 'none';
refs.input.addEventListener('input', debounce(emptyName, DEBOUNCE_DELAY));

function emptyName() {
  if (refs.input.value.trim() === '') {
    refs.countryList.innerHTML = '';
    refs.countryCard.innerHTML = '';
  } else {
    search();
  }
}

function search() {
  fetchCountries(refs.input.value.trim())
    .then(result => {
      if (result.length > 10) {
        handleTooManyMatchesFound();
      } else if (result.length >= 2 && result.length <= 10) {
        changeCountryList(result);
        console.log(1);
      } else if (result.length === 1) {
        createCountryCard(result);
        console.log(2);
      } else {
        Notiflix.Notify.failure('Oops, something went wronga!');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, something went wrong!');
    });
}

function handleTooManyMatchesFound() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function changeCountryList(data) {
  refs.countryList.innerHTML = ``;
  refs.countryList.innerHTML = data
    .map(({ flags, name }) => {
      return `<li class="list-item" display="flex">
  <img src="${flags.svg}" width="50" height="40" alt="${flags.alt}">
  <h2 class="item-title">${name.official}</h2>
</li>`;
    })
    .join('');
  refs.countryCard.innerHTML = '';
}

function createCountryCard(data) {
  refs.countryCard.innerHTML = data
    .map(({ capital, flags, languages, name, population }) => {
      return `<img src="${flags.svg}" width="70" height="50" alt="${flags.alt}">
<h2>${name.common} (${name.official})</h2>
<p>Capital: ${capital}</p>
<p>Population: ${population.toLocaleString()}</p>
<p>Languages: ${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  refs.countryList.innerHTML = '';
}
