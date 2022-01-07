tinymce.init({
  selector: 'textarea#tinymce-input',
  height: 500,
  menubar: false,
  resize: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar:
    'undo redo | formatselect | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help | fullscreen',
});
