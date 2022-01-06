$('#images').fileinput({
  dropZoneEnabled: true,
  allowedFileTypes: ['image'],
  theme: 'fa',
  required: true,
  showUpload: false,
  showClose: false,
  resizeImage: true,
  initialPreviewAsData: true,
  minFileCount: 3,
  maxFileCount: 10,
  minImageWidth: 256,
  maxImageHeight: 1024,
});
