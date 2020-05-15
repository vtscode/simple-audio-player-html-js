let audio;
let pauseBtn        = $('#pause');
let playBtn         = $('#play');
let stopBtn         = $('#stop');
let nextBtn         = $('#next');
let prevBtn         = $('#prev');
let muteBtn         = $('#muted');
let loopBtn         = $('#loop');
let volBtn          = $('#volume');
let durationFile    = $('#duration');
let progressFile    = $('#progress');
let listFile        = $('#playlist li');
let listFileLast    = $('#playlist li:last-child');
let listFileFirst   = $('#playlist li:first-child');
//Hide Pause
$('#pause').hide();

initAudio(listFileFirst);

function initAudio(element){
	let song = element.attr('song');
	let title = element.text();
	let cover = element.attr('cover');
	let artist = element.attr('artist');
	
	//Create audio object
	audio = new Audio('media/'+ song);
	
	//Insert audio info
	$('.artist').text(artist);
	$('.title').text(title);
	
	//Insert song cover
	$('img.cover').attr('src','images/covers/'+cover);
	
	listFile.removeClass('active');
	element.addClass('active');
}

const pausePlay = () => {
  playBtn.hide();
  pauseBtn.show();
}
const playPause = () => {
  playBtn.show();
  pauseBtn.hide();
}
const playPauseTimeout = () => {
  playBtn.show();
  setTimeout(() => {
    pausePlay();
  }, 10);
}

//Play button
playBtn.click(function(){
  audio.play();
	pausePlay();
	showDuration();
});

//Pause button
pauseBtn.click(function(){
	audio.pause();
	playPause();
});

//Stop button
stopBtn.click(function(){
  audio.pause();	
	audio.currentTime = 0;
  playPause();
});

//Next button
nextBtn.click(function(){
	audio.pause();
	let next = $('#playlist li.active').next();
	if(next.length == 0){
		next = listFileFirst;
  }
  playPauseTimeout();
	initAudio(next);
	audio.play();
	showDuration();
});

//Prev button
prevBtn.click(function(){
	audio.pause();
	let prev = $('#playlist li.active').prev();
	if(prev.length == 0){
		prev = listFileLast;
  }
  playPauseTimeout();
	initAudio(prev);
	audio.play();
	showDuration();
});

//Playlist song click
listFile.click(function(){
	audio.pause();
	initAudio($(this));
	pausePlay();
	audio.play();
	showDuration();
});

//Volume control
volBtn.change(function(){
  audio.volume = parseFloat(this.value / 100);
});

const muteVolume = () => {
  let muted = audio.muted;
  audio.muted = !muted;
  audio.muted ? muteBtn.css('border','solid brown .2em') : muteBtn.css('border','none');
}
const loopFile = () => {
  let loop = audio.loop;
  audio.loop = !loop;
  audio.loop ? loopBtn.css('border','solid brown .2em') : loopBtn.css('border','none');
}

//Time/Duration
const showDuration = () => {
  $(audio).bind('timeupdate',function(){
    let durationData,playTime;
    durationData = audio.duration;
    playTime = audio.currentTime;
		//Get hours and minutes
		let s = parseInt(audio.currentTime % 60);
		let m = parseInt(audio.currentTime / 60) % 60;
		if(s < 10){
			s = '0'+s;
		}
		durationFile.html(m + ':'+ s);
		let value = 0;
		if(audio.currentTime > 0){
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
    progressFile.css('width',value+'%');
    let next = $('#playlist li.active').next();
    if(parseInt(durationData) == parseInt(playTime) && !audio.loop) {
      playPauseTimeout();
      if(next.length == 0){
        next = listFileFirst;
      }
      initAudio(next);
      audio.play();
	    showDuration();
    }
	});
}
