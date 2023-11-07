import './style.css'
import { NES } from "./src/nes";
import { Controller, buttonDown, buttonUp } from "./src/controller";

var canvas = document.getElementById("frameCanvas")

var ctx = canvas.getContext("2d");
var imageData = ctx.getImageData(0,0,256,240);
var frameBuffer = new ArrayBuffer(imageData.data.length);
var frameBuffer8 = new Uint8ClampedArray(frameBuffer);
var frameBuffer32 = new Uint32Array(frameBuffer);

// AudioContext + audio buffers + samples lists
// =============================================

var audio = new AudioContext();
var audioprocessor = audio.createScriptProcessor(2048, 0, 2);
audioprocessor.connect(audio.destination);

// When the Audio processor requests new samples to play
audioprocessor.onaudioprocess = audioEvent => {

  // Ensure that we've buffered enough samples
  if(leftSamples.length > currentSample + 2048){
    for(var i = 0; i < 2048; i++){
    
      // Output (play) the buffers
      audioEvent.outputBuffer.getChannelData(0)[i] = leftSamples[currentSample];
      audioEvent.outputBuffer.getChannelData(1)[i] = rightSamples[currentSample];
      currentSample++;
    }
  }
}
var leftSamples = [];
var rightSamples = [];
var currentSample = 0;

// Load ROM + Start emulator
// =========================
var interval;
var start = file => {

  // Initialize JSNES
  NES.init({
    
    // Display each new frame on the canvas
    onFrame: function(frameBuffer){
      var i = 0;
      for(var x = 0; x < 256; ++x){
        for(var y = 0; y < 240; ++y){
          i = y * 256 + x;
          frameBuffer32[i] = 0xff000000 | frameBuffer[i];
        }
      }
      imageData.data.set(frameBuffer8);
      ctx.putImageData(imageData, 0, 0);
    },
    
    // Add new audio samples to the Audio buffers
    onAudioSample: function(left, right){
      leftSamples.push(left);
      rightSamples.push(right);
    }
  });

  // Reset emulator
  NES.reset();
  
  // Send ROM to emulator
  NES.load_rom(file);
  
  // First 10 frames are garbage
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();
  NES.frame();

  // 60 fps loop
  clearInterval(interval);
  interval = setInterval(NES.frame, 16);
  
  // Controller #1 keys listeners
  onkeydown = e => {
    if(e.keyCode == 37) buttonDown(1, Controller.BUTTON_LEFT);
    else if(e.keyCode == 38) buttonDown(1, Controller.BUTTON_UP);
    else if(e.keyCode == 39) buttonDown(1, Controller.BUTTON_RIGHT);
    else if(e.keyCode == 40) buttonDown(1, Controller.BUTTON_DOWN);
    else if(e.keyCode == 88) buttonDown(1, Controller.BUTTON_A); // X
    else if(e.keyCode == 67) buttonDown(1, Controller.BUTTON_B); // C
    else if(e.keyCode == 27) buttonDown(1, Controller.BUTTON_SELECT);
    else if(e.keyCode == 13) buttonDown(1, Controller.BUTTON_START);
  }

  onkeyup = e => {
    if(e.keyCode == 37) buttonUp(1, Controller.BUTTON_LEFT);
    else if(e.keyCode == 38) buttonUp(1, Controller.BUTTON_UP);
    else if(e.keyCode == 39) buttonUp(1, Controller.BUTTON_RIGHT);
    else if(e.keyCode == 40) buttonUp(1, Controller.BUTTON_DOWN);
    else if(e.keyCode == 88) buttonUp(1, Controller.BUTTON_A); // X
    else if(e.keyCode == 67) buttonUp(1, Controller.BUTTON_B); // C
    else if(e.keyCode == 27) buttonUp(1, Controller.BUTTON_SELECT);
    else if(e.keyCode == 13) buttonUp(1, Controller.BUTTON_START);
  }
};

// Load ROM from file input
fileInput.onchange = () => {
  audio.resume()
  var fileReader = new FileReader();
  fileReader.readAsBinaryString(fileInput.files[0]);
  fileReader.onload = () => {
    start(fileReader.result);
  }
}

// load ROM from disk
var play = path => {
  file = new XMLHttpRequest;
  file.open('GET', path);
  file.overrideMimeType("text/plain; charset=x-user-defined");
  file.send();
  file.onload = function(){
    start(file.responseText);
  }
}