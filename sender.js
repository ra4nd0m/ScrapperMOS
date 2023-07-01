
function postData(data,post_url){
    //Пробуем отправить данные по ссылке
    fetch(post_url,{
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then((res)=>{
        //проверяем результат отправки
        if(res.ok){
            return res;
        }
        //если не ок то ошибка
        throw new Error("There is some kind of error in POST process!\n")
    })
    //выводим ответ
    .then(res => res.text())
    .then(text=>console.log(text))
    //ловим ошибку
    .catch((error)=>{
        console.log(error);
    })
}




module.exports = {postData};