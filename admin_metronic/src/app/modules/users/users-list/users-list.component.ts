import { Component, OnInit } from '@angular/core';
import { User } from '../../material/formcontrols/autocomplete/autocomplete.component';
import { UsersService } from '../_services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUsersComponent } from '../components/add-users/add-users.component';
import { EditUsersComponent } from '../components/edit-users/edit-users.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  isLoading$: any;

  constructor(
    public _userService: UsersService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;

    this.isLoading$.subscribe((val: boolean) => {
      console.log('¿Está cargando usuarios?:', val);
    });

    this.allUsers();
  }

  allUsers() {
    this._userService.allUsers().subscribe((resp: any) => {
      console.log('👥 Usuarios recibidos del backend:', resp);
      this.users = resp.users;

      // 👇 Ahora tendrás toda la información para verificar si viene lastname
      console.log('✅ Users cargados en this.users:', this.users);
    });
  }

  openCreate() {
    const modalRef = this.modalService.open(AddUsersComponent, {
      centered: true,
      size: 'lg'
    });

    modalRef.componentInstance.UserC.subscribe((resp: any) => {
      console.log('Usuario nuevo creado:', resp);
      this.users.unshift(resp.user);
    });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.allUsers();
        }
      },
      (reason) => {
        console.log('Modal cerrado con reason:', reason);
      }
    );
  }

  editUser(user: User) {
    const modalRef = this.modalService.open(EditUsersComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.user_selected = user;

    modalRef.componentInstance.UserE.subscribe((resp: any) => {
      let INDEX = this.users.findIndex((u) => u._id === resp.user._id);
      if (INDEX !== -1) {
        this.users[INDEX] = resp.user;
      }
      console.log('Usuario actualizado correctamente:', this.users[INDEX]);
      this.users.unshift(resp.user);
    });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.allUsers();
        }
      },
      (reason) => {
        console.log('Modal cerrado con reason:', reason);
      }
    );
  }

  delete(user: User) {
    console.log('Eliminar usuario seleccionado:', user);
  }
}
