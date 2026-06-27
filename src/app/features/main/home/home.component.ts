import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { timer, Subscription } from 'rxjs';

// Объявляем jQuery для TypeScript (чтобы не было ошибок)
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private isOnHomePage = true;  // Флаг: находимся ли на главной странице
  private subscription?: Subscription;  // Для отписки от таймера

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Запускаем таймер на 10 секунд (10000 мс)
    // Если пользователь еще на главной странице, показываем попап
    this.subscription = timer(10000).subscribe(() => {
      if (this.isOnHomePage) {
        this.showPopup();
      }
    });
  }

  ngOnDestroy(): void {
    // Когда пользователь уходит со страницы, отписываемся от таймера
    this.isOnHomePage = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showPopup(): void {
    // Создаем HTML для попапа
    const popupHtml = `
      <div class="popup-content text-center">
        <h3>Посмотрите наши чайные коллекции</h3>
        <button class="btn btn-primary mt-3" id="goToCatalogBtn">Смотреть</button>
      </div>
    `;

    // Открываем попап с помощью Magnific Popup
    $.magnificPopup.open({
      items: {
        src: '<div class="white-popup">' + popupHtml + '</div>',
        type: 'inline'
      },
      closeOnBgClick: true,
      callbacks: {
        open: () => {
          // Добавляем обработчик на кнопку "Смотреть"
          const btn = document.getElementById('goToCatalogBtn');
          if (btn) {
            btn.addEventListener('click', () => {
              $.magnificPopup.close();      // Закрываем попап
              this.router.navigate(['/catalog']);  // Переходим в каталог
            });
          }
        }
      }
    });
  }
}
