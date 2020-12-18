const $usernamePost = document.getElementById("current-post-user-username");
const $photo = document.getElementById("current-post-photo");
const $avatarPost   =  document.getElementById("current-post-user-avatar");
const $location = document.getElementById("current-post-user-location");
const $date     = document.getElementById("current-post-date");

const parent = document.getElementById('current-post-content-commentsContainer');
const child = document.getElementById('current-post-content-comments');

const message = document.getElementById("current-post-enterM").value;
const scroll = document.getElementById("current-post-content-comments");   

const container = document.getElementById("current-post-content-comments");
const commentsQtd = document.getElementById("current-post-qtd");

export {$usernamePost, $photo, $avatarPost, $location, $date, parent, child, message, scroll, container, commentsQtd};