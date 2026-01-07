import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ConfigService } from './services/config.service';
import { FlexiconsComponent } from './components/flexicons/flexicons.component';
import { MaterialConfigModule } from './primeconfig/materialconfig.module';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MaterialConfigModule,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'clientapi';
  showSidebar: boolean = true;
  // Variable to hold the stream of data
  isLoggedIn$: Observable<boolean>;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router
  ) {
    // Connect it to the service
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    // Listen to route changes to hide Sidebar on Login page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // If URL is '/login', hide the sidebar. Otherwise, show it.
        this.showSidebar = event.urlAfterRedirects !== '/login';
      }
    });
  }

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
