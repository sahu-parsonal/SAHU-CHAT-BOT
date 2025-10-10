/** I am doing this coding with a lot of difficulty, please don't post it yourself¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "bd",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "Farhan",
 description: "Sex VEDIO",
 commandCategory: "Image",
 usages: "sex vedio",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = ["Ufffffff🥵💋💋\n ভন্ড হাত মারবি না কিন্তু 😸🥵💋"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [

 "https://drive.google.com/uc?id=11-DAJbuvp78KowPBEsP-nP_ukGZPRaZW",
 "https://drive.google.com/uc?id=1189uVGqh2LCKb2LHmoPJrJ-VrGthBydZ",
 "https://drive.google.com/uc?id=11BymhX0TNEbtvSoRK8u52hfzdqjdlkqL",
 "https://drive.google.com/uc?id=11GmsStGJ0V0E8URgjwluMfAkHnxfnjox",
 "https://drive.google.com/uc?id=11M1LlRBGCSjSLDJ9sijBLkfOMW6T2EGi",
 "https://drive.google.com/uc?id=11QgjVOd2MWUn7YhJX_fJjbeqh1U5ZH5J",
 "https://drive.google.com/uc?id=11GmsStGJ0V0E8URgjwluMfAkHnxfnjox",
 "https://drive.google.com/uc?id=11QMSvLBFAP9Iylug6svIL700Oz6JJf0r",
 "https://drive.google.com/uc?id=11Fxw7KjqJMFSAUq-8tzNvUmw5WZq9ymK",
 "https://drive.google.com/uc?id=11KrFcrBF9tUnGIX2aTlbBzBcvouZzvRe",
 "https://drive.google.com/uc?id=11NXhy4Jkdncdv1ZVeCejMfCFyXzDU0V4",
 "https://drive.google.com/uc?id=11weSOMAQScyo7aHDkVDgxnNvDSovO_ZV",
 "https://drive.google.com/uc?id=11xjsJnQYr5grlHMboxSLR0BUoVdxrZ_u",
 "https://drive.google.com/uc?id=127Xq-12UxZrp8x0kLmZBfVb0TILhVnC2",
 "https://drive.google.com/uc?id=12DpD0YRdPS4VgXIJcWzERUqtZRjmaoVj",
 "https://drive.google.com/uc?id=12T3dbV_CRRQl3_gDd_GhchdvrFl7RNqq",
 "https://drive.google.com/uc?id=12U6m8CqhHBYhR7pw5lSc59V7Zihoq__X",
 "https://drive.google.com/uc?id=12bKBo4O8MQpdMAT-CqLko9lwDTzMDrNu",
 "https://drive.google.com/uc?id=12VjO4v-2BKUGtAJ0tXZmX1p-j2g2qYt0",
 "https://drive.google.com/uc?id=12bKBo4O8MQpdMAT-CqLko9lwDTzMDrNu",
 "https://drive.google.com/uc?id=12eBzB5FYhXHZNX8ES_rENF3LjEhGtPte",
 "https://drive.google.com/uc?id=12hvEPYGzTWLjLAwcMCb7jD3NVS1wmGcS",
];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };