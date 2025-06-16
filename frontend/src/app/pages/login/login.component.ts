import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error = ' ';

  constructor(private authService: AuthService, private router: Router) { }
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log("logged in successfully");
        this.router.navigate(['/dashboard'])
      },
      error: () => {
        this.error = "Invalid username or password";
      },
    });
  }
}
