const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const apiKey = process.env.TMDB_API_KEY?.trim();
    if (!apiKey) {
        return res.status(500).json({ error: 'API 키가 설정되지 않았습니다. Vercel 환경 변수에 TMDB_API_KEY를 추가하세요.' });
    }

    try {
        const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR`;
        const response = await axios.get(url, { timeout: 10000 });
        res.status(200).json(response.data);
    } catch (err) {
        const status = err.response?.status || 500;
        const msg = err.response?.data?.status_message || err.message;
        res.status(status).json({ error: msg });
    }
};
