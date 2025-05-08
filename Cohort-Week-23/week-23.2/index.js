var pc1 = new RTCPeerConnection(), // sender side
    pc2 = new RTCPeerConnection(); // receiver side

var start = () => navigator.mediaDevices.getUserMedia({audio:true, video: true })
    .then(stream => {
        attachVideo(v1, v1info, stream);
        pc1.addStream(stream);
    })
    .catch(console.error);

var dimensions = v => v.videoWidth +"x"+ v.videoHeight;
var attachVideo = (videoTag, vinfo, stream) => {
    videoTag.srcObject = stream;
    videoTag.addEventListener("loadedmetadata", e => update(vinfo, dimensions(videoTag)), false );
};

var addCandidate = (pc, can) => can && pc.addIceCandidate(can).catch(console.error);
pc1.onicecandidate = e => {
    console.log('pc1.onicecandidate:', e.candidate);
    addCandidate(pc2, e.candidate);
};
pc2.onicecandidate = e => {
    console.log('pc2.onicecandidate:', e.candidate);
    addCandidate(pc1, e.candidate);
};
pc1.oniceconnectionstatechange = e => console.log("pc1.iceConnState:", pc1.iceConnectionState);
pc2.oniceconnectionstatechange = e => console.log("pc2.iceConnState:", pc2.iceConnectionState);

pc1.onnegotiationneeded = e => {
    pc1.createOffer().then(d => {
        console.log("pc1.offer_sdp:", d.sdp);
        return pc1.setLocalDescription(d);
    })
    .then(() => pc2.setRemoteDescription(pc1.localDescription))
    .then(() => pc2.createAnswer())
    .then(d => {
        console.log("pc2.answer_sdp:", d.sdp);
        return pc2.setLocalDescription(d);
    })
    .then(() => pc1.setRemoteDescription(pc2.localDescription))
    .catch(console.error);
};
pc2.ontrack = e => {
    console.log('pc2.ontrack, stream id:', e.streams[0].id);
    console.log('pc2.ontrack, track id:', e.track.id, 'label:', e.track.label, 'kind:', e.track.kind, e.track);
    return attachVideo(v2, v2info, e.streams[0]);
};

var update = (div, msg) => div.innerHTML = msg;