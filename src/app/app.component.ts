import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListaSimple } from './data-structures/lista-simple';
import { ListaDoble } from './data-structures/lista-doble';
import { ListaCircular } from './data-structures/lista-circular';
import { ListaCircularDoble } from './data-structures/lista-circular-doble';

import { Paciente } from './models/paciente.model';
import { RegistroAtencion } from './models/registro-atencion.model';
import { Medico } from './models/medico.model';
import { MiembroComite } from './models/miembro-comite.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // las 4 estructuras que pide el ejercicio
  listaEspera = new ListaSimple<Paciente>();
  historial = new ListaDoble<RegistroAtencion>();
  medicosGuardia = new ListaCircular<Medico>();
  comite = new ListaCircularDoble<MiembroComite>();

  // arreglos que uso en el html para mostrar los datos (con *ngFor)
  pacientes: Paciente[] = [];
  registros: RegistroAtencion[] = [];
  medicos: Medico[] = [];
  miembros: MiembroComite[] = [];

  medicoDeGuardia: Medico | null = null;
  miembroActivo: MiembroComite | null = null;
  segundosParaRotar = 10;

  // contadores para ir generando ids distintos
  idPaciente = 1;
  idRegistro = 1;
  idMedico = 1;
  idMiembro = 1;

  // variables que se enganchan con los inputs del formulario (ngModel)
  nombrePaciente = '';
  edadPaciente: number | null = null;
  motivoPaciente = '';

  nombreMedico = '';

  nombreMiembro = '';
  rolMiembro = '';

  constructor() {
    // datos de ejemplo 
    this.agregarMedico('Dr. Christian Home');
    this.agregarMedico('Dra. Laura Campo');
    this.agregarMedico('Dr. Eddie Delgado');

    this.agregarMiembro('Sebastian Leiton', 'Director');
    this.agregarMiembro('Lorena Alvarez', 'Secretaria');

    this.agregarPaciente('Freddy Mosquera', 40, 'Dolor de cabeza');
    this.agregarPaciente('Alba Rodriguez', 48, 'Artritis');

    // cada 10 segundos cambia el medico de guardia solo
    setInterval(() => {
      this.rotarMedico();
    }, 10000);

    // este otro timer es solo para mostrar la cuenta regresiva en pantalla
    setInterval(() => {
      if (this.segundosParaRotar > 0) {
        this.segundosParaRotar = this.segundosParaRotar - 1;
      }
    }, 1000);
  }

  // pacientes en espera (lista simple) 

  agregarPaciente(nombre: string, edad: number, motivo: string) {
    const paciente: Paciente = { id: this.idPaciente, nombre: nombre, edad: edad, motivo: motivo };
    this.idPaciente = this.idPaciente + 1;

    this.listaEspera.agregar(paciente);
    this.pacientes = this.listaEspera.aArreglo();
  }

  agregarPacienteDesdeForm() {
    if (this.nombrePaciente === '' || this.edadPaciente === null || this.motivoPaciente === '') {
      alert('Faltan datos del paciente');
      return;
    }
    this.agregarPaciente(this.nombrePaciente, this.edadPaciente, this.motivoPaciente);
    this.nombrePaciente = '';
    this.edadPaciente = null;
    this.motivoPaciente = '';
  }

  // cuando se atiende: sale de la lista simple y entra al historial
  atenderPaciente(id: number) {
    const paciente = this.listaEspera.eliminarPorId(id);
    if (paciente === null) return;

    this.pacientes = this.listaEspera.aArreglo();

    const registro: RegistroAtencion = {
      id: this.idRegistro,
      paciente: paciente.nombre,
      medico: this.medicoDeGuardia !== null ? this.medicoDeGuardia.nombre : 'Sin medico',
      hora: new Date().toLocaleTimeString()
    };
    this.idRegistro = this.idRegistro + 1;

    this.historial.agregarAlInicio(registro);
    this.registros = this.historial.aArreglo();
  }

  //  medicos de guardia (lista circular) 

  agregarMedico(nombre: string) {
    const medico: Medico = { id: this.idMedico, nombre: nombre };
    this.idMedico = this.idMedico + 1;

    this.medicosGuardia.agregar(medico);
    this.medicos = this.medicosGuardia.aArreglo();

    if (this.medicoDeGuardia === null && this.medicosGuardia.actual !== null) {
      this.medicoDeGuardia = this.medicosGuardia.actual.valor;
    }
  }

  agregarMedicoDesdeForm() {
    if (this.nombreMedico === '') return;
    this.agregarMedico(this.nombreMedico);
    this.nombreMedico = '';
  }

  rotarMedico() {
    const siguiente = this.medicosGuardia.rotar();
    this.medicoDeGuardia = siguiente;
    this.segundosParaRotar = 10;
  }


  //  comite (lista circular doble)

  agregarMiembro(nombre: string, rol: string) {
    const miembro: MiembroComite = { id: this.idMiembro, nombre: nombre, rol: rol };
    this.idMiembro = this.idMiembro + 1;

    this.comite.agregar(miembro);
    this.miembros = this.comite.aArreglo();

    if (this.miembroActivo === null && this.comite.actual !== null) {
      this.miembroActivo = this.comite.actual.valor;
    }
  }

  agregarMiembroDesdeForm() {
    if (this.nombreMiembro === '' || this.rolMiembro === '') return;
    this.agregarMiembro(this.nombreMiembro, this.rolMiembro);
    this.nombreMiembro = '';
    this.rolMiembro = '';
  }

  quitarMiembro(id: number) {
    this.comite.eliminarPorId(id);
    this.miembros = this.comite.aArreglo();
    this.miembroActivo = this.comite.actual !== null ? this.comite.actual.valor : null;
  }

  siguienteMiembro() {
    this.miembroActivo = this.comite.siguienteMiembro();
  }

  anteriorMiembro() {
    this.miembroActivo = this.comite.anteriorMiembro();
  }
}
