import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import RouterModule for Back button

import { MatChipsModule } from '@angular/material/chips'; // Optional styling
import { Post, PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatChipsModule],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  
  post: Post | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    // Get ID from URL (e.g. /posts/5 -> id = 5)
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.postsService.getPostById(Number(id)).subscribe(data => {
        this.post = data;
      });
    }
  }
}