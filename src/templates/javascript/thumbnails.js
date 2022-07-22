function thumbnail(event) {
  let file = event.target.files[0];
  let fileReader = new FileReader();
  if (file.type.match('image')) {
    fileReader.onload = function () {
      fileReader.readAsDataURL(file);
      let img = document.createElement('img');
      img.src = fileReader.result;
      document.getElementsByTagName('div')[0].appendChild(img);
    };
  } else if (file.type.match('video')) {
    fileReader.onload = function () {
      let blob = new Blob([fileReader.result], { type: file.type });
      let url = URL.createObjectURL(blob);
      let video = document.createElement('video');
      let timeupdate = function () {
        if (snapImage()) {
          video.removeEventListener('timeupdate', timeupdate);
          video.pause();
        }
      };
      video.addEventListener('loadeddata', function () {
        if (snapImage()) {
          video.removeEventListener('timeupdate', timeupdate);
        }
      });
      let snapImage = function () {
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image = canvas.toDataURL();
        let success = image.length > 100000;
        if (success) {
          let img = document.createElement('img');
          img.src = image;
          document.getElementsByTagName('div')[0].appendChild(img);
          URL.revokeObjectURL(url);
        }
        return success;
      };
      video.addEventListener('timeupdate', timeupdate);
      video.preload = 'metadata';
      video.src = url;
      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;
      video.play();
    };
    fileReader.readAsArrayBuffer(file);
  }
}
