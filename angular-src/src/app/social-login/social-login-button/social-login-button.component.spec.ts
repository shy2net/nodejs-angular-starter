import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginButtonComponent } from './social-login-button.component';

describe('SocialLoginButtonComponent', () => {
  let component: SocialLoginButtonComponent;
  let fixture: ComponentFixture<SocialLoginButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialLoginButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
