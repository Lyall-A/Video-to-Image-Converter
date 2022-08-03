@echo off
title = Video to Image Converter by Lyall  
if exist "node_modules" (
    node ./src/index.js
    timeout /t 5 /nobreak
) else (
    echo First run, installing modules...
    npm i @ffmpeg-installer/ffmpeg@1.1.0 @ffprobe-intsaller/ffprobe fluent-ffmpeg@2.1.2 prompts@2.4.2
    echo Finished installing modules!
    title = Video to Image Converter by Lyall  
    node ./src/index.js
    timeout /t 5 /nobreak
)
