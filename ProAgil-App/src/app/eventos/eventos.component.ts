import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ThisReceiver } from '@angular/compiler';
defineLocale('pt-br', ptBrLocale);




@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = "Eventos";

  eventosFiltrados?: Evento[];
  eventos!: Evento[];
  evento!: Evento;
  modoSalvar = 'post';

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm!: FormGroup;
  bodyDeletarEvento = '';

  file!: any;

  _filtroLista: string = "";
  fileNameToUpdate!: string;
  dataAtual!: string;

  constructor(private eventoService: EventoService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private localeService: BsLocaleService,
              private toastr: ToastrService ) { 
                this.localeService.use('pt-br');
              }

  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, tamplate: any){
    this.modoSalvar = 'put';
    this.openModal(tamplate);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(tamplate: any){
    this.modoSalvar = 'post';
    this.openModal(tamplate);
  }

  excluirEvento(evento: Evento, tamplate: any){
    this.openModal(tamplate);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o evento ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(tamplate: any){
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        tamplate.hide();
        this.getEventos();
        this.toastr.success('Deletado com sucesso!!');

      }, error =>{
        this.toastr.error('Erro ao tentar deletar!!');
      }
    );
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();

  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImgaem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required]

    })
  }


  onFileChange(event:any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length){
      this.file = <File>event.target.files[0];
      console.log(this.file);
    }
  }

  uploadImage(){
    if(this.modoSalvar == 'post'){
    const nomeArquivo = this.evento.imagemURL.split('\\', 3);
    this.evento.imagemURL = nomeArquivo[2]
    this.eventoService.postUpload(this.file, nomeArquivo[2])
    .subscribe(
      () => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      }
      );
    } else{
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );


    }
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){
      if(this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImage();


        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso!!');
          }, error =>{
            this.toastr.error(`Erro ao inserir: ${error}`);
          }
        );
      }else{
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImage();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com sucesso!!');
          }, error =>{
            this.toastr.error(`Erro ao editar: ${error}`);
          }
        );
      }
    }
  }

  getEventos(){
      this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {this.eventos = _eventos;
              this.eventosFiltrados = _eventos;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar eventos: ${error}`);
      }


    )
   
    
  }

}
