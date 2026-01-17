import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'yield-tracker',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/yield-tracker/yield-tracker.component').then(m => m.YieldTrackerComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/yield-tracker/batch-form/batch-form.component').then(m => m.BatchFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/yield-tracker/batch-detail/batch-detail.component').then(m => m.BatchDetailComponent)
      }
    ]
  },
  {
    path: 'enzymes',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/enzymes/enzyme-list/enzyme-list.component').then(m => m.EnzymeListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/enzymes/enzyme-form/enzyme-form.component').then(m => m.EnzymeFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/enzymes/enzyme-detail/enzyme-detail.component').then(m => m.EnzymeDetailComponent)
      }
    ]
  },
  {
    path: 'organisms',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/organisms/organism-list/organism-list.component').then(m => m.OrganismListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/organisms/organism-form/organism-form.component').then(m => m.OrganismFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/organisms/organism-detail/organism-detail.component').then(m => m.OrganismDetailComponent)
      }
    ]
  },
  {
    path: 'phylogenetic-tree',
    loadComponent: () => import('./features/phylogenetic-tree/phylogenetic-tree.component').then(m => m.PhylogeneticTreeComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

