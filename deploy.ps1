# vive_s02_movies 폴더만 GitHub에 푸시하는 스크립트
Set-Location $PSScriptRoot

# Git 초기화 (이미 있으면 무시)
if (-not (Test-Path .git)) {
    git init
}

# Remote 설정
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote add origin https://github.com/editor-7/vibe_noona_s02.git
} else {
    git remote set-url origin https://github.com/editor-7/vibe_noona_s02.git
}

# 커밋 & 푸시
git add .
git status
git commit -m "Initial commit: Now Playing 영화 앱 (API 키 숨김)"
git branch -M main
git push -u origin main
