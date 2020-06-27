import { Topic, Post } from "./model";
import { env, util, ContractPromiseResult,  ContractPromise ,context, logging, storage, u128, PersistentMap, PersistentVector } from "near-sdk-as";

const ADMIN = "adminsaru.testnet";

const Topics = new PersistentMap<u64, Topic>("t: ");
const Posts = new PersistentMap<u64, Post>("p: ");
let PostHolder = new PersistentMap<u64, Array<u64>>("ph: ");
const Charity = new PersistentMap<u64, string>("cha: ");


export function createTopic(name: string): void {
  var tempTopic = new Topic(storage.getPrimitive<u64>("tID", 0), name, context.sender);
  Topics.set(storage.getPrimitive<u64>("tID", 0), tempTopic);
  let newtID = storage.getPrimitive<u64>("tID", 0) + 1;
  storage.set<u64>("tID", newtID);
}

export function totalTopics(): u64 {
  return storage.getPrimitive<u64>("tID", 0);
}

export function getTopicDetails(topicID: u64): Topic {
  return Topics.getSome(topicID);
}

export function addPost(topicID: u64, charity: u64, ipfsURL: string): void {
  var tempPost = new Post(storage.getPrimitive<u64>("pID", 0), context.sender, charity, ipfsURL);
  Posts.set(storage.getPrimitive<u64>("pID", 0), tempPost);

  // add post map
  aP(topicID, storage.getPrimitive<u64>("pID", 0));

  let newpID = storage.getPrimitive<u64>("pID", 0) + 1;
  storage.set<u64>("pID", newpID);
}

function aP(topicID: u64, postID: u64): void {
  if(PostHolder.contains(topicID)){
    let arr = PostHolder.getSome(topicID);
    arr.push(postID);
    PostHolder.set(topicID, arr);
  }else{
    PostHolder.set(topicID, [postID]);
  }
}

export function getPostsForTopic(topicID: u64): Array<u64> {
  if(PostHolder.contains(topicID)){
    return PostHolder.getSome(topicID);
  }else {
    return [];
  }
}



export function totalPosts(): u64 {
  return storage.getPrimitive<u64>("pID", 0);
}

export function getPostDetails(postID: u64): Post {
  return Posts.getSome(postID);
}

export function showCharity(): Array<string> {
  if(storage.contains("chap")){
    let tC= storage.getPrimitive<i32>("chap", 0);
    let arr = new Array<string>();
    for (let i = 0; i < tC; ++i) arr[i] = Charity.getSome(i);
    return arr;
  }else{
    return [];
  }

}

export function addCharity(charityAddress: string): void {
  var tC = storage.getPrimitive<i32>("chap", 0);
  Charity.set(tC, charityAddress);
  let nC = storage.getPrimitive<i32>("chap", 0) + 1;
  storage.set<i32>("chap", nC);
}


function transfer(account: string, amount: u64): void {
  const contract_name_encoded = util.stringToBytes(account);
  const pro = env.promise_batch_create(contract_name_encoded.byteLength,  contract_name_encoded.dataStart);
  let amt = u128.mul(u128.fromU64(amount), u128.from('1000000000000000000000000'));
  env.promise_batch_action_transfer(pro, u128.from(amt).toUint8Array().dataStart);
} 

function _conv(val: u128): u64 {
  let tou64 = u128.div(val, u128.from('1000000000000000000000000')).toU64();
  return tou64;
}

export function tip(postID: u64): void {
  let postwa = Posts.getSome(postID);
  let tA = _conv(context.attachedDeposit);
  postwa.donated += tA;
  let ownerShare = tA / 10;
  transfer(postwa.owner, ownerShare);
  let charity = Charity.getSome(postwa.charity);
  let toCharity = tA - ownerShare;
  transfer(charity, toCharity);
  Posts.set(postID, postwa);
}


/**
 * Implement Ownersip with ADMIN Account
 * Implement check of Charity
*/