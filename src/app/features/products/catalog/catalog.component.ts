import { Component, OnInit } from '@angular/core';
import { TeaService, TeaProduct } from '../../services/tea.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  products: TeaProduct[] = [];     // Массив товаров
  isLoading = true;                // Флаг загрузки
  errorMessage = '';               // Сообщение об ошибке

  constructor(private teaService: TeaService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.teaService.getTeas().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки:', err);
        this.errorMessage = 'Не удалось загрузить товары. Попробуйте позже.';
        this.isLoading = false;
      }
    });
  }
}
