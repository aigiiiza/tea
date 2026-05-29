import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  orderForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  productName = '';

  // Валидация: только буквы (русские и английские)
  private namePattern = /^[A-Za-zА-Яа-я]+$/;
  // Валидация адреса: буквы, цифры, пробелы, дефис, слеш
  private addressPattern = /^[A-Za-zА-Яа-я0-9\s\-\/]+$/;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    // Создаем форму
    this.orderForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      last_name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      phone: ['', [Validators.required, this.phoneValidator]],
      country: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      product: [{ value: '', disabled: true }],
      address: ['', [Validators.required, Validators.pattern(this.addressPattern)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    // Получаем название товара из URL
    this.route.queryParams.subscribe(params => {
      this.productName = params['product'] || '';
      this.orderForm.patchValue({ product: this.productName });
    });
  }

  // Кастомный валидатор для телефона
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    let value = control.value || '';
    const digits = value.replace(/\D/g, '');  // Убираем всё кроме цифр

    // Должно быть ровно 11 цифр
    if (digits.length !== 11) {
      return { invalidPhone: true };
    }

    // Проверяем формат: может начинаться с +, затем 11 цифр
    const phonePattern = /^\+?\d{11}$/;
    if (!phonePattern.test(value)) {
      return { invalidPhone: true };
    }

    return null;
  }

  onSubmit(): void {
    // Если форма невалидна, показываем ошибки
    if (this.orderForm.invalid) {
      Object.keys(this.orderForm.controls).forEach(key => {
        const control = this.orderForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;

    // Собираем данные для отправки
    const formData = {
      name: this.orderForm.get('name')?.value,
      last_name: this.orderForm.get('last_name')?.value,
      phone: this.orderForm.get('phone')?.value,
      country: this.orderForm.get('country')?.value,
      zip: this.orderForm.get('zip')?.value,
      product: this.productName,
      address: this.orderForm.get('address')?.value,
      comment: this.orderForm.get('comment')?.value || ''
    };

    // Отправляем POST-запрос на сервер
    this.http.post('https://testologia.ru/order-tea', formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response && response.success === 1) {
          this.submitSuccess = true;  // Показываем сообщение об успехе
        } else {
          this.submitError = true;
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = true;
      }
    });
  }
}
