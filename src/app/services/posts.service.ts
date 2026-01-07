import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private baseUrl = 'https://dummyjson.com/posts';

  constructor(private http: HttpClient) {}

  getPosts(limit: number = 10, skip: number = 0): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}?limit=${limit}&skip=${skip}`);
  }
  getPostById(id: number): Observable<Post> {
  return this.http.get<Post>(`${this.baseUrl}/${id}`);
}
}