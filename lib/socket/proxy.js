import cv from 'opencv';

const detectConfigFile = './node_modules/opencv/data/haarcascade_frontalface_alt2.xml';

// camera properties
const camWidth = 320;
const camHeight = 240;
const camFps = 10;
const camInterval = 1000 / camFps;

// face detection properties
const rectColor = [0, 255, 0];
const rectThickness = 2;

// initialize camera
const camera = new cv.VideoCapture(0);

camera.setWidth(camWidth);
camera.setHeight(camHeight);

const frameHandler = (err, im) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err);
    }
    im.detectObject(detectConfigFile, {}, (error, faces) => {
      if (error) {
        return reject(error);
      }
      let face;
      for (let i = 0; i < faces.length; i++) {
        face = faces[i];
        im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
      }
      return resolve(im);
    });
  });
};

module.exports = function (socket) {
  const frameSocketHanlder = (err, im) => {
    return frameHandler(err, im)
      .then((img) => {
        socket.emit('frame', {
          buffer: img.toBuffer(),
        });
      });
  };
  const handler = () => {
    camera.read(frameSocketHanlder);
  };
  setInterval(handler, camInterval);
};
