import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeaService, TeaProduct } from '../../services/tea.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: TeaProduct | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private teaService: TeaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.loadProduct(id);
    } else {
      this.errorMessage = 'Товар не найден';
      this.isLoading = false;
    }
  }

  loadProduct(id: number): void {
    this.teaService.getTeas().subscribe({
      next: (products) => {
        this.product = products.find(p => p.id === id) || null;
        this.isLoading = false;
        if (!this.product) {
          this.errorMessage = 'Товар не найден';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка загрузки товара';
      }
    });
  }

  buyProduct(): void {
    if (this.product) {
      this.router.navigate(['/checkout'], {
        queryParams: { product: this.product.title }
      });
    }
  }
}
