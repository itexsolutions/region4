import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/components/common/selectitem';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YalsService } from '../../services/yals.service';
import { YalsRequest } from '../../models/yals.model';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import * as html2pdf from '../../../assets/js/html2pdf';
import { MessageService } from 'primeng/components/common/messageservice';
import { MailService } from '../../services/mail.service';
import { ObservablesService } from '../../services/observables.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-avaluo',
  templateUrl: './avaluo.component.html',
  styleUrls: ['./avaluo.component.css'],
  providers: [
    { provide: 'Window', useValue: window }
  ]
})
export class AvaluoComponent implements OnInit {

  elementToPrint: any;

  isHidden = false;
  nomCliente: any = {};
  index = 0;
  step1 = false;
  step2 = false;
  step3 = true;
  step4 = false;
  selectedAge: string[] = [];
  avaluoForm: any = {};
  facturacion: any = {};
  avaluoResponse: any = null;
  loading = false;
  otroCorreo: any;
  datosHTML: any;
  public user: Client = new Client();
  constructor(private observableService: ObservablesService, private mail: MailService, private router: Router, private yals: YalsService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.observableService.userObservable$.subscribe(user => {
      this.user = user ? user : new Client();
    });
  }

  enviarCorreo() {
    const yals_req: YalsRequest = this.avaluoForm;
    yals_req.id_tipo_propiedad = (+yals_req.id_tipo_propiedad);
    yals_req.recamaras = (+yals_req.recamaras);
    yals_req.banos = (+yals_req.banos);
    yals_req.medios_banos = (+yals_req.medios_banos);
    yals_req.estacionamientos = (+yals_req.estacionamientos);
    yals_req.area_construida = (+yals_req.area_construida);
    yals_req.superficie_terreno = (+yals_req.superficie_terreno);
    yals_req.edad = (+yals_req.edad);



    const HTMLFacturacion: any = document.getElementById("facturacion");
    this.loading = true;
    this.yals.generateRequest(yals_req, null).subscribe(response => {
      this.avaluoResponse = response;
      if (!this.avaluoResponse.data.response.similares) {
        this.messageService.add({
          severity: 'error', summary: 'Datos Insuficientes',
          detail: `No se han encontrado datos suficientes para realizar un reporte detallado, 
          favor de ponerse en contacto con ventas@region4.com.mx para la devolución del efectivo`
        });
      }
      this.index = 4;
      this.loading = false;
      this.messageService.add({
        severity: 'info', summary: 'Reporte',
        detail: `Se ha generado satisfactoriamente su reporte.`
      });
    }, error => {
      this.loading = false;
      this.messageService.add({
        severity: 'error', summary: 'Error procesando reporte',
        detail: `Se ha producido un error procesando su reporte, verifique los datos proporcionados 
        o su conexion a internet e intente nuevamente, en caso contrario porfavor contacte a soporte.`
      });
    });
    if (this.isHidden) {
      // this.mail.sendMail({ to: "ventas@region4.mx", subject: "Facturacion", text: this.facturacion })
      //console.log(HTMLFacturacion.innerHTML);
      this.mail.sendMail({
        from: "facturacion@valorinmuebles.mx",
        //to: "samuelherrerafuente@gmail.com", subject: "Facturacion",
        to: "ventas@region4.mx", subject: "Facturacion",
        //html: "<pre>" + JSON.stringify(this.facturacion, undefined, 2) + "</pre>"
        html: HTMLFacturacion.innerHTML
      })
        .subscribe(response => {
          this.messageService.add({
            severity: 'info', summary: 'Reporte',
            detail: `Se esta generando su factura, se la haremos llegar en un plazo maximo de 72horas.`
          });
        });
    }
  }

  imprimir() {
    if (this.avaluoResponse.data.response.similares) {
      this.elementToPrint = document.getElementById('element-to-print');
    } else {
      this.elementToPrint = document.getElementById('basic-element-to-print');
    }
    const datauri = html2pdf(this.elementToPrint, {
      margin: 0.4,
      filename: 'reporte.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      action: "save"
    });
  }


  enviarACorreo() {
    if (this.otroCorreo !== "") {
      if (this.avaluoResponse.data.response.similares) {
        this.elementToPrint = document.getElementById('element-to-print');
      } else {
        this.elementToPrint = document.getElementById('basic-element-to-print');
      }
      const reportHTML: any = document.getElementById("reportTemplate");
      this.nomCliente['name'] = this.user.name;
      const datauri = html2pdf(this.elementToPrint, {
        margin: 0.4,
        filename: 'reporte.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      });
      datauri.then(data => {
        this.yals.sendReport({
          from: "ventas@valorinmuebles.com",
          to: this.otroCorreo,
          subject: "Reporte de avalúo",
          text: ``,
          html: reportHTML.innerHTML,
          file: data.split(';base64,').pop()
        }).subscribe((response: any) => {
          console.log("Respuesta de mail: ", response);
          this.otroCorreo = "";
        });
      });



      this.messageService.add({
        severity: 'success', summary: 'Correo enviado',
        detail: 'Se a enviado el reporte a su correo.'
      });

    } else {
      this.messageService.add({
        severity: 'error', summary: 'Error correo',
        detail: 'El correo no pudo ser enviado, verifiquee la direccion de correo introducida.'
      });
    }
  }

  // stepchanged(event: any) {
  // }

}
