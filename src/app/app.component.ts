import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from './student';
import { StudentService } from './student.service';
import {NgForm} from '@angular/forms'
import { NonNullAssert } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'studentService';
  public students: Student[];
  public editStudent:Student;
  public deleteStudent: Student;
  constructor(private studentService:StudentService) { }
  
  ngOnInit(): void{
    this.getStudent();
  }

  
  public getStudent():void{
     this.studentService.getStudent().subscribe(
      (response:Student[])=>{
        this.students=response;
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
      })
    }
    public onAddStudent(addForm: NgForm):void{
      document.getElementById('add-student-form').click();
      this.studentService.addStudent(addForm.value).subscribe(
        (response:Student)=>{
          console.log(response);
          this.getStudent();
          addForm.reset();
        },
        (error:HttpErrorResponse)=>{
          alert(error.message);
          addForm.reset();
        })

    }
    public onUpdateStudent(student: Student):void{
      this.studentService.updateStudent(student).subscribe(
        (response:Student)=>{
          console.log(response);
          this.getStudent();
        },
        (error:HttpErrorResponse)=>{
          alert(error.message);
        })

    }
    public onDeleteStudent(studentId:number):void{
      this.studentService.deleteStudent(studentId).subscribe(
        (response:void)=>{
          console.log(response);
          this.getStudent();
        },
        (error:HttpErrorResponse)=>{
          alert(error.message);
        })

    }

    
    onOpenModal(student:Student |null,mode:string ) :void{
      const container=document.getElementById('main-container')
      const button=document.createElement('button');
      button.type='button';
      button.style.display='none';
      button.setAttribute('data-toggle','modal');
      if(mode==='add'){
        button.setAttribute('data-target','#addStudentModal');
      }
      if(mode==='edit'){
        this.editStudent=student;
        button.setAttribute('data-target','#updateStudentModal');
      }
      if(mode==='delete'){
        this.deleteStudent=student;
        button.setAttribute('data-target','#deleteStudentModal');
      }
      container?.appendChild(button);
      button.click();
    }
    public searchStudents(key: string): void {
      console.log(key);
      const results: Student[] = [];
      for (const student of this.students) {
        if (student.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || student.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || student.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || student.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(student);
        }
      }
      this.students = results;
      if (results.length === 0 || !key) {
        this.getStudent();
      }
    }
}
