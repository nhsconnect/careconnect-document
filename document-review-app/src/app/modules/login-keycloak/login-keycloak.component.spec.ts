import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginKeycloakComponent } from './login-keycloak.component';

describe('LoginKeycloakComponent', () => {
  let component: LoginKeycloakComponent;
  let fixture: ComponentFixture<LoginKeycloakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginKeycloakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginKeycloakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
