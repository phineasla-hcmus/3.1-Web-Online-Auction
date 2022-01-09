$(document).ready(function (e) {
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
  );
  pond = FilePond.create(document.querySelector('#images'), {
    acceptedFileTypes: ['image/*'],
    imagePreviewHeight: 128,
    allowMultiple: true,
    instantUpload: false,
    allowProcess: false,
    allowReorder: true,
    maxFiles: 10,
    imageValidateSizeMinHeight: 128,
    maxFileSize: '2MB',
  });

  $('#addProductForm').submit(async function (e) {
    e.preventDefault();
    const formdata = new FormData(this);
    // append FilePond files into the form data
    pondFiles = pond.getFiles();
    for (let i = 0; i < pondFiles.length; i++) {
      // append the blob files
      formdata.append('images', pondFiles[i].file);
    }

    $.ajax({
      url: $(this).attr('action'),
      data: formdata,
      dataType: 'JSON',
      processData: false,
      contentType: false,
      method: $(this).attr('method'),
      success: function (res) {
        console.log(res);
        if (res.redirect) {
          window.location.replace(res.url);
        } else {
          res.forEach((err) => toastr.error(err.msg));
        }
      },
    });
  });
});
