import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}
let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans-offical',
    title: 'newjens minji',
    content: 'make up',
    likeCount: 80,
    commentCount: 25,
  },
  {
    id: 2,
    author: 'newjeans-offical',
    title: 'newjens jsy',
    content: 'make up',
    likeCount: 82,
    commentCount: 250,
  },
  {
    id: 3,
    author: 'newjeans-offical',
    title: 'newjens kuk',
    content: 'make up',
    likeCount: 800,
    commentCount: 25,
  },
];

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostById(id: number): PostModel {
    const post = posts.find((post) => post.id === id);
    if (!post) throw new NotFoundException('no data');
    return post;
  }

  createPost(title: string, author: string, content: string) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      title: title,
      author: author,
      content: content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];
    return post;
  }

  updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    const post: PostModel = posts.find((post) => post.id === postId);
    if (!post) throw new NotFoundException('no data');

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    posts = posts.map((prevPost) => (prevPost.id === postId ? post : prevPost));

    return post;
  }

  deletePost(postId: number) {
    const post: PostModel = posts.find((post) => post.id === postId);
    if (!post) throw new NotFoundException('no data');
    posts = posts.filter((post) => post.id !== postId);
    return postId;
  }
}
