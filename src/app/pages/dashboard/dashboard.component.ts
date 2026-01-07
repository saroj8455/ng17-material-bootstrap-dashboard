import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { User } from '../../auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  // We type this as 'User' because the Dashboard doesn't care about tokens
  currentUser: User | undefined;

  // CHART CONFIGURATION
  public barChartType: ChartConfiguration<'bar'>['type'] = 'bar';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { 
        data: [65, 59, 80, 81, 56, 55, 40], 
        label: 'Sales ($)',
        backgroundColor: 'rgba(13, 110, 253, 0.7)', // Bootstrap Primary Color
        hoverBackgroundColor: 'rgba(13, 110, 253, 1)',
        borderColor: '#0d6efd',
        borderWidth: 1,
        borderRadius: 5
      },
      { 
        data: [28, 48, 40, 19, 86, 27, 90], 
        label: 'Visitors',
        backgroundColor: 'rgba(25, 135, 84, 0.7)', // Bootstrap Success Color
        hoverBackgroundColor: 'rgba(25, 135, 84, 1)',
        borderColor: '#198754',
        borderWidth: 1,
        borderRadius: 5
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to fill container height
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  user: any; // Variable to hold the user data

  constructor(private router: Router) {
    // Retrieve the data passed from the router state
    // Note: This only works if you navigated here; refreshing the page might lose this data.
    const navigation = this.router.getCurrentNavigation();
    
    // Check if state exists, otherwise try history.state (fallback)
    // if (navigation?.extras.state) {
    //   this.user = navigation.extras.state['userData'];
    // } else {
    //   this.user = history.state['userData'];
    // }
    if (navigation?.extras.state) {
      // It is safe to assign AuthResponse to a User variable 
      // because AuthResponse 'extends' User.
      this.currentUser = navigation.extras.state['userData'];
    }
  }

  ngOnInit() {
    // Log to check if data arrived
    console.log('Dashboard User Data:', this.user);
  }
  // Your chart configuration logic stays the same
  // public barChartType: ChartConfiguration<'bar'>['type'] = 'bar';
  
  // public barChartData: ChartConfiguration<'bar'>['data'] = {
  //   labels: ['Jan', 'Feb', 'Mar'],
  //   datasets: [
  //     { data: [65, 59, 80], label: 'Series A' }
  //   ]
  // };

  // public barChartOptions: ChartOptions<'bar'> = {
  //   responsive: true,
  // };
}
