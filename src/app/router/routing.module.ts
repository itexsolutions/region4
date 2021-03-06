import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';
import { RegistroComponent } from '../components/registro/registro.component';
import { InicioDeSesionComponent } from '../components/inicio-de-sesion/inicio-de-sesion.component';
import { OlvideContrasenaComponent } from '../components/olvide-contrasena/olvide-contrasena.component';
import { ActivacionUsuarioComponent } from '../components/activacion-usuario/activacion-usuario.component';
import { AvaluoComponent } from '../components/avaluo/avaluo.component';
import { ReporteComponent } from '../components/reporte/reporte.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdministracionComponent } from '../components/administracion/administracion.component';
import { CuponesComponent } from '../components/cupones/cupones.component';
import { ForgotpassComponent } from '../components/forgotpass/forgotpass.component';
import { ReenviarClaveComponent } from '../components/reenviar-clave/reenviar-clave.component';
import { TerminosyCondicionesComponent } from '../components/terminosy-condiciones/terminosy-condiciones.component';
import { TemplateReportComponent } from '../components/template-report/template-report.component';
import { TemplateUserActivationComponent } from '../components/template-user-activation/template-user-activation.component';
import { TemplateFacturacionComponent } from '../components/template-facturacion/template-facturacion.component';
import { TemplatePasswordRecoveryComponent } from '../components/template-password-recovery/template-password-recovery.component';
import { IsSecureGuard } from '../guards/is-secure-guard.guard';
import { PoliticaPrivacidadComponent } from '../components/politica-privacidad/politica-privacidad.component';
import { AvisoCookiesComponent } from '../components/aviso-cookies/aviso-cookies.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/iniciosesion',
        pathMatch: 'full'
    },
    {
        path: 'landing',
        component: LandingPageComponent
    },
    {
        path: 'registro',
        canActivate: [IsSecureGuard],
        component: RegistroComponent
    },
    {
        path: 'iniciosesion',
        canActivate: [IsSecureGuard],
        component: InicioDeSesionComponent
    },
    {
        path: "reestablecer",
        canActivate: [IsSecureGuard],
        component: OlvideContrasenaComponent
    },
    {
        path: "activacion",
        canActivate: [IsSecureGuard],
        component: ActivacionUsuarioComponent
    },
    {
        path: "generaravaluo",
        canActivate: [AuthGuard, IsSecureGuard],
        component: AvaluoComponent
    },
    {
        path: "terminos-y-condiciones",
        canActivate: [IsSecureGuard],
        component: TerminosyCondicionesComponent
    },
    {
        path: "politica-de-privacidad",
        canActivate: [IsSecureGuard],
        component: PoliticaPrivacidadComponent
    },
    {
        path: "politica-de-cookies",
        canActivate: [IsSecureGuard],
        component: AvisoCookiesComponent
    },
    {
        path: "forgotpass",
        canActivate: [IsSecureGuard],
        component: ForgotpassComponent
    },
    {
        path: "reenviarClave",
        canActivate: [IsSecureGuard],
        component: ReenviarClaveComponent
    },
    //Routings de muestra
    {
        path: "administracion",
        canActivate: [IsSecureGuard],
        component: AdministracionComponent
    },
    {
        path: "cupones",
        canActivate: [IsSecureGuard],
        component: CuponesComponent
    },
    //Fin de muestras
    {
        path: '**',
        redirectTo: '/generaravaluo'
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule { }
