const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpeg = require("@ffmpeg-installer/ffmpeg").path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
fluentFfmpeg.setFfmpegPath(ffmpeg);
fluentFfmpeg.setFfprobePath(ffprobe);
const prompts = require('prompts');
const fs = require('fs');
const dirname = __dirname.replace(/\//g, "\\");
const { resolve } = require('path');
const convertedDir = `${resolve(dirname, '..')}\\Converted`;

(async () => {
    if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

    const { location } = await prompts({
        type: 'text',
        name: "location",
        message: "Enter the video location",
        validate: validate => !validate ? "You must enter the viedo location" : true
    });

    let fileName = location.split("\\")[location.split("\\").length - 1];
    fileName = fileName.split("/")[fileName.split("/").length - 1];
    fileName = fileName.split(".");
    fileName.pop();
    fileName = fileName.join(".");
    if (!fs.existsSync(`${convertedDir}\\${fileName}`)) {
        fs.mkdirSync(`${convertedDir}\\${fileName}`)
    }

    let frames;
    fluentFfmpeg(location).ffprobe((err, data) => {
        if (err) frames = "Unknown";
        if (!err) frames = data.streams[0].nb_frames;
        let lastFrame = 0;
        let watch = fs.watch(`${convertedDir}\\${fileName}`, (event, filename) => {
            let frame = filename.split("Frame ")[1].split(".")[0];
            if (lastFrame !== frame) if (filename) if (filename.startsWith("Frame ")) console.log(`Frame ${frame} out of ${frames} completed`)
            lastFrame = frame;
        });
        fluentFfmpeg(location).save(`${convertedDir}\\${fileName}\\Frame %d.png`).on('end', () => { watch.close(); return console.log("Complete") }).on('error', (err) => { watch.close(); return console.log(`Failed\n${err}`) });
    });
})()
