// const socket = io('/');
// const videoGrid = document.getElementById('video-grid');
// var peer = new Peer(undefined, {
//     path: '/peerjs',
//     host: '/',
//     port: '3030'
// });
// let videoStream;
// const video = document.createElement('video');

// video.muted = true;

// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
// }).then(stream => {
//     videoStream = stream;
//     addVideoStream(video, stream);

//     peer.on('call', call => {
//         call.answer(stream);
//         const video = document.createElement('video');
//         call.on('stream', userVideoStream => {
//             addVideoStream(video, userVideoStream);
//         });
//     });

//     socket.on('user-connected', (userId) => {
//         connectToNewUser(userId, stream);
//     });
// });

// peer.on('open', id => {
//     console.log(id);
//     socket.emit('join-room', ROOM_ID, id);
// });




// const connectToNewUser = (userId ,stream) => {
//     console.log('New User: ' + userId.toString());
//     const call = peer.call(userId, stream);
//     const video = document.createElement('video');
//     call.on('stream', userVideoStream => {
//         addVideoStream(video,userVideoStream);
//     });
// }
// const addVideoStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     });
//     console.log('appended');
//     videoGrid.append(video);
// }

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030'
})
let myVideoStream;
const myVideo = document.createElement('video')
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
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
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
