const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const msgList = document.getElementById('messages');
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030'
});
let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    });


    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
    });


  });
})



myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}


var message = $('input');

$('html').keydown((q) => {
  if (q.which == 13 && message.val().length !== 0) {
    console.log(message.val());
    socket.emit('message', message.val());
    message.val('');
  }
});

socket.on('createMessage', (msg, userId) => {
  console.log(msg);
  const ele = '<li style="padding: 0; margin: 0; color: white;"> <b>User </b> : <br>' + msg + '</li>';
  $("#msgList").append(ele);
  scrollToBottom();

});

const scrollToBottom = () => {
  var w = $('.main__chat__window');
  w.scrollTop(w.prop("scrollHeight"));
}

const muteFunctionality = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnMuteButton();
  }else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}
const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnMuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>UnMute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}