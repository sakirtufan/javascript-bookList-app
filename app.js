//Book Class: Represents a Book
class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


//UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        // const StoredBooks=[
        //     {
        //         title:'Book One',
        //         author:'John Doe',
        //         isbn: '343434'
        //     },
        //     {
        //         title:'Book Two',
        //         author:'James Charls',
        //         isbn: '456666'
        //     },
        // ];

        // const books = StoredBooks;

        const books = Store.getBooks();

        books.forEach(book => {
            UI.addBookToList(book);
        });
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class = "btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row);    
    }

    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message,className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);

        //vanish in 2 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2000);
    }
}


//Store Class : Handles Storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books =JSON.parse(localStorage.getItem('books')); 
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));

    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}



//Event: Display Books (görüntüleme)
document.addEventListener('DOMContentLoaded',UI.displayBooks);


//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e) => {

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate  (dogrulama)
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields','danger');
        UI.clearFields();
    }else{
            //örnek kitap olusturma
    const book = new Book(title,author,isbn);

    //add book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    //show success message
    UI.showAlert('Book added','success');

    //clear fields
    UI.clearFields();
    }
    

    e.preventDefault();

});


//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click',(e) => {

    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    UI.showAlert('Book removed','success');
});



