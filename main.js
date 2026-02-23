// Live Server(5500) 사용 시에만 Express(3000)로 요청, 그 외(Express/Vercel)는 상대경로
const API_URL = window.location.port === '5500'
    ? 'http://localhost:3000/api/movies'
    : '/api/movies';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movieGrid');
const loadingEl = document.getElementById('loading');

async function fetchMovies() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error || `서버 오류 (${res.status})`);
        }
        if (data.results) {
            renderMovies(data.results);
        } else {
            movieGrid.innerHTML = '<p class="error">영화 목록을 불러올 수 없습니다.</p>';
        }
    } catch (err) {
        const msg = err.message || 'API 연결에 실패했습니다.';
        movieGrid.innerHTML = `<p class="error">${msg}<br><small>Express 서버(npm start)로 localhost:3000에서 실행 중인지 확인하세요.</small></p>`;
        console.error(err);
    } finally {
        loadingEl.style.display = 'none';
    }
}

function renderMovies(movies) {
    movieGrid.innerHTML = movies.map(movie => `
        <article class="movie-card">
            <div class="poster-wrap">
                <img 
                    src="${movie.poster_path ? POSTER_BASE + movie.poster_path : 'https://via.placeholder.com/200x300/333/999?text=No+Image'}" 
                    alt="${movie.title}"
                    class="poster"
                    loading="lazy"
                >
            </div>
            <h3 class="movie-title">${movie.title}</h3>
            <p class="release-date">${movie.release_date ? movie.release_date.replace(/-/g, '.') : '-'}</p>
        </article>
    `).join('');
}

fetchMovies();
