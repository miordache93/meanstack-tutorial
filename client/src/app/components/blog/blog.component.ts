import { BlogService } from './../../services/blog.service';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form: FormGroup;
  processing = false;
  username;
  blogPosts;


  constructor(private fb: FormBuilder, private authService: AuthService, private blogService: BlogService) { }

  ngOnInit() {
    this.createNewBlogForm();
    this.getAllBlogs();
    this.authService.getProfile().subscribe((profile:any) => {
      this.username = profile.user.username;
    })
  }

  createNewBlogForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5)
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    });
  }

  enableForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  disableForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-z0-9 ]+$/);

    if(regExp.test(controls.value)) {
      return null;
    } else {
      return { alphaNumericValidation: true };
    }
  }

  newBlogForm() {
    this.newPost = true;
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();

    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  draftComment() {
    
  }

  goBack() {
    window.location.reload();
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe((res:any) => {
      this.blogPosts = res.blogs;
    });
  }

  onBlogSubmit() {
    console.log(this.form.value);
    this.disableForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    };
    this.blogService.newBlog(blog).subscribe((res:any) => {
      if(!res) {
        this.messageClass = 'alert alert-danger';
        this.message = res.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = res.message;
        this.getAllBlogs();
        setTimeout(() => {
          this.processing = false;
          this.newPost = false;
          this.message = false;
          this.form.reset();
          this.enableForm();
        }, 2000);
      }
    });
  }

}
