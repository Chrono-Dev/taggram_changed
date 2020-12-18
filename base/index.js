/* author: Isaac Vinícius  github: Chrono-Dev*/
import {$username, $avatar} from "./profile.js";
import {$usernamePost, $avatarPost, $photo, $location, $date, parent, child, message, scroll, container, commentsQtd} 
from "./post.js";

(function(apiUrl) {
     function getMe(send) {                //Cria o usuário 
       return fetch(apiUrl + "/me")
       .then(function(response) {
          return response.json();
        })
      .then(function(user) {
          $username.innerHTML = user.username;

          if (user.avatar) {
            $avatar.style.backgroundImage = "url('" + user.avatar + "')";
          }
          return user;//Retorna o user para ser utilizado no envio de comentários(username, photo)
      })
      .catch(error => {
        alert("Erro ao receber dados do Usuário"+ "\r\n" +  error);
        });
      
    }

 
    //Função para enviar comentários 
    function send(user,post,message) {
        const request = new Request(apiUrl + "/posts/"+post.uuid+"/comments", {
        method: 'POST',
        body: JSON.stringify({username: user.username, message }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
      });
      
     function handleErrors(response) {
        if (!response.ok) throw new Error(response.status);
        return response;
      }  
        fetch(request)
       .then(res => handleErrors(res))
       .then(res => res.json())
       .then(res => { 
        document.getElementById("current-post-enterM").value = "";    //Limpa o input quando tem certeza que não deu erro
        populateComments(res)})                                      //assim o usuário não perde o conteúdo da mensagem
       .catch(error => {
         alert("Comentário não foi enviado, tente novamente");
         });
    }

    

//implementação da postagem
    function getPost() {
       return fetch(apiUrl + "/post")
       .then(function(response) {
          return response.json();
        })
       .then(function(post){
          $usernamePost.innerHTML = post.user.username;  //username
          $photo.style.backgroundImage = "url('" + post.photo + "')";  //foto de fundo

          
          if(post.user.avatar)   //foto de avatar 
          {
              $avatarPost.style.backgroundImage = "url('" + post.user.avatar + "')";
          }


          
          $location.innerHTML = post.location.city + "," + post.location.country; //localização 

      
          //ajeitando o horário atual  
          const data = post.created_at.split("T");  //separando o texto para conseguir o ano, mês e o dia
          data     = data[0].split("-");

          const year = data[0];
          const month= data[1];
          const   day= data[2];
    
          //definindo o texto de data na postagem
          $date.innerHTML = day + " DE " + new Date(year,month,day).toLocaleString('default', {month:'long'});
            
        //Preenchendo os comentários do posts
         populateComments(post.comments);

          child.style.paddingRight = child.offsetWidth - child.clientWidth + "px";
          document.getElementById('current-post-enterM').value = '';                      //Reseta o valor do input(comentário)

          
          return post;//Retorna o  post para ser utilizado no envio de comentários(uuid)
      })
      .catch(error => {
        alert("Erro ao receber dados da Postagem" + "\r\n" +  error);
        });
      

}
  


  function initialize() {
     var user;                      //Cria as variáveis que vão ser utilizadas como post e user 
     getMe().then(u => user = u);   // que vão ser usados posteriormente na criação de  comentários
     var post;
     getPost().then(p => post = p);
     
    
     //Envio de comentários pelo enter e botão enviar 
     document.addEventListener("keyup", function(event) {         
      if (event.keyCode === 13) 
      {
        enviarMensagem();
      }
     });

    document.getElementById("current-post-enter").onclick = enviarMensagem;   

     function enviarMensagem()   ///Envia o comentário se existe algum texto para ser enviado 
     {
        
        if(message.value != "" && message.replace(/\s/g, '').length)  
        {
          send(user,post,message);         
          scroll.scrollTop = scroll.scrollHeight ;           //Posiciona a visão dos comentários nos mais recentes
        }
     }
  
}

  function populateComments(comments)
{
  
  //Pegando a data atual e o hoário limite do dia
  //Não é possível pegar o dia ou horário atual pois alguns comentários fornecidos pela API tem horários após o atual
  //o que cria uma diferença de horária negativa
  

  let day=0;
  let hour=0;
  let minutes=0;
  if(comments.length > 0)
  {
    day = comments[comments.length - 1].created_at.substring(8,10); //Pegando dia do último comentário

      //Gerando um horário e um minuto aleatório entre o ultimo comentário e o tempo máximo do dia/hora
      let min = comments[comments.length - 1].created_at.substring(11,13); //Horário do ultimo comentário 
      let hour = getRandomInt(min,24);

      min = comments[comments.length - 1].created_at.substring(14,16);//Minuto do ultimo comentário 
      let minutes = getRandomInt(min,60);
  }
    
  function getRandomInt(min, max) {
    const Min = Math.ceil(min);
    const Max = Math.floor(max);
    return Math.floor(Math.random() * (Max - Min)) + min;
  }
 
  var today =  new Date();//Pegando a data atual(para ano e mês)
  var a = new Date(parseInt(today.getFullYear()),today.getMonth(), day, hour, minutes); 
  var b;

  container.innerHTML = "";

  commentsQtd.innerHTML = comments.length + " Comentários"; //contagem dos comentários

  comments.forEach(function populate(comment)
  {
    
    var div = document.createElement('div');   //cria a div que contém as informações 
    div.className = 'comment';

    var photo = document.createElement('div');  //foto de perfil 
    photo.className = 'comment_photo';
  
    var content = document.createElement('div');  //conteudo da mensagem( Nome +  comentário)
    content.className = 'comment_content';

    var time = document.createElement('div');  //texto do tempo da postagem 
    time.className = 'comment_time';

    photo.style.backgroundImage = "url('" + comment.user.avatar + "')"
    content.innerHTML = "<b>" + comment.user.username  + "</b> " + comment.message;

    //Separar os dados do created_at em ano, mês, dia e hora
    var data = comment.created_at.split("T");  //separa entre  a data(ano/mes/dia) e o horario(hora,minuto,segundo)
    var hour  = data[1].split(":");        //separa o horario
    data     = data[0].split("-");           //separa a data

    b = new Date(data[0],data[1]-1,data[2],hour[0],hour[1]);
    
    //diferença entre o horário do usuário e dos comentários 
    var  hh = Math.ceil(parseInt(a.getHours()) - parseInt(b.getHours()));
    var mm  = Math.ceil(parseInt(a.getMinutes()) - parseInt(b.getMinutes()));
    var dd = Math.ceil(parseInt(a.getUTCDate()-1) - parseInt(b.getUTCDate()));

    //escrita dos horários 
    if(dd >= 1)
      time.innerHTML = dd + "d" + hh + "h"
    else
        if(hh == 0)
        {
          if(mm == 0)
            time.innerHTML = "agora mesmo"
          else
            time.innerHTML = mm + "m";
        }
     else
      time.innerHTML = hh + "h";
    
    div.innerHTML += photo.outerHTML;
    div.innerHTML += content.outerHTML;
    div.innerHTML += time.outerHTML;
    container.innerHTML += div.outerHTML;

  });

}
    
  initialize();
})("https://taggram.herokuapp.com");
