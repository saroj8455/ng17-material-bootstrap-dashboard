import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // For loader
import { MatChipsModule } from '@angular/material/chips'; // For tags
import { Post, PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit {
  
  // Columns to display (Responsive logic handles hiding them via CSS)
  displayedColumns: string[] = ['title', 'tags', 'stats'];
  dataSource = new MatTableDataSource<Post>([]);
  
  isLoading = true;
  totalPosts = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private postsService: PostsService,private router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.postsService.getPosts(30, 0).subscribe({
      next: (res) => {
        this.dataSource.data = res.posts;
        this.totalPosts = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  openPost(id: number) {
  this.router.navigate(['/posts', id]);
}
}
