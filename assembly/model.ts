import { PersistentVector } from "near-sdk-as";

@nearBindgen
export class Topic {
  topicID: u64;
  name: string;
  onwer: string;

  constructor(topicID: u64, name: string, owner: string){
    this.topicID = topicID;
    this.name = name;
    this.onwer = owner;
  }
}

@nearBindgen
export class Post {
  postID: u64;
  owner: string;
  charity: u64;
  ipfsURL: string;
  donated: u64;

  constructor(postID: u64, owner: string, charity: u64, ipfsURL: string){
    this.postID = postID;
    this.owner = owner;
    this.charity = charity;
    this.ipfsURL = ipfsURL;
  }

}
