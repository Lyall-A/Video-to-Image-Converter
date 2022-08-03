const fluentFfmpeg = require('fluent-ffmpeg');
const ffmpeg = require("@ffmpeg-installer/ffmpeg").path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
fluentFfmpeg.setFfmpegPath(ffmpeg);
fluentFfmpeg.setFfprobePath(ffprobe);
const prompts = require('prompts');
const fs = require('fs');

(async () => {
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
    if (!fs.existsSync(`${__dirname}\\${fileName}`)) {
        fs.mkdirSync(`${__dirname}\\${fileName}`)
    }

    let frames;
    fluentFfmpeg(location).ffprobe((err, data) => {
        if (err) frames = "Unknown";
        if (!err) frames = data.streams[0].nb_frames;
        let watch = fs.watch(`${__dirname}\\${fileName}`, (event, filename) => {
            if (filename) if (filename.startsWith("Frame ")) console.log(`Frame ${filename.split("Frame ")[1].split(".")[0]} out of ${frames} completed`)
        });
        fluentFfmpeg(location).save(`${__dirname}\\${fileName}\\Frame %d.png`).on('end', () => { watch.close(); return console.log("Complete") }).on('error', (err) => { watch.close(); return console.log(`Failed\n${err}`) });
    });
})()