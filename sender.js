async function postData(data,post_url){
    let xhr = new XMLHttpRequest();  
    xhr.open("POST",post_url,true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
};

module.exports = {postData};