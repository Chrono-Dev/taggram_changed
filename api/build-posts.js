import  promisses  from "fs";
import  times  from "ramda";
import  path  from "path";
import  faker  from "faker"; 
const fs = promisses; 

import {buildPost, buildUser } from "./factories.js"; 
const build = async (file, size) => {
  const posts = times(() => {
    const hasAvatar = faker.random.boolean();

    return hasAvatar
      ? buildPost()
      : buildPost({ user: buildUser({ avatar: null }) });
  }, size);

  return await fs.writeFile(file, JSON.stringify(posts, null, "  "));
};

const [file, size] = process.argv.slice(2);
const postFile = file || path.resolve(__dirname, "./data/posts.json");
const postCount = parseInt(size) || 20;

build(postFile, postCount);
