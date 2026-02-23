const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/api/movies', async (req, res) => {
    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
        console.error('.env에서 TMDB_API_KEY를 찾을 수 없습니다.');
        return res.status(500).json({ error: 'API 키가 설정되지 않았습니다. .env 파일에 TMDB_API_KEY=키값 을 추가하세요.' });
    }

    try {
        const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR`;
        const response = await axios.get(url, { timeout: 10000 });
        res.json(response.data);
    } catch (err) {
        const status = err.response?.status;
        const tmdbMsg = err.response?.data?.status_message;
        let msg = 'TMDB API 요청 실패';
        if (status === 401) msg = 'API 키가 유효하지 않습니다. themoviedb.org에서 새 키를 발급받으세요.';
        else if (status === 404) msg = 'TMDB API 경로 오류';
        else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') msg = '네트워크 연결을 확인하세요.';
        else if (err.code === 'ECONNABORTED') msg = '요청 시간 초과';
        else if (tmdbMsg) msg = tmdbMsg;
        else if (err.message) msg = err.message;
        console.error('TMDB API 오류:', msg);
        res.status(status || 500).json({ error: msg });
    }
});

app.listen(PORT, () => {
    console.log(`서버 실행: http://localhost:${PORT}`);
    console.log(`API 키 로드: ${process.env.TMDB_API_KEY ? '됨' : '실패 - .env 확인'}`);
});
