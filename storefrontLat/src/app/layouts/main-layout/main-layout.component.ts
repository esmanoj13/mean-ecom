import { Component } from '@angular/core';
import { HeaderComponent } from '../../component/header/header.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
