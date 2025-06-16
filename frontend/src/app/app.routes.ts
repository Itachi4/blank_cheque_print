import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TemplateEditorComponent } from './pages/template-editor/template-editor.component';
import { ChequeGeneratorComponent } from './components/cheque-generator/cheque-generator.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'template-editor', component: TemplateEditorComponent },
    { path: 'cheque-generator', component: ChequeGeneratorComponent },
];
