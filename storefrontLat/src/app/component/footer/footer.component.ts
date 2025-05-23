import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  name: string = 'manoj';
  footerData = [
    {
      title: 'Get to Know Us',
      links: [
        { label: 'About Us', url: '#' },
        { label: 'Careers', url: '#' },
        { label: 'Press Releases', url: '#' },
        { label: 'Amazon Cares', url: '#' },
      ],
    },
    {
      title: 'Make Money with Us',
      links: [
        { label: 'Sell on Amazon', url: '#' },
        { label: 'Become an Affiliate', url: '#' },
        { label: 'Advertise Your Products', url: '#' },
        { label: 'Amazon Pay', url: '#' },
      ],
    },
    {
      title: 'Let Us Help You',
      links: [
        { label: 'COVID-19 and Amazon', url: '#' },
        { label: 'Your Account', url: '#' },
        { label: 'Returns Centre', url: '#' },
        { label: 'Help', url: '#' },
      ],
    },
  ];
}
