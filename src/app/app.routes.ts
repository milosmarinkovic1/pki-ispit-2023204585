import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: '/toys', pathMatch: 'full' },
  { 
    path: 'toys', 
    loadComponent: () => import('./components/toy-list/toy-list').then(m => m.ToyList)
  },
  { 
    path: 'search', 
    loadComponent: () => import('./components/search/search').then(m => m.Search)
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart').then(m => m.Cart)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile').then(m => m.Profile)
  },
  { 
    path: '**', 
    loadComponent: () => import('./components/toy-list/toy-list').then(m => m.ToyList)
  }
,
{ 
  path: 'toy/:id', 
  loadComponent: () => import('./components/toy-detail/toy-detail').then(m => m.ToyDetail)
}

];